import os
import time
import yaml
import random
import numpy as np
import pandas as pd

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
    try:
        df[columns_to_convert] = df[columns_to_convert].astype(type_name)
    except Exception as e:
        print(e)
    return df