import os
import utilities
import config
import pandas as pd
import config 
import typer
from typing import List
from datetime import datetime

def get_query_dfs(root_dirs: List[str], eps: str, query_results_filename: str):
    """
    Function to fetch the related dataframes to be aggregated from the root directories 

    Args:
        root_dirs: list of directories where the query_results_filename is present
        epsilon: the value of epsilon for which the files are to be aggregated
        query_results_filename: the filenames that are to be aggregated

    Returns:
        The list fo dataframes that are to be aggregated from the root directories
    """
    epsilon_folder_name = '_eps_' + eps
    query_results_eps_filename = query_results_filename[0] + epsilon_folder_name + ".csv"
    
    query_dfs = []

    for root_dir in root_dirs:
        epsilon_directory = os.path.join(root_dir, epsilon_folder_name[1:])
        if os.path.isdir(epsilon_directory):
            query_filename_abs_path = os.path.join(epsilon_directory, query_results_eps_filename)
            if os.path.isfile(query_filename_abs_path):
                query_dfs.append(query_filename_abs_path)

    return query_dfs

def arrange_columns(query_dfs: List[str], dp_type: str) -> List[str]:
    """
    Arrange columns of dataframes for aggregation.

    Args:
        query_dfs: List of file paths to query dataframes.
        dp_type: Prefix used to identify columns related to a particular privacy mechanism.

    Returns:
        List of arranged column names for aggregation.
    """
    
    dfs = [pd.read_csv(file_path) for file_path in query_dfs]

    dp_query_column = dp_type + '_query_type'
    original_query_column = 'original_query_type'
    
    # Extract the name of the base columns without suffixes
    columns = dfs[0].columns
    base_columns = []
    
    for column in columns:
        original_column_names = column.split('_', 1)[1]
        column_dp_type = column.split('_', 1)[0]
        
        if column_dp_type==dp_type and \
           column!= dp_query_column and \
           column!=original_query_column and \
           'absolute_error' not in original_column_names:
            base_columns.append(original_column_names)
        
    # Arrange the columns
    arranged_columns = [dp_query_column]
    
    for column in base_columns:
        original_column = 'original_'+ column
        dp_column = dp_type + '_' + column
        
        absolute_error_column = dp_type + '_absolute_error_' + column
        column_group = [original_column, dp_column, absolute_error_column]
        arranged_columns[:] = [*arranged_columns, *column_group]
        
    return arranged_columns

def calculate_average(query_dfs: List[str], arranged_columns: List[str], dp_type: str) -> pd.DataFrame:
    """
    Calculate average values for numeric columns across multiple dataframes.

    Args:
        query_dfs: List of file paths to query dataframes.
        arranged_columns: List of arranged column names for aggregation.
        dp_type: Prefix used to identify columns related to a particular privacy mechanism.

    Returns:
        DataFrame containing average values for each numeric column across all dataframes.
    """
    
    dfs = [pd.read_csv(file_path) for file_path in query_dfs]
    query_type_column = dp_type + '_query_type'
    
    # Extract numeric columns
    numeric_columns = [column for column in arranged_columns if pd.api.types.is_numeric_dtype(dfs[0][column])]
    
    # Calculate averages
    sum_values = {column: sum(df[column] for df in dfs) for column in numeric_columns}
    count_values = {column: len(dfs) for column in numeric_columns}
    averages = {column: sum_values[column] / count_values[column] for column in numeric_columns}
    
    # Create average dataframe
    average_df = pd.DataFrame(averages, index=dfs[0].index)
    average_df.insert(0, query_type_column, dfs[0][query_type_column])  # Insert query_type_column as the first column
    
    return average_df

def aggregation_pipeline(cfg: config.Config, keys: dict) -> None:
    """
    Perform an aggregation pipeline to calculate averages for different privacy mechanisms and save the results.

    Args:
        cfg: Configuration object containing settings for the aggregation pipeline.
        keys: Dictionary containing keys used to access configuration settings.

    Returns:
        None. Results are saved to specified directories.
    """
    root_dirs = cfg.get(keys.ROOT_DIRS)
    epsilon = cfg.get(keys.EPSILON)
    gdp_query_results_filename = cfg.get(keys.GDP_QUERY_RESULTS_FILENAME)
    ldp_query_results_filename = cfg.get(keys.LDP_QUERY_RESULTS_FILENAME)
    sdp_query_results_filename = cfg.get(keys.SDP_QUERY_RESULTS_FILENAME)
    agg_results_dir = cfg.get(keys.AGG_RESULTS_DIR)
    gdp_average_df_filename = cfg.get(keys.GDP_AVERAGE_DF_FILENAME)
    ldp_average_df_filename = cfg.get(keys.LDP_AVERAGE_DF_FILENAME)
    sdp_average_df_filename = cfg.get(keys.SDP_AVERAGE_DF_FILENAME)
    gdp_type = cfg.get(keys.GDP_TYPE)
    ldp_type = cfg.get(keys.LDP_TYPE)
    sdp_type = cfg.get(keys.SDP_TYPE)
    
    # fetch the related dataframes to be aggregated from the root directories 
    gdp_query_dfs = get_query_dfs(root_dirs, epsilon, gdp_query_results_filename.split('.'))
    ldp_query_dfs = get_query_dfs(root_dirs, epsilon, ldp_query_results_filename.split('.'))
    sdp_query_dfs = get_query_dfs(root_dirs, epsilon, sdp_query_results_filename.split('.'))
    
    # Arrange columns of dataframes for aggregation.
    gdp_arrange_columns = arrange_columns(gdp_query_dfs, gdp_type)
    ldp_arrange_columns = arrange_columns(ldp_query_dfs, ldp_type)
    sdp_arrange_columns = arrange_columns(sdp_query_dfs, sdp_type)
    
    # aggregation pipeline to calculate averages for different privacy mechanisms
    gdp_average_df = calculate_average(gdp_query_dfs, gdp_arrange_columns, gdp_type)
    ldp_average_df = calculate_average(ldp_query_dfs, ldp_arrange_columns, ldp_type)
    sdp_average_df = calculate_average(sdp_query_dfs, sdp_arrange_columns, sdp_type)
    
    agg_results_dir = f"{agg_results_dir}_{datetime.today()}"
    if not os.path.exists(agg_results_dir):
        os.mkdir(agg_results_dir)
    
    # save the results of aggregation
    gdp_average_df_path = os.path.join(agg_results_dir, gdp_average_df_filename)
    ldp_average_df_path = os.path.join(agg_results_dir, ldp_average_df_filename)
    sdp_average_df_path = os.path.join(agg_results_dir, sdp_average_df_filename)
    
    gdp_average_df.to_csv(gdp_average_df_path)
    ldp_average_df.to_csv(ldp_average_df_path)
    sdp_average_df.to_csv(sdp_average_df_path)
        

def main(agg_config_file: str = typer.Argument(..., help="Location of the .yml aggregation config file (default name is aggregation_config.yml).")) -> None:
    """
    Args:
        agg_config_file: Path of the .yml aggregation config file (default name is aggregation_config.yml)
    """
    
    # Test if the input filepath is correct
    if len(agg_config_file) > 0 and not os.path.isfile(agg_config_file):
        raise FileNotFoundError("Incorrect input yaml filepath.")
        
    # Load the configuration file
    cfg = utilities.get_config(agg_config_file)
    
    # Load the experiment parameters from the config file with the appropriate keys
    keys = config.AggregationConfig()
    
    # Run the aggregation pipeline
    aggregation_pipeline(cfg, keys)
    
if __name__ == '__main__':
    # Execute the main program
    typer.run(main)