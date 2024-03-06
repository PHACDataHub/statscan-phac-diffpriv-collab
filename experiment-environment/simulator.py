import os
from datetime import datetime
from pathlib import Path

import typer
import pandas as pd

import config
import utilities
import data_loader
import local_dp
import shuffle_dp
import global_dp
import evaluate


def run_pipeline(config_file: str, epsilon: float, cfg: config.Config, keys: dict) -> None: 
  
    # Load the experiment parameters from the config file with the appropriate keys
    random_seed = cfg.get(keys.RANDOM_SEED)
    delta = cfg.get(keys.DELTA)
    weight_multiplier = cfg.get(keys.WEIGHT_MULTIPLIER)
    query_types = cfg.get(keys.QUERY_TYPES)
    columns_to_convert = cfg.get(keys.COLUMNS_TO_CONVERT)
    column_conversion_type = cfg.get(keys.COLUMN_CONVERSION_TYPE)
    gcp_bucket_name = cfg.get(keys.GCP_BUCKET_NAME)
    gcp_data_folder_path = cfg.get(keys.GCP_DATA_FOLDER_PATH)
    static_columns = cfg.get(keys.STATIC_COLUMNS)
    stratify_first_k = cfg.get(keys.STRATIFY_FIRST_K)
    results_dir = cfg.get(keys.RESULTS_DIR)
    ldp_absolute_diff_filename = cfg.get(keys.LDP_ABSOLUTE_DIFF_FILENAME)
    sdp_absolute_diff_filename = cfg.get(keys.SDP_ABSOLUTE_DIFF_FILENAME)
    gdp_query_results_filename = cfg.get(keys.GDP_QUERY_RESULTS_FILENAME)
    ldp_query_results_filename = cfg.get(keys.LDP_QUERY_RESULTS_FILENAME)
    sdp_query_results_filename = cfg.get(keys.SDP_QUERY_RESULTS_FILENAME)
    original_type = cfg.get(keys.ORIGINAL_TYPE)
    gdp_type = cfg.get(keys.GDP_TYPE)
    ldp_type = cfg.get(keys.LDP_TYPE)
    sdp_type = cfg.get(keys.SDP_TYPE)
    query_type_column = cfg.get(keys.QUERY_TYPE_COLUMN)
    quality_report_filename = cfg.get(keys.QUALITY_REPORT_FILENAME)
    column_shape_filename = cfg.get(keys.COLUMN_SHAPE_FILENAME)
    column_pair_trends_filename = cfg.get(keys.COLUMN_PAIR_TRENDS_FILENAME)
    
    # Set the random seeds
    utilities.set_random_seeds(random_seed)
    
    # Load the data partition to be used (the '/' value is needed at the end)
    df = data_loader.load_data_sources(gcp_bucket_name, gcp_data_folder_path)
    
    # Adjust weights based on the selected scaling factor
    df['WTS_M'] *= weight_multiplier
    # (2) Seperate the static values from the other values, which are dynamic
    df_static = df[static_columns].copy()
    df_dynamic = df.drop(static_columns[:-1], axis=1)
    
    
    # Initialize the LDP object
    ldp_module = local_dp.LocalDifferentialPrivacy(epsilon)

    # Convert the approprate columns to category
    df_dynamic_ldp = utilities.convert_df_type(df_dynamic, columns_to_convert, column_conversion_type)
    
    # Calculate the sensitivity of the columns according to the query type
    sensitivity_dict = ldp_module.calculate_sensitivity(df_dynamic_ldp, query_types[0])
    
    
    # Apply LDP to the specified dataframe, excluding static parameters and converting categorical column types
    try:
        df_ldp = ldp_module.apply_to_dataframe(df_dynamic_ldp, sensitivity_dict)
    except Exception as e:
        print(f"Error applying local differential privacy: {e}")
        return
    
    print("\nNo DP RESULT")
    print(df_dynamic.head())
    
    print("\nLDP RESULT")
    print(df_ldp.head())

    
    # Prepare the SDP instance
    sdp_module = shuffle_dp.ShuffleDifferentialPrivacy(epsilon, delta)
    # Apply SDP on the data without converting the column types
    try:
        df_sdp = sdp_module.shuffle_model(df_dynamic)
        df_sdp = df_sdp.sort_values(by=['ID'])
    except Exception as e:
        print(f"Error applying Shuffle Differential Privacy: {e}")
        return
    
    
    print("\nSDP RESULT")
    print(df_sdp.head(), "\n")
    
    # Prepare the GDP instance
    gdp_module = global_dp.GlobalDifferentialPrivacy(epsilon)
    
    # Need to combine the datasets back together for shuffle and local DP
    ldp_data_full = df_static.join(df_ldp.set_index('ID'), on='ID', how='inner', sort=True, validate=None)

    sdp_data_full = df_static.join(df_sdp.set_index('ID'), on='ID', how='inner', sort=True, validate=None)
    
    results_dir = f"{results_dir}_{datetime.today().strftime('%Y-%m-%d')}"
    if not os.path.exists(results_dir):
        os.mkdir(results_dir)
        
    epsilon_dir = os.path.join(results_dir, f'eps_{epsilon}')
    if not os.path.exists(epsilon_dir):
        os.mkdir(epsilon_dir)
    
    # Run query for GDP and apply noise, compute the queries in the case of SDP and LDP
    query_results = []
    for (dataset, apply_gdp) in [(df, True), (ldp_data_full, False), (sdp_data_full, False)]:
        query_results.append(run_queries(utilities.convert_df_type(dataset, columns_to_convert, column_conversion_type), static_columns, stratify_first_k, gdp_module, query_types, apply_gdp))
        
    # get absolute error between original and data after applying LDP/SDP
    evaluate.get_absolute_error(df, ldp_data_full, epsilon_dir, ldp_absolute_diff_filename, ldp_type, original_type, epsilon)
    evaluate.get_absolute_error(df, sdp_data_full, epsilon_dir, sdp_absolute_diff_filename, sdp_type, original_type, epsilon)
    
    # Run evaluation scripts
    ldp_shape, ldp_pairs = evaluate.evaluate_synthetic_dataset(df, ldp_data_full, epsilon_dir, ldp_type, quality_report_filename, column_shape_filename, column_pair_trends_filename, epsilon)
    sdp_shape, sdp_pairs = evaluate.evaluate_synthetic_dataset(df, sdp_data_full, epsilon_dir, sdp_type, quality_report_filename, column_shape_filename, column_pair_trends_filename, epsilon)

    # consolidate the results after querying and applying noise
    df_original = utilities.consolidate_results(query_results, 0, 0, original_type, query_type_column)
    df_gdp = utilities.consolidate_results(query_results, 0, 1, gdp_type, query_type_column)
    df_ldp = utilities.consolidate_results(query_results, 1, 0, ldp_type, query_type_column)
    df_sdp = utilities.consolidate_results(query_results, 2, 0, sdp_type, query_type_column)
    
    # calculate the absolute difference between the original query and the query after applying DP
    evaluate.get_absolute_error_queries(df_original, df_gdp, gdp_type, original_type, epsilon_dir, gdp_query_results_filename, query_type_column, epsilon)
    evaluate.get_absolute_error_queries(df_original, df_ldp, ldp_type, original_type, epsilon_dir, ldp_query_results_filename, query_type_column, epsilon)
    evaluate.get_absolute_error_queries(df_original, df_sdp, sdp_type, original_type, epsilon_dir, sdp_query_results_filename, query_type_column, epsilon)
    
