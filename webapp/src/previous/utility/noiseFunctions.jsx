const addLaplaceNoise = (originalValue, sensitivity, epsilon) => {
  const b = sensitivity / epsilon;
  const u = Math.random() - 0.5;
  const noise = -1 * Math.sign(u) * b * Math.log(1 - 2 * Math.abs(u));
  return parseFloat(originalValue) + noise;
};

const addDpGaussianNoise = (originalValue, sensitivity, epsilon) => {
  const scale = sensitivity / epsilon;
  const noise = Math.random() * scale;
  return parseFloat(originalValue) + noise;
};

export const addNoise = (originalValue,sensitivity, epsilon, noiseType) => {
  switch(noiseType){
    case 'laplace' :
      return addLaplaceNoise(originalValue, sensitivity, epsilon);
    case 'gaussian' :
      return addDpGaussianNoise(originalValue, sensitivity, epsilon);
  }
}