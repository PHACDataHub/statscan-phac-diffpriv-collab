"""
Paper used for implementation:
- Title: Applying the Shuffle Model of Differential Privacy to Vector Aggregation
- Authors: Mary Scott, Graham Cormode, Carsten Maple
- Link: https://arxiv.org/pdf/2112.05464v3.pdf
"""

import argparse
import logging
import math
from pathlib import Path

import numpy as np
import pandas as pd
from tqdm import tqdm


class ShuffleDifferentialPrivacy:
    """
    A class for applying Shuffle Differential Privacy to a dataset.

    Attributes:
    - epsilon: The privacy parameter ε for differential privacy.
    - delta: The privacy parameter δ for differential privacy.

    Methods:
    - calculate_gamma: Calculate the gamma parameter for the shuffle model.
    - calculate_upper_bounds: Calculate the upper bounds for each column in the DataFrame.
    - local_randomizer: Apply local randomization to a value based on gamma and k.
    - shuffle_model: Apply Shuffle Differential Privacy to a DataFrame.
    """

    def __init__(self, epsilon: float, delta: float):
        """
        Initialize ShuffleDifferentialPrivacy with privacy parameters.

        Parameters:
        - epsilon: The privacy parameter ε for differential privacy.
        - delta: The privacy parameter δ for differential privacy.
        """
        self.epsilon = epsilon
        self.delta = delta

    def calculate_gamma(self, n_rows, n_cols, ε, δ):
        """
        Calculate the gamma parameter for the shuffle model.

        Parameters:
        - n_rows: The number of rows in the DataFrame.
        - n_cols: The number of columns in the DataFrame.
        - ε: Privacy parameter ε.
        - δ: Privacy parameter δ.

        Returns:
        - gamma: The calculated gamma parameter.
        """
        if ε < 1:
            gamma = max(
                14 * n_cols * math.log(2 / δ) / ((n_rows - 1) * ε**2),
                27 * n_cols / ((n_rows - 1) * ε),
            )
        elif 1 <= ε < 6:
            gamma = max(
                80 * n_cols * math.log(2 / δ) / ((n_rows - 1) * ε**2),
                36 * n_cols * 11 / ((n_rows - 1) * ε),
            )
        else:
            raise ValueError("ε must be in the range [1, 6)")
        return gamma

    def calculate_upper_bounds(self, df):
        """
        Generate a dictionary with column names and their maximum values from a DataFrame.

        Parameters:
        - df: The input DataFrame.

        Returns:
        - max_values: A dictionary containing column names and their maximum values.
        """
        upper_bounds = df.max().to_dict()
        return upper_bounds

    def local_randomizer(self, value, gamma, k):
        """
        Local randomizer function for Shuffle Differential Privacy.

        Parameters:
        - value: The original value to be randomized.
        - gamma: The gamma parameter for the shuffle model.
        - k: The upper bound for randomization.

        Returns:
        - randomized_value: The randomized value.
        """
        b = np.random.binomial(n=1, p=1 - gamma)
        if b == 0:
            return value
        else:
            if isinstance(value, int):
                return np.random.randint(k)
            else:
                return np.random.uniform(k)

    def shuffle_model(self, df):
        """
        Shuffle Model function for applying Shuffle Differential Privacy.

        Parameters:
        - df: The input DataFrame.

        Returns:
        - shuffled_df: The DataFrame with Shuffle Differential Privacy applied.
        """
        gamma = self.calculate_gamma(len(df), len(df.columns), self.epsilon, self.delta)
        upper_bounds = self.calculate_upper_bounds(df)

        # Initialize tqdm with the total number of columns
        progress_bar = tqdm(
            total=len(df.columns),
            desc="Applying the local randomizer and shuffling operation",
        )

        # Iterate over columns in the DataFrame
        for column in df.columns:
            # Get k from the upper_bound dictionary for the current column
            k = upper_bounds[column]

            # Apply local randomizer to each element in the current column
            df[column] = df[column].apply(lambda x: self.local_randomizer(x, gamma, k))

            # Update tqdm progress bar
            progress_bar.update(1)

        # Close tqdm progress bar
        progress_bar.close()

        # Shuffle the DataFrame
        shuffled_df = df.sample(frac=1).reset_index(drop=True)

        return shuffled_df