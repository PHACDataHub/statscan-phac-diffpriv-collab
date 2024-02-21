import os
import pandas as pd
from sdmetrics.reports.single_table import QualityReport
import plotly.io as pio
from IPython.display import HTML

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
    report.generate(real_data=real_data, synthetic_data=transformed_data, metadata=metadata, verbose=True)
    return report

def print_report_details(report):
    """
    Print the details of the quality report.

    Parameters:
    report (QualityReport): The quality report object to print details from.
    """
    print(f"Overall Quality Score: {report.get_score()}")
    print("Properties Scores:")
    print(report.get_properties())
    print("Column Shapes Details:")
    print(report.get_details(property_name='Column Shapes'))


def evaluate_synthetic_dataset(df, df_transformed, filepath, dp_type):
    
    if not os.path.exists(filepath):
        os.mkdir(filepath)
    
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
    quality_report.save(os.path.join(filepath, f'{dp_type}_quality_report.pkl'))
    
    # save the figures
    fig_shapes.write_html(os.path.join(filepath, f'{dp_type}_shape.html'))
    fig_pairs.write_html(os.path.join(filepath, f'{dp_type}_columns_pair_trends.html'))
    
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


def get_absolute_error(original_df: pd.DataFrame, modified_df: pd.DataFrame, filepath: str, filename: str, dp_type: str) -> None:
    
    """
    Calculate the absolute error between the original dataframe and the masked versions.

    Parameters:
    df (DataFrame): The original dataframe containing sensitive information.
    ldp_data_full (DataFrame): The dataframe representing the Local Differential Privacy (LDP) masked dataset.
    sdp_data_full (DataFrame): The dataframe representing the Secure Differential Privacy (SDP) masked dataset.

    Returns:
    None: The function saves the absolute error results for both LDP and SDP datasets to separate CSV files.
    
    Note: The function assumes that the 'ID' column is present in the dataframes and is used for sorting.
    """
    
    if not os.path.exists(filepath):
        os.mkdir(filepath)
    
    # Get Absolute error results
    col_list = original_df.columns.tolist()
    col_list = [col for col in col_list if col not in ['ID', 'WTS_M']]
    
    
    original_df = original_df.sort_values(by='ID', ascending=True).reset_index(drop=True).drop(['ID', 'WTS_M'], axis=1)
    modified_df = modified_df.sort_values(by='ID', ascending=True).reset_index(drop=True).drop(['ID', 'WTS_M'], axis=1)
    
    for column in col_list:
        modified_df['absolute_error_'+column] = abs(original_df[column] - modified_df[column])
        
    original_df = original_df.add_prefix('original_')
    modified_df = modified_df.add_prefix(dp_type)
    
    # Concatenate the dataframes along columns axis
    combined_df = pd.concat([original_df, modified_df], axis=1)
    
    # Sort columns
    combined_df = combined_df.reindex(sorted(combined_df.columns), axis=1)
    
    combined_df.reset_index(drop=True).to_csv(os.path.join(filepath, filename))
