import argparse
import logging
from tqdm import tqdm
import json
from pathlib import Path
from typing import List, Tuple, Union, Dict

import pandas as pd
import numpy as np
from opendp.domains import Domain, atom_domain, vector_domain
from opendp.measurements import (
    make_base_discrete_laplace,
    make_base_laplace,
    make_randomized_response,
    make_randomized_response_bool,
)
from opendp.metrics import l1_distance
from opendp.mod import enable_features
from tqdm import tqdm as tqdm_func

enable_features("contrib")

class LocalDifferentialPrivacy:
    """
    A class for applying local differential privacy to a dataset
    using Laplace noise and randomized response.

    Attributes:
    - epsilon: The privacy parameter representing the amount of noise to be added.

    Methods:
    - define_input_space: Define the input space for measurements.
    - add_laplace_noise: Add Laplace noise to the input value.
    - randomized_response: Add randomized response based on the type of variable.
    - calculate_probability: Calculate probability using the sensitivity
    - calculate_scale: Calculate Laplace scale using sensitivity
    - apply_local_dp: Apply local differential privacy to a given column of data based on its data type.
    - apply_to_dataframe: Apply local differential privacy to an entire dataframe.
    - apply_query_to_list: Apply appropriate query function to a given list of data based on its data type and query type.
    - apply_query_to_df: Apply appropriate query function to an entire dataframe.
    - map_categories: Create a mapping from categories to numeric values.
    - sensitivity_sum: Calculate sensitivity for the sum query on a numerical column.
    - sensitivity_mean: Calculate sensitivity for the mean query on a numerical column.
    - calculate_sensitivity: Calculate sensitivity for sum or mean queries on all columns of a dataframe.
    """

    def __init__(self, epsilon: float):
        """
        Initialize the LocalDifferentialPrivacy instance.

        Parameters:
        - epsilon: The privacy parameter representing the amount of noise to be added.
        """
        self.epsilon = epsilon

    def define_input_space(
        self, input_space_type: str = "vector", variable_type: str = "float"
    ) -> Tuple[Domain, float]:
        """
        Define the input space for measurements.

        Parameters:
        - input_space_type: Type of input space ('scalar' or 'vector').
        - variable_type: Type of variable ('float', 'int', etc.).
        Returns:
        - input_space: Tuple specifying the input space.
        """

        if input_space_type == "scalar":
            input_space = atom_domain(T=variable_type), l1_distance(T=variable_type)
        elif input_space_type == "vector":
            input_space = vector_domain(atom_domain(T=variable_type)), l1_distance(
                T=variable_type
            )
        else:
            raise ValueError("Unsupported input type")
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
        if variable_type == "int":
            base_discrete_lap = make_base_discrete_laplace(
                *input_space, scale=scale
            )
            noisy_value = base_discrete_lap(value)
        elif variable_type == "float":
            base_lap = make_base_laplace(*input_space, scale=scale)
            noisy_value = base_lap(value)
        else:
            raise ValueError("Unsupported variable type")
        return noisy_value

    def randomized_response(
        self, true_value: List[Union[str, float, int]], probability: float, variable_type: str = "bool" 
    ) -> List[Union[str, float, int]]:
        """
        Function to add local noise depending on the type of variable
        Paramaters:
            - true_value: list of values into which noise is injected
            - probability: probability parameter for randomized response.
            - variable_type: type of variable [Possible options: bool, categorical]
        Returns:
            - noisy_value: list with the noise injected
        """
        if variable_type == "bool":
            rr_measure = make_randomized_response_bool(prob=probability)
        elif variable_type == "categorical":
            rr_measure = make_randomized_response(
                list(set(true_value)), prob=probability
            )
        else:
            raise ValueError("Unsupported variable type")
        noisy_value = [rr_measure(value) for value in true_value]
        return noisy_value

    def calculate_probability(self, sensitivity: float) -> float:
        """
        Calculate probability using the sensitivity

        Parameters:
        - sensitivity: The sensitivity of the query.

        Returns:
        - probability: The calculated probability.
        """

        exponent = self.epsilon / sensitivity
        probability = np.exp(exponent) / (1 + np.exp(exponent))
        return probability

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

    
    def apply_local_dp(self, column: pd.Series, sensitivity_dict: Dict[str, float]) -> List[Union[str, float, int]]:
        """
        Apply local differential privacy to a given column 
        of data based on its data type.

        Parameters:
        - column: A pandas Series representing the data column.
        - sensitivity_dict: A dictionary mapping column names to sensitivity values.

        Returns:
        - noisy_result: The column with local differential 
                        privacy applied.
        """
        if column.dtype == "category":
            probability = self.calculate_probability(sensitivity_dict[column.name])
            noisy_result = self.randomized_response(
                column.tolist(), probability, variable_type="categorical"
            )
        elif column.dtype == "int":
            scale = self.calculate_scale(sensitivity_dict[column.name])
            input_space = self.define_input_space(
                input_space_type="vector", variable_type="int"
            )
            noisy_result = self.add_laplace_noise(
                input_space, column.tolist(), scale, variable_type="int"
            )
        elif column.dtype == "float":
            scale = self.calculate_scale(sensitivity_dict[column.name])
            input_space = self.define_input_space(
                input_space_type="vector", variable_type="float"
            )
            noisy_result = self.add_laplace_noise(
                input_space, column.tolist(), scale, variable_type="float"
            )
        elif column.dtype == "bool":
            probability = self.calculate_probability(sensitivity_dict[column.name])
            noisy_result = self.randomized_response(column.tolist(), probability)
        else:
            return column

        return noisy_result

    def apply_to_dataframe(self, df: pd.DataFrame, sensitivity_dict: Dict[str, float]) -> pd.DataFrame:
        """
        Apply local differential privacy to an entire dataframe.

        Parameters:
        - df: The input dataframe.
        - sensitivity_dict: A dictionary mapping column names to sensitivity values.

        Returns:
        - df_transformed: The dataframe with local differential privacy applied.
        """

        tqdm_func.pandas(
            desc="Applying Local DP",
            bar_format="{desc}: {percentage:3.0f}%|{bar}| {n_fmt}/{total_fmt} [{elapsed}<{remaining}]",
        )

        return df.progress_apply(self.apply_local_dp, sensitivity_dict=sensitivity_dict)


    def apply_query_to_list(
        self,
        list_to_be_aggregated: List[Union[str, int, float]],
        query_type: str,
        variable_type: str = "float",
    ) -> Union[float, dict]:
        """
        Apply appropriate query function to a given list
        of data based on its data type and query type.

        Parameters:
        - list_to_be_aggregated: A list representing the data.
        - query_type: Type of query ('sum', 'mean', 'frequency', ...).
        - variable_type: Type of variable ('float', 'int', etc.).

        Returns:
        - result: The query result as a dictionary.
        """

        # Check if the query type is sum or mean
        if query_type in ["sum", "mean"]:
            # If the variable type is category, handle aggregation for categorical data
            if variable_type == "category":
                # Create a mapping from categories to numeric values
                category_mapping, numeric_list = self.map_categories(
                    list_to_be_aggregated
                )

                # Calculate category sums or means based on the query type
                if query_type == "sum":
                    category_sums = np.bincount(numeric_list)
                    result_dict = {
                        category: category_sums[i]
                        for category, i in category_mapping.items()
                    }
                    return result_dict
                elif query_type == "mean":
                    category_means = (
                        np.bincount(numeric_list) / np.bincount(numeric_list).sum()
                    )
                    result_dict = {
                        category: category_means[i]
                        for category, i in category_mapping.items()
                    }
                    return result_dict

            # If the variable type is float or int, handle aggregation for numerical data
            elif variable_type in ["float", "int"]:
                if query_type == "sum":
                    return np.sum(list_to_be_aggregated)
                elif query_type == "mean":
                    return np.mean(list_to_be_aggregated)
            else:
                raise ValueError("Unsupported variable type")

        # If the query type is frequency, handle frequency aggregation
        elif query_type == "frequency":
            if variable_type == "category":
                return dict(pd.Series(list_to_be_aggregated).value_counts())
            else:
                return float("NaN")
        else:
            raise ValueError("Unsupported query type")

    def apply_query_to_df(
        self, df: pd.DataFrame, query_type: str
    ) -> Dict[str, Union[float, dict]]:
        """
        Apply appropriate query function to an entire dataframe.

        Parameters:
        - df: The input dataframe.
        - query_type: Type of query ('sum', 'mean', 'frequency', ...).

        Returns:
        - agg_result: The query result as a dataframe.
        """
        # Use tqdm to display a progress bar with a description
        tqdm_columns = tqdm(
            df.columns, desc=f"Applying query '{query_type}' to dataframe"
        )

        agg_result = {
            column: self.apply_query_to_list(
                df[column].values, query_type, df[column].dtype
            )
            for column in tqdm_columns
        }
        return agg_result
    
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