import argparse
import logging
from pathlib import Path
from typing import List, Tuple, Union

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
    - scale: The scale parameter for Laplace noise.
    - probability: The probability parameter for randomized response.

    Methods:
    - define_input_space: Define the input space for measurements.
    - add_laplace_noise: Add Laplace noise to the input value.
    - randomized_response: Add randomized response based
                           on the type of variable.
    - apply_local_dp: Apply local differential privacy to a given
                      column of data based on its data type.
    - apply_to_dataframe: Apply local differential 
                          privacy to an entire dataframe.
    """

    def __init__(self, scale: float, probability: float):
        self.scale = scale
        self.probability = probability

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
        if variable_type == "int":
            base_discrete_lap = make_base_discrete_laplace(
                *input_space, scale=self.scale
            )
            noisy_value = base_discrete_lap(value)
        elif variable_type == "float":
            base_lap = make_base_laplace(*input_space, scale=self.scale)
            noisy_value = base_lap(value)
        else:
            raise ValueError("Unsupported variable type")
        return noisy_value

    def randomized_response(
        self, true_value: List[Union[str, float, int]], variable_type: str = "bool"
    ) -> List[Union[str, float, int]]:
        """
        Function to add local noise depending on the type of variable
        Paramaters:
            - true_value: list of values into which noise is injected
            - variable_type: type of variable [Possible options: bool, categorical]
        Returns:
            - noisy_value: list with the noise injected
        """
        if variable_type == "bool":
            rr_measure = make_randomized_response_bool(prob=self.probability)
        elif variable_type == "categorical":
            rr_measure = make_randomized_response(
                list(set(true_value)), prob=self.probability
            )
        else:
            raise ValueError("Unsupported variable type")
        noisy_value = [rr_measure(value) for value in true_value]
        return noisy_value

    def apply_local_dp(self, column: pd.Series) -> List[Union[str, float, int]]:
        """
        Apply local differential privacy to a given column 
        of data based on its data type.

        Parameters:
        - column: A pandas Series representing the data column.

        Returns:
        - noisy_result: The column with local differential 
                        privacy applied.
        """
        if column.dtype == "category":
            noisy_result = self.randomized_response(
                column.tolist(), variable_type="categorical"
            )
        elif column.dtype == "int":
            input_space = self.define_input_space(
                input_space_type="vector", variable_type="int"
            )
            noisy_result = self.add_laplace_noise(
                input_space, column.tolist(), variable_type="int"
            )
        elif column.dtype == "float":
            input_space = self.define_input_space(
                input_space_type="vector", variable_type="float"
            )
            noisy_result = self.add_laplace_noise(
                input_space, column.tolist(), variable_type="float"
            )
        elif column.dtype == "bool":
            noisy_result = self.randomized_response(column.tolist())
        else:
            return column

        return noisy_result

    def apply_to_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Apply local differential privacy to an entire dataframe.

        Parameters:
        - df: The input dataframe.

        Returns:
        - df_transformed: The dataframe with local differential privacy applied.
        """

        tqdm_func.pandas(
            desc="Applying Local DP",
            bar_format="{desc}: {percentage:3.0f}%|{bar}| {n_fmt}/{total_fmt} [{elapsed}<{remaining}]",
        )

        return df.progress_apply(self.apply_local_dp)


def main():
    np.random.seed(42)
    
    parser = argparse.ArgumentParser(
        description="Apply local differential privacy to a dataset."
    )
    parser.add_argument("--scale", type=float, help="Scale parameter for Laplace noise")
    parser.add_argument(
        "--probability",
        type=float,
        help="Probability parameter for randomized response",
    )
    parser.add_argument("--input_csv", type=str, help="Path to the input CSV file")
    parser.add_argument(
        "--output_csv", type=str, help="Path to save the output CSV file"
    )

    args = parser.parse_args()

    if (
        not args.scale
        or not args.probability
        or not args.input_csv
        or not args.output_csv
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

    privacy = LocalDifferentialPrivacy(args.scale, args.probability)

    try:
        df_transformed = privacy.apply_to_dataframe(df)
    except Exception as e:
        logging.error(f"Error applying local differential privacy: {e}")
        return

    try:
        df_transformed.to_csv(args.output_csv, index=False)
        print(f"Transformed data saved to {args.output_csv}")
    except Exception as e:
        logging.error(f"Error saving the output CSV file: {e}")
        return


if __name__ == "__main__":
    main()