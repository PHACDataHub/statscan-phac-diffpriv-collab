from typing import Dict, List, Tuple, Union
from tqdm import tqdm
import argparse
import logging
import json
from pathlib import Path
import numpy as np
import pandas as pd
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
    using Laplace noise.

    Attributes:
    - scale_laplace: The scale parameter for Laplace noise.

    Methods:
    - define_input_space: Define the input space for measurements.
    - add_laplace_noise: Add Laplace noise to the input value.
    - apply_query_to_list: Apply global differential privacy to a given
                           list of data based on its data type and query type.
    - apply_query_to_df: Apply global differential privacy to an entire dataframe.
    - apply_global_dp: Apply global differential privacy to the aggregated result.
    """

    def __init__(self, scale_laplace: float):
        """
        Initialize the GlobalDifferentialPrivacy instance.

        Parameters:
        - scale_laplace: The scale parameter for Laplace noise.
        """
        self.scale_laplace = scale_laplace

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
        variable_type: str = "float",
    ) -> Union[str, float, int]:
        """
        Add Laplace noise to the input value.

        Parameters:
        - input_space: Input space for the measurement.
        - value: The true value to which noise is added.
        - variable_type: Type of variable ('float', 'int', etc.).

        Returns:
        - noisy_value: The noisy value after adding Laplace noise.
        """

        # Create a Laplace mechanism with the specified input space and scale
        base_lap = make_base_laplace(*input_space, scale=self.scale_laplace)

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
        query_type: str,
        variable_type: str = "float",
    ) -> Union[float, dict]:
        """
        Apply global differential privacy to a given list
        of data based on its data type and query type.

        Parameters:
        - list_to_be_aggregated: A list representing the data.
        - query_type: Type of query ('sum', 'mean', 'frequency', ...).
        - variable_type: Type of variable ('float', 'int', etc.).

        Returns:
        - result: The result with global differential privacy applied.
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
        Apply global differential privacy to an entire dataframe.

        Parameters:
        - df: The input dataframe.
        - query_type: Type of query ('sum', 'mean', 'frequency', ...).

        Returns:
        - agg_result: The result with global differential privacy applied to the dataframe.
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

    def apply_global_dp(
        self, result: Dict[str, Union[float, dict]]
    ) -> Dict[str, Union[float, dict]]:
        """
        Apply global differential privacy to the aggregated result.

        Parameters:
        - result: The result to which global differential privacy is applied.

        Returns:
        - noisy_result: The result with added noise for privacy preservation.
        """
        noisy_result = {}

        tqdm_result = tqdm(result.items(), desc="Applying global DP to result")
        
        for column, data_structure in tqdm_result:
            input_space = self.define_input_space(float)

            if isinstance(data_structure, dict):
                # Apply Laplace noise to each value in the dictionary
                noisy_aggregate = {
                    category: self.add_laplace_noise(
                        input_space,
                        float(aggregated_value),
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
                    variable_type=data_structure.dtype,
                )

        return noisy_result


def main():
    np.random.seed(42)

    parser = argparse.ArgumentParser(
        description="Apply global differential privacy to a dataset."
    )
    parser.add_argument("--scale", type=float, help="Scale parameter for Laplace noise")
    parser.add_argument(
        "--query_type",
        type=str,
        help="Query to be executed on the dataset. \
                        Accepted queries are sum, mean and frequency",
    )
    parser.add_argument("--input_csv", type=str, help="Path to the input CSV file")
    parser.add_argument(
        "--group_by", type=str, help="Categorical Column to group by"
    )
    parser.add_argument(
        "--output_json", type=str, help="Path to save the output JSON file"
    )

    args = parser.parse_args()

    if (
        not args.scale
        or not args.query_type
        or not args.input_csv
        or not args.output_json
    ):
        parser.error("All arguments are required.")

    if not Path(args.input_csv).is_file():
        parser.error(f'The input CSV file "{args.input_csv}" does not exist.')

    try:
        df = pd.read_csv(args.input_csv)
    except Exception as e:
        logging.error(f"Error reading the input CSV file: {e}")
        return

    # convert necessary columns to categorical
    columns_to_convert = [
        "GEO_PRV",
        "GEODGHR4",
        "DHH_SEX",
        "DHHGMS",
        "DHHGAGE",
        "GEN_005",
        "GEN_015",
        "GEN_020",
        "GEN_025",
        "SMK_005",
        "SMK_015",
        "SMK_020",
        "SMK_030",
    ]

    df[columns_to_convert] = df[columns_to_convert].astype("category")

    privacy = GlobalDifferentialPrivacy(args.scale)
    query_result = {}
    noisy_result = {}
    print(args.group_by)
    try:
        if(not args.group_by):
            query_result = privacy.apply_query_to_df(df, args.query_type)
            noisy_result = privacy.apply_global_dp(query_result)
        else:
            dfg = df.groupby(args.group_by)
            for val, dff in dfg:
                q_result = privacy.apply_query_to_df(dff, args.query_type)
                query_result.update({args.group_by + '_GROUP' + str(val):q_result})
                n_result = privacy.apply_global_dp(q_result)
                noisy_result.update({args.group_by + '_GROUP' + str(val):n_result})

    except Exception as e:
        logging.error(f"Error applying global differential privacy: {e}")
        return

    try:
        with open("query_result.json", "w") as fp:
            json.dump(query_result, fp, default=int)
    except Exception as e:
        logging.error(f"Error saving the query result JSON file: {e}")
        return

    try:
        with open(args.output_json, "w") as fp:
            json.dump(noisy_result, fp)
        print(f"Transformed data saved at {args.output_json}")
    except Exception as e:
        logging.error(f"Error saving the output JSON file: {e}")
        return


if __name__ == "__main__":
    main()