def run_queries(df: pd.DataFrame, grouping_variables: list[str], stratify_first_k: int, gdp_module: global_dp.GlobalDifferentialPrivacy, query_types: list[str], apply_noise: bool = False):


    query_result = {}
    noisy_result = {}
    
    # Configure the dataframe partitions to apply the queries to (one or more)
    # df is expected to already have the column types appropriately converted to 'category'
    df_groups = [df]
    if grouping_variables[0] != "":
        print("\nStratification variables:", grouping_variables[:stratify_first_k[-1]+1])
        
        df_groups = df.groupby(grouping_variables[:stratify_first_k[-1]+1])
        print("\nNumber of groups:", len(df_groups))
        
    print(f"\n{'_______'*15}")
    # For each query type and group, execute the appropriate query
    for query_type in query_types:
        print(f"\nExecuting query: {query_type}")
        for group_name, df_group in df_groups:
            print("\nName of group:", group_name)
            q_result = gdp_module.apply_query_to_df(df_group.drop(grouping_variables, axis=1), query_type)    
            query_result.update({query_type + '_GROUP_' + str(group_name):q_result})
            # If GDP is being applied, also derive the noisy outputs
            if apply_noise:
                sensitivity = gdp_module.calculate_sensitivity(df, query_type)
                n_result = gdp_module.apply_global_dp(q_result, sensitivity)
                noisy_result.update({query_type + '_GROUP_' + str(group_name):n_result})  
    return query_result, noisy_result    

def main(config_file: str = typer.Argument(..., help="Location of the .yml config file (default name is run_config.yml).")) -> None:
    """
    <describe pipeline when done>
    TODO: Define requirements.txt file
    
    Args:
        config_file: Path of the .yml config file to be used (default name is run_config.yml)
    """
    # Test if the input filepath is correct
    if len(config_file) > 0 and not os.path.isfile(config_file):
        raise FileNotFoundError("Incorrect input yaml filepath.")
        
    # Load the configuration file
    cfg = utilities.get_config(config_file)
    
    # Load the experiment parameters from the config file with the appropriate keys
    keys = config.Config()
    epsilon = cfg.get(keys.EPSILON)
    
    for eps in epsilon:
        print(f"\n{'******'*15}")
        print(f"Executing pipeline for epsilon={eps}\n")
        run_pipeline(config_file, eps, cfg, keys)
    
if __name__ == '__main__':
    # Execute the main program
    typer.run(main)
