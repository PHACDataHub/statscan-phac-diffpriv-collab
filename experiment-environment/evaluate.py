import os
import pandas as pd
from sdmetrics.reports.single_table import QualityReport
import plotly.io as pio
from IPython.display import HTML

import utilities

def generate_metadata(df, primary_key: str=None):
    """
    Generate metadata required for the quality report

    Parameters:
    df (pd.DataFrame): DataFrame for which to generate metadata.

    Returns:
    dict: Metadata dictionary for SDMetrics.
    """
    
    metadata = {'primary_key': primary_key, 'columns': {}}
    
    dtype_mappings = {
        'int64': ('numerical', 'int'),
        'float64': ('numerical', 'float'),
        'bool': ('boolean', None),
        'datetime64[ns]': ('datetime', None),
        'category': ('categorical', None)
    }
    
    for column, dtype in df.dtypes.items():
        dtype_key = str(dtype)
        sdtype, subtype = dtype_mappings.get(dtype_key, ('categorical', None))
        column_metadata = {'sdtype': sdtype}
        if subtype:
            column_metadata['type'] = subtype
        metadata['columns'][column] = column_metadata
    
    return metadata

def evaluate_data_quality(real_data, transformed_data, metadata):
    """
    Evaluate the quality of transformed data in comparison to real data.

    Parameters:
    real_data (pd.DataFrame): The real data
    transformed_data (pd.DataFrame): The 'transformed data
    metadata (dict): The metadata dictionary for the data.

    Returns:
    QualityReport: The generated quality report object.
    """
    report = QualityReport()
    print("\n")
    report.generate(real_data=real_data, synthetic_data=transformed_data, metadata=metadata, verbose=True)
    return report

def print_report_details(report):
    """
    Print the details of the quality report.

    Parameters:
    report (QualityReport): The quality report object to print details from.
    """
    print(f"Overall Quality Score: {report.get_score()}")
    print("\nProperties Scores:")
    print(report.get_properties())
    print("\nColumn Shapes Details:")
    print(report.get_details(property_name='Column Shapes'))


def evaluate_synthetic_dataset(df: pd.DataFrame, 
                               df_transformed: pd.DataFrame, 
                               results_dir: str, 
                               dp_type: str, 
                               quality_report_filename: str, 
                               column_shape_filename: str, 
                               column_pair_trends_filename: str,
                               epsilon: float) -> tuple:
    """
    Evaluate the quality of a synthetic dataset and generate visualizations.

    Parameters:
        df (pd.DataFrame): The original (real) dataset.
        df_transformed (pd.DataFrame): The synthetic dataset transformed using a differential privacy method.
        results_dir (str): The directory path where evaluation results and visualizations will be saved.
        dp_type (str): The type of differential privacy method used.
        quality_report_filename (str): The filename for the quality evaluation report.
        column_shape_filename (str): The filename for the visualization of column shapes.
        column_pair_trends_filename (str): The filename for the visualization of column pair trends.
        epsilon(float): the value of epsilon used

    Returns:
        tuple: A tuple containing the visualizations for column shapes and column pair trends.
    """
    
    real_data = pd.DataFrame(df)
    transformed_data = pd.DataFrame(df_transformed)

    # Generate metadata
    metadata = generate_metadata(real_data)

    # Evaluate data quality
    quality_report = evaluate_data_quality(real_data, transformed_data, metadata)

    # Report details
    print_report_details(quality_report)

    # Visualize the report 
    fig_shapes = quality_report.get_visualization(property_name='Column Shapes')
    fig_pairs = quality_report.get_visualization(property_name='Column Pair Trends')
    
    # Save the report
    quality_report_filename = dp_type + quality_report_filename.split(".")[0] + f"_eps_{epsilon}." + quality_report_filename.split(".")[1]
    quality_report.save(os.path.join(results_dir, quality_report_filename))
    
    # save the figures
    column_shape_filename = dp_type + column_shape_filename.split(".")[0] + f"_eps_{epsilon}." + column_shape_filename.split(".")[1]
    
    column_pair_trends_filename = dp_type + column_pair_trends_filename.split(".")[0] + f"_eps_{epsilon}." + column_pair_trends_filename.split(".")[1]
                        
    fig_shapes.write_html(os.path.join(results_dir, column_shape_filename))
    fig_pairs.write_html(os.path.join(results_dir, column_pair_trends_filename))
    
    return fig_shapes, fig_pairs

