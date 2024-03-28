import React, { useState, useEffect } from 'react';

const generateRandomNumbers = (n) => {
  const numbers = [];
  for (let i = 0; i < n; i++) {
    numbers.push(Math.random() * 10); // Adjust the range as needed
  }
  return numbers;
};

const addLaplaceNoise = (originalValue, sensitivity, epsilon) => {
  const b = sensitivity / epsilon;
  const u = Math.random() - 0.5; // Uniform noise in the range [-0.5, 0.5]
  const noise = -1 * Math.sign(u) * b * Math.log(1 - 2 * Math.abs(u));
  return originalValue + noise;
};

const addNoiseToList = (numbers, sensitivity, epsilon) => {
  return numbers.map((value) => addLaplaceNoise(value, sensitivity, epsilon));
};

const LaplaceNoiseApp = () => {
  const [originalNumbers, setOriginalNumbers] = useState([]);
  const [noisyNumbers, setNoisyNumbers] = useState([]);

  useEffect(() => {
    // Generate a list of 10 random numbers on mount
    const initialNumbers = generateRandomNumbers(10);
    setOriginalNumbers(initialNumbers);

    // Define sensitivity and privacy parameter (epsilon)
    const sensitivity = 1.0; // Adjust based on your data characteristics
    const epsilon = 1.0; // Adjust based on desired privacy level

    // Add Laplace noise to the original list of numbers
    const noisyNumbers = addNoiseToList(initialNumbers, sensitivity, epsilon);
    setNoisyNumbers(noisyNumbers);
  }, []);

  return (
    <div>
      <h2>Original Numbers</h2>
      <ul>
        {originalNumbers.map((number, index) => (
          <li key={index}>{number.toFixed(2)}</li>
        ))}
      </ul>

      <h2>Noisy Numbers</h2>
      <ul>
        {noisyNumbers.map((number, index) => (
          <li key={index}>{number.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
};

export default LaplaceNoiseApp;
