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


def evaluate_synthetic_dataset(df, df_transformed):
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
    quality_report.save(filepath='quality_report.pkl')
    
    return fig_shapes , fig_pairs

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