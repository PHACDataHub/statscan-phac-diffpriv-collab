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

export const randomizeResponse = (originalIndex, values) => {
  const coinFlip = Math.random() < 0.5;
  if (coinFlip) {
    const min = 1,max = values.length - 1;
    const randomIndex = Math.floor(((Math.random() * (max + 1 - min)) + min));
    //const randomIndex = Math.floor(Math.random() * (values.length));
    return randomIndex;
  } 
  return originalIndex;
}

export const addNoise = (originalValue,sensitivity, epsilon, noiseType) => {
  switch(noiseType){
    case 'laplace' :
      return addLaplaceNoise(originalValue, sensitivity, epsilon);
    case 'gaussian' :
      return addDpGaussianNoise(originalValue, sensitivity, epsilon);
  }
}