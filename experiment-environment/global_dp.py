from typing import Dict, List, Tuple, Union
from tqdm import tqdm
import argparse
import logging
import json
from pathlib import Path
import numpy as np
import pandas as pd
import numpy.typing as npt
from opendp.domains import Domain, atom_domain, vector_domain
from opendp.measurements import make_base_discrete_laplace, make_base_laplace
from opendp.metrics import absolute_distance
from opendp.mod import enable_features
from opendp.typing import *

# Enable contrib features in OpenDP library
enable_features("contrib")


class GlobalDifferentialPrivacy:
    """
    A class for applying global differential privacy to a dataset

    Attributes:
    - epsilon: The privacy parameter representing the amount of noise to be added.

    Methods:
    - define_input_space: Define the input space for measurements.
    - add_laplace_noise: Add Laplace noise to the input value.
    - apply_query_to_list: Apply global differential privacy to a given
                           list of data based on its data type and query type.
    - apply_query_to_df: Apply global differential privacy to an entire dataframe.
    - apply_global_dp: Apply global differential privacy to the aggregated result.
    """

    def __init__(self, epsilon: float):
        """
        Initialize the GlobalDifferentialPrivacy instance.

        Parameters:
        - epsilon: The privacy parameter representing the amount of noise to be added.
        """
        self.epsilon = epsilon

    def map_categories(
        self, list_to_be_aggregated: List[Union[str, int, float]]
    ) -> Tuple[Dict[Union[str, int, float], int], np.ndarray]:
        """
        Create a mapping from categories to numeric values.

        Parameters:
        - list_to_be_aggregated: A list containing categories to be mapped.

        Returns:
        - category_mapping: A dictionary mapping categories to numeric values.
        - numeric_list: An array representing the numeric values corresponding to each category.
        """
        # Create a mapping from categories to numeric values
        category_mapping = {
            category: i for i, category in enumerate(set(list_to_be_aggregated))
        }

        # Map the categorical list to numeric values
        numeric_list = np.array(
            [category_mapping[category] for category in list_to_be_aggregated]
        )

        return category_mapping, numeric_list

    def define_input_space(self, variable_type: str = "float") -> Tuple[Domain, float]:
        """
        Define the input space for measurements.

        Parameters:
        - variable_type: Type of variable ('float', 'int', etc.).

        Returns:
        - input_space: Tuple specifying the input space.
        """
        input_space = atom_domain(T=variable_type), absolute_distance(T=variable_type)
        return input_space

    def add_laplace_noise(
        self,
        input_space: Tuple[Domain, float],
        value: Union[str, float, int],
        scale: float,
        variable_type: str = "float",
    ) -> Union[str, float, int]:
        """
        Add Laplace noise to the input value.

        Parameters:
        - input_space: Input space for the measurement.
        - value: The true value to which noise is added.
        - scale: The scale parameter for Laplace noise.
        - variable_type: Type of variable ('float', 'int', etc.).

        Returns:
        - noisy_value: The noisy value after adding Laplace noise.
        """

        # Create a Laplace mechanism with the specified input space and scale
        base_lap = make_base_laplace(*input_space, scale=scale)
        
        if value == 'nan':
            return

        # Generate noisy value using the Laplace mechanism
        noisy_value = base_lap(value)

        # If the variable type is integer, round the noisy value
        if variable_type == int:
            noisy_value = int(np.floor(noisy_value))

            # Ensure that the noisy value is different from the original value
            if value == noisy_value:
                noisy_value = int(np.ceil(noisy_value))
        

        return noisy_value

    def apply_query_to_list(
        self,
        list_to_be_aggregated: List[Union[str, int, float]],
        weights: npt.NDArray[np.float64],
        query_type: str,
        variable_type: str = "float",
    ) -> Union[float, dict]:
        """
        Apply global differential privacy to a given list

        Parameters:
        - list_to_be_aggregated: A list representing the data.
        - query_type: Type of query ('sum', 'mean', 'frequency', ...).
        - weights: A list of design weights.
        - variable_type: Type of variable ('float', 'int', etc.).

        Returns:
        - result: Apply global differential privacy to a given list
        """

        # Check if the query type is sum or mean
        if query_type in ["sum", "mean"]:
            # If the variable type is category, handle aggregation for categorical data
            if variable_type == "category":
                # Create a mapping from categories to numeric values
                category_mapping, numeric_list = self.map_categories(
                    list_to_be_aggregated
                )
                
                # Increment with the weight rather than count
                weighted_sum = np.zeros(category_mapping.__len__())
                for index in range(numeric_list.__len__()):
                    category, weight  = numeric_list[index], weights[index]
                    weighted_sum[category] += weight

                # Calculate category sums or means based on the query type
                if query_type == "sum":
                    category_sums = weighted_sum
                    result_dict = {
                        category: category_sums[i]
                        for category, i in category_mapping.items()
                    }
                    return result_dict
                elif query_type == "mean":
                    category_means = (
                        weighted_sum / weights.sum()
                    )
                    result_dict = {
                        category: category_means[i]
                        for category, i in category_mapping.items()
                    }
                    return result_dict

            # If the variable type is float or int, handle aggregation for numerical data
            elif variable_type in ["float", "int"]:
                if query_type == "sum":
                    return np.sum(list_to_be_aggregated * weights)
                elif query_type == "mean":
                    return np.sum(list_to_be_aggregated * weights) / weights.sum()
            else:
                raise ValueError("Unsupported variable type")

        # If the query type is frequency, handle frequency aggregation
        elif query_type == "frequency":
            if variable_type == "category":
                # Create a mapping from categories to numeric values
                category_mapping, numeric_list = self.map_categories(
                    list_to_be_aggregated
                )

                # Increment with the weight rather than count
                weighted_sum = np.zeros(category_mapping.__len__())
                for index in range(numeric_list.__len__()):
                    category, weight  = numeric_list[index], weights[index]
                    weighted_sum[category] += weight

                categories = set(list_to_be_aggregated)
                dict(zip(categories, weighted_sum))

                return dict(zip(categories, weighted_sum))
            else:
                return float("NaN")
        else:
            raise ValueError("Unsupported query type")

    def apply_query_to_df(
        self, df: pd.DataFrame, query_type: str
    ) -> Dict[str, Union[float, dict]]:
        """
        Apply global differential privacy to an entire dataframe.

        Parameters:
        - df: The input dataframe.
        - query_type: Type of query ('sum', 'mean', 'frequency', ...).

        Returns:
        - agg_result: The result with global differential privacy applied to the dataframe.
        """
        columns = [col for col in df.columns if col.upper() not in ['ID', 'WTS_M']] # remove ID and weights
        
        # Use tqdm to display a progress bar with a description
        tqdm_columns = tqdm(
            columns, desc=f"Applying query '{query_type}' to dataframe"
        )

        agg_result = {
            column: self.apply_query_to_list(
                df[column].values, df['WTS_M'].values, query_type, df[column].dtype
            )
            for column in tqdm_columns
        }
        return agg_result

    def calculate_scale(self, sensitivity: float) -> float:
        """
        Calculate Laplace scale using sensitivity

        Parameters:
        - sensitivity: The sensitivity of the query.

        Returns:
        - scale: The Laplace noise scale.
        """
        # Calculate Laplace noise scale
        scale = sensitivity / self.epsilon
        return scale
    
    def apply_global_dp(
        self, result: Dict[str, Union[float, dict]], sensitivity_dict: Dict[str, float]
    ) -> Dict[str, Union[float, dict]]:
        """
        Apply global differential privacy to the aggregated result.

        Parameters:
        - result: The result to which global differential privacy is applied.
        - sensitivity_dict: A dictionary mapping column names to sensitivity values.

        Returns:
        - noisy_result: The result with added noise for privacy preservation.
        """
        noisy_result = {}

        tqdm_result = tqdm(result.items(), desc="Applying global DP to result")
        
        for column, data_structure in tqdm_result:
            
            input_space = self.define_input_space(float)
            
            scale = self.calculate_scale(sensitivity_dict[column])
            
            if isinstance(data_structure, dict):
                # Apply Laplace noise to each value in the dictionary
                noisy_aggregate = {
                    category: self.add_laplace_noise(
                        input_space,
                        float(aggregated_value),
                        scale,
                        variable_type=aggregated_value.dtype,
                    )
                    for category, aggregated_value in data_structure.items()
                }
                noisy_result[column] = noisy_aggregate

            elif isinstance(data_structure, (int, float)):
                # Apply Laplace noise to a single numeric value
                noisy_result[column] = self.add_laplace_noise(
                    input_space,
                    float(data_structure),
                    scale,
                    variable_type=data_structure.dtype,
                )

        return noisy_result
    
    def sensitivity_sum(self, column_values) -> float:
        """
        Calculate sensitivity for the sum query on a numerical column.

        Parameters:
        - column_values: The values of the numerical column.

        Returns:
        - sensitivity: The sensitivity for the sum query.
        """
        return abs(max(column_values) - min(column_values))

    def sensitivity_mean(self, column_values) -> float:
        """
        Calculate sensitivity for the mean query on a numerical column.

        Parameters:
        - column_values: The values of the numerical column.

        Returns:
        - sensitivity: The sensitivity for the mean query.
        """
        return abs(max(column_values) - min(column_values)) / len(column_values)
    
    def calculate_sensitivity(self, df: pd.DataFrame, query_type: str) -> Dict[str, float]:
        """
        Calculate sensitivity for sum or mean queries on all columns of a dataframe.

        Parameters:
        - df: The input dataframe.
        - query_type: Type of query ("sum" or "mean").

        Returns:
        - sensitivity_dict: A dictionary mapping column names to sensitivity values.
        """
        sensitivity_dict = {
            column: 1 if df[column].dtype == 'category' else
                    self.sensitivity_sum(df[column].values) if query_type == 'sum' else
                    self.sensitivity_mean(df[column].values)
            for column in df.columns
        }
        return sensitivity_dict