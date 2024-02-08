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
    random_seed = cfg.get(keys.RANDOM_SEED)
    epsilon = cfg.get(keys.EPSILON)
    delta = cfg.get(keys.DELTA)
    weight_multiplier = cfg.get(keys.WEIGHT_MULTIPLIER)
    query_types = cfg.get(keys.QUERY_TYPES)
    columns_to_convert = cfg.get(keys.COLUMNS_TO_CONVERT)
    column_conversion_type = cfg.get(keys.COLUMN_CONVERSION_TYPE)
    gcp_bucket_name = cfg.get(keys.GCP_BUCKET_NAME)
    gcp_data_folder_path = cfg.get(keys.GCP_DATA_FOLDER_PATH)
    static_columns = cfg.get(keys.STATIC_COLUMNS)
    stratify_first_k = cfg.get(keys.STRATIFY_FIRST_K)
    
    # TODO: Verify the contents of the config file
    ...
    
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
    # Calculate the appropriate privacy budget parameters
    # TODO: Make dynamic for all query types

    df_dynamic_ldp = utilities.convert_df_type(df_dynamic, columns_to_convert, column_conversion_type)
    
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
    except Exception as e:
        print(f"Error applying Shuffle Differential Privacy: {e}")
        return
    print("\SDP RESULT")
    print(df_sdp.head(), "\n")
    
    # Get Query results for dataset, LDP, and SDP datasets
    gdp_module = global_dp.GlobalDifferentialPrivacy(epsilon)
    
    
    # Need to combine the datasets back together for shuffle and local DP
    ldp_data_full = df_static.join(df_ldp.set_index('ID'), on='ID', how='inner', sort=True, validate=None)

    sdp_data_full = df_static.join(df_sdp.set_index('ID'), on='ID', how='inner', sort=True, validate=None)
    # Need to convert the shuffle DP columns to category
    
    query_results = []
    for (dataset, apply_gdp) in [(df, True), (ldp_data_full, False), (sdp_data_full, False)]:
        query_results.append(run_queries(utilities.convert_df_type(dataset, columns_to_convert, column_conversion_type), static_columns, stratify_first_k, gdp_module, query_types, apply_gdp))
    
    # Get GDP results
    ...
    
    # Run evaluation scripts
    sdp_shape, sdp_pairs = evaluate.evaluate_synthetic_dataset(df, sdp_data_full)
    ldp_shape, ldp_pairs = evaluate.evaluate_synthetic_dataset(df, ldp_data_full)
    
    # Do whatever outputs...
    filename = 'combined_results.csv'
    query_type_column = 'query_type'
    
    original_data = query_results[1][0].copy()
    df_original = pd.DataFrame()
    for key in original_data:
        row = original_data[key].copy()
        row[query_type_column] = 'original_data_' + key
        df_original = pd.concat([df_original,pd.json_normalize(row)])
    df_original = df_original.reset_index(drop=True)

    gdp_result = query_results[1][0].copy()
    df_gdp = pd.DataFrame()
    for key in gdp_result:
        row = gdp_result[key].copy()
        row[query_type_column] = 'gdp_result_' + key
        df_gdp = pd.concat([df_gdp,pd.json_normalize(row)])
    df_gdp = df_gdp.reset_index(drop=True)
    # df_gdp.to_csv('gdp_results.csv')

    ldp_result = query_results[1][0].copy()
    df_ldp = pd.DataFrame()
    for key in ldp_result:
        row = ldp_result[key].copy()
        row[query_type_column] = 'ldp_result_' + key
        df_ldp = pd.concat([df_ldp,pd.json_normalize(row)])
    df_ldp = df_ldp.reset_index(drop=True)
    # df_ldp.to_csv('ldp_results.csv')

    sdp_result = query_results[2][0].copy()
    df_sdp = pd.DataFrame()
    for key in sdp_result:
        row = sdp_result[key].copy()
        row[query_type_column] = 'sdp_result_' + key
        df_sdp = pd.concat([df_sdp,pd.json_normalize(row)])
    df_sdp = df_sdp.reset_index(drop=True)
    # df_sdp.to_csv('sdp_results.csv')


    cols = df_original.columns.tolist()
    cols.remove(query_type_column)
    for column in cols:
        df_gdp['absolute_error_'+column] = abs(df_original[column] - df_gdp[column])
        df_ldp['absolute_error_'+column] = abs(df_original[column] - df_ldp[column])
        # df_sdp['absolute_error_'+column] = abs(df_original[column] - df_sdp[column])
        df_original['absolute_error_'+column] = abs(df_original[column] - df_original[column])

    df = pd.concat([df_gdp, df_ldp, df_sdp, df_original])
    df.reset_index(drop=True).to_csv(filename)
    
    
    return

def run_queries(df: pd.DataFrame, grouping_variables: list[str], stratify_first_k: int, gdp_module: global_dp.GlobalDifferentialPrivacy, query_types: list[str], apply_noise: bool = False):


    query_result = {}
    noisy_result = {}
    
    # Configure the dataframe partitions to apply the queries to (one or more)
    # df is expected to already have the column types appropriately converted to 'category'
    df_groups = [df]
    if grouping_variables[0] != "":
        df_groups = df.groupby(grouping_variables[:-5])
        print(len(df_groups))
        
    # For each query type and group, execute the appropriate query
    for query_type in query_types:
        for group_name, df_group in df_groups:
            print("NAME:", group_name)
            q_result = gdp_module.apply_query_to_df(df_group.drop(grouping_variables, axis=1), query_type)    
            query_result.update({query_type + '_GROUP_' + str(group_name):q_result})
            # If GDP is being applied, also derive the noisy outputs
            if apply_noise:
                sensitivity = gdp_module.calculate_sensitivity(df, query_type)
                n_result = gdp_module.apply_global_dp(q_result, sensitivity)
                noisy_result.update({query_type + '_GROUP_' + str(group_name):n_result})  
    return query_result, noisy_result
    
if __name__ == '__main__':
    # Execute the main program
    typer.run(main)
