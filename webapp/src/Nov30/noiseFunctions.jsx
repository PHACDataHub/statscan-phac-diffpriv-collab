export const addLaplaceNoise = (originalValue, sensitivity, epsilon) => {
  const b = sensitivity / epsilon;
  const u = Math.random() - 0.5;
  const noise = -1 * Math.sign(u) * b * Math.log(1 - 2 * Math.abs(u));
  return originalValue + noise;
};

export const addDpGaussianNoise = (originalValue, sensitivity, epsilon) => {
  const scale = sensitivity / epsilon;
  const noise = Math.random() * scale;
  return originalValue + noise;
};
