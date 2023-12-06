import os
import pandas as pd

from pathlib import Path
from google.cloud import storage

def load_data_sources(bucket_name: str, prefix: str, delimiter: str = "/", file_prefix: str = "gs://", weights_filepath: str = "data/weights.csv") -> pd.DataFrame:
    """
    Loads a set of input files from the CCHS dataset and the weights file.
    Merges the two files on the 'ID' column.

    Args:
        bucket_name: Name of the GCP Bucket to load the data from.
        prefix: The prefix value to search for within the bucket
                (use the filepath as the prefix to target one specific file)
        delimiter: Used to not search nested folders, default is '/'.
        file_prefix: Used for when loading the files into dataframes. GCP requires
                a specific prefix to be used. Default value is 'gs://'.
        weights_filepath: Filepath for the weights csv file within the bucket 
                (ignoring the bucket prefix). Default value is 'data/weights.csv' 

    Returns:
        Dataframe of all data sources.
    """
    # Access the GCP bucket (move the config function)
    client = storage.Client()
    bucket = client.get_bucket(bucket_name)
    # Retrieve all blobs with the specified blob filters
    blobs = list(bucket.list_blobs(prefix=prefix, delimiter=delimiter))
    
    blob_dfs = []
    # For each blob, load any which is a .csv file
    for blob in blobs:
        if (len(blob.name) > 0 and '.csv' in blob.name and 'weights' not in blob.name):
            blob_dfs.append(pd.read_csv(file_prefix + bucket_name + delimiter + blob.name))
    
    # Create a single dataframe combining all within blob_dfs
    if len(blob_dfs) > 1:
        blob_df = pd.concat(blob_dfs, axis=1)
    else:
        blob_df = blob_dfs[0]
    blob_dfs = None
    
    # load the weights file
    weights_df = pd.read_csv(file_prefix + bucket_name + delimiter + weights_filepath)
    # Rename the weights column name to match that of the main files
    weights_df = weights_df.rename(columns={"Unnamed: 0": "ID"})
    
    # Return the merged weight and data files
    return pd.merge(blob_df, weights_df, on="ID", how="left")