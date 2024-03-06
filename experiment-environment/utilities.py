import os
import time
import yaml
import random
import numpy as np
import pandas as pd
from typing import List

from pathlib import Path

def get_config(config_file: str):
    """
    Load the specified configuration file.

    Args:
        config_file: Path to the config file relative to the default bucket.

    Returns:
        Dictionary of configuration information.
    """
    # Create a path to the config from the namespace
    config_file_path = Path(config_file)
    with open(str(config_file_path), 'rb') as outfile:
        contents = yaml.safe_load(outfile)
    return contents

def create_directory(path: str) -> None:
    """
    Given a path, create the directory if it exists

    Args:
        path: directory to be created
    """
    if not os.path.isdir(path):
        os.mkdir(path)
        
def set_random_seeds(seed: int):
    """
    Sets the random seed for all random libraries used.
    
    Args:
        seed: The random seed to be used
    """
    random.seed(seed)
    np.random.seed(seed)

def convert_df_type(df: pd.DataFrame, columns_to_convert: list[str], type_name: str = 'category') -> pd.DataFrame:
    """
    Tries to convert specified dataframe columns to the specified type

    Args:
        df: The dataframe to be transformed.
        columns_to_convert: List of column names to convert.
        delimiter: Used to not search nested folders, default is '/'.
        type_name: What type to convert the columns into. Default is 'category'.

    Returns:
        Adjusted dataframe.
    """
    df_convert = df.copy()
    try:
        df_convert[columns_to_convert] = df_convert[columns_to_convert].astype(type_name)
    except Exception as e:
        print(e)
    return df_convert

def consolidate_results(query_results: List[list], 
                        index_0: int, 
                        index_1: int, 
                        result_type: str, 
                        query_type_column: str) -> pd.DataFrame:
    """
    Consolidate the results of queries executed on a dataset.

    Parameters:
        query_results (List[list]): A list of query results.
        index_0 (int): The index of the query result to consolidate.
        index_1 (int): The index of the query result within the selected query result list.
        Note:
            index_0 = 0, index_1 = 0 indicates the result of running the query on the original data
            index_0 = 0, index_1 = 1 indicates the result of applying the noise to the query of the original data
            index_0 = 1, index_1 = 0 indicates the result of running the query on the LDP data
            index_0 = 2, index_1 = 0 indicates the result of running the query on the SDP data
        result_type (str): The type of the result (e.g., 'real', 'synthetic').
        query_type_column (str): The column name representing the type of query.

    Returns:
        pd.DataFrame: A DataFrame containing the consolidated query results.
    """
    data = query_results[index_0][index_1].copy()
    df = pd.concat([pd.json_normalize(data[key]).\
                    assign(**{query_type_column: result_type + key}) for key in data], \
                    ignore_index=True)
    return df

def arrange_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Arrange the columns of a DataFrame based on their substrings.

    Parameters:
        df (pd.DataFrame): The DataFrame whose columns need to be arranged.

    Returns:
        pd.DataFrame: A new DataFrame with columns arranged based on their substrings.
    """
    columns = df.columns
    
    # Create a dictionary to group columns by their substrings
    grouped_columns = {}
    for col in columns:
        substr = col.split('_')[-1]  # Extract the substring after the last underscore
        if substr not in grouped_columns:
            grouped_columns[substr] = []
        grouped_columns[substr].append(col)
    
    # Sort the columns within each group
    for substr in grouped_columns:
        grouped_columns[substr].sort()
    
    # Concatenate the lists in the desired order
    desired_columns = []
    for substr in grouped_columns:
        desired_columns.extend(grouped_columns[substr])
    
    # Create a new DataFrame with columns arranged in the desired order
    arranged_df = df[desired_columns]
    return arranged_df