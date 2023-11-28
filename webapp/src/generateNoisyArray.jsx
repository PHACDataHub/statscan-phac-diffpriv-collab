const addLaplaceNoise = (originalValue, sensitivity, epsilon) => {
  const b = sensitivity / epsilon;
  const u = Math.random() - 0.5;
  const noise = -1 * Math.sign(u) * b * Math.log(1 - 2 * Math.abs(u));
  return originalValue + noise;
};

const addNoiseToList = (numbers, sensitivity, epsilon) => {
  return numbers.map((value) => addLaplaceNoise(value, sensitivity, epsilon));
};

const generateNoisyArray = (originalArray, sensitivity, epsilon) => {
  return addNoiseToList(originalArray, sensitivity, epsilon);
};

export default generateNoisyArray;