def compare_query_results(real_result, synthetic_result):
    """
    Compare the results of queries executed on real and synthetic datasets.

    Parameters:
    real_result: The result of the query executed on the real dataset.
    synthetic_result: The result of the query executed on the synthetic dataset.

    Returns:
    dict: A dictionary containing the results and the absolute error.
    """
    # Calculate the absolute error between the real and synthetic query results
    error = abs(real_result - synthetic_result)

    # Return the results and the error
    return {
        'real_result': real_result,
        'synthetic_result': synthetic_result,
        'absolute_error': error
    }


def get_absolute_error(original_df: pd.DataFrame, modified_df: pd.DataFrame, results_dir: str, filename: str, dp_type: str, original_type: str, epsilon: float) -> None:
    """
    Calculate the absolute error between the original dataframe and the modified dataframe.

    Parameters:
        original_df (DataFrame): The original dataframe containing sensitive information.
        modified_df (DataFrame): The dataframe representing the modified dataset (e.g., LDP or SDP masked dataset).
        results_dir (str): The directory path where the CSV file will be saved.
        filename (str): The name of the CSV file.
        dp_type (str): The type of differential privacy method used (e.g., ldp_ or sdp_).
        original_type (str): prefix for the original data (e.g., 'original_' for the original data).
        epsilon(float): the value of epsilon used

    Returns:
        None: The function saves the absolute error results for both original and modified datasets to a CSV file.
        
    Note: 
        The function assumes that the 'ID' column is present in the dataframes and is used for sorting.
        It also assumes that the 'WTS_M' column is present in the dataframes and is dropped before calculating the absolute error.
    """
    
    # Get list of columns excluding 'ID' and 'WTS_M'
    col_list = original_df.columns.tolist()
    col_list = [col for col in col_list if col not in ['ID', 'WTS_M']]
    
    # Sort dataframes by 'ID' and drop 'ID' and 'WTS_M' columns
    original_df = original_df.sort_values(by='ID', ascending=True).reset_index(drop=True).drop(['ID', 'WTS_M'], axis=1)
    modified_df = modified_df.sort_values(by='ID', ascending=True).reset_index(drop=True).drop(['ID', 'WTS_M'], axis=1)
    
    # Calculate absolute error for each column
    for column in col_list:
        modified_df['absolute_error_'+column] = abs(original_df[column] - modified_df[column])
        
    # Add prefixes to column names
    original_df = original_df.add_prefix(original_type)
    modified_df = modified_df.add_prefix(dp_type)
    
    # Concatenate the dataframes along columns axis
    combined_df = pd.concat([original_df, modified_df], axis=1)
    
    # Arrange the dataframe in desired format    
    combined_df = utilities.arrange_columns(combined_df)
    
    filename =  filename.split(".")[0] + f"_eps_{epsilon}." + filename.split(".")[1]

    # Reset index and save to CSV
    combined_df.reset_index(drop=True).to_csv(os.path.join(results_dir, filename), index=False)
    
    
def get_absolute_error_queries(df_original: pd.DataFrame, 
                               df_dp: pd.DataFrame, 
                               dp_type: str, 
                               original_prefix: str, 
                               results_dir: str, 
                               filename: str,
                               query_type_column: str,
                               epsilon: float) -> None:
    """
    Calculate the absolute error between the original dataframe and the masked (differentially private) dataframe for specific queries.

    Parameters:
        df_original (pd.DataFrame): The original dataframe.
        df_dp (pd.DataFrame): The dataframe representing the masked (differentially private) dataset.
        dp_type (str): The type of differential privacy method used (e.g., 'ldp_' or 'sdp_').
        original_prefix (str): prefix for the original data (e.g., 'original_' for the original data).
        results_dir (str): The directory path where the CSV file will be saved.
        filename (str): The name of the CSV file.
        query_type_column (str): The column name representing the type of query.
        epsilon(float): the value of epsilon used

    Returns:
        None: The function saves the absolute error results for specific queries to a CSV file.
    """
    column_list = df_original.columns.tolist()
    column_list.remove(query_type_column)
    
    
    # Calculate absolute error for each relevant column
    for column in column_list:
        try:
            df_dp['absolute_error_' + column] = abs(df_original[column] - df_dp[column])
        except KeyError:
            continue
    
    
    # Add prefixes to column names
    df_original = df_original.add_prefix(original_prefix)
    df_dp = df_dp.add_prefix(dp_type)

    # Concatenate the dataframes along columns axis
    df_combined = pd.concat([df_original, df_dp], axis=1)

    # Arrange the dataframe in desired format
    df_combined = utilities.arrange_columns(df_combined)
    
    filename =  filename.split(".")[0] + f"_eps_{epsilon}." + filename.split(".")[1]
    
    # Reset index and save to CSV
    df_combined.reset_index(drop=True).to_csv(os.path.join(results_dir, filename), index=False)