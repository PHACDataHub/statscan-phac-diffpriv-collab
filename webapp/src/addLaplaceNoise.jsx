const addLaplaceNoise = (originalValue, sensitivity, epsilon) => {
  const b = sensitivity / epsilon;
  const u = Math.random() - 0.5; // Uniform noise in the range [-0.5, 0.5]
  const noise = -1 * Math.sign(u) * b * Math.log(1 - 2 * Math.abs(u));
  return parseFloat(originalValue) + noise;
};

export default addLaplaceNoise;