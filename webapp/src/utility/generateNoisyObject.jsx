import {addNoise} from './noiseFunctions.jsx';

export const generateNoisyObject = (originalObject, sensitivity, epsilon, noiseType) => {
  const noisyData = {};
  for (const key in originalObject) {
    if (originalObject.hasOwnProperty(key)) {
      const noisyValue = addNoise(originalObject[key], sensitivity, epsilon, noiseType);
      const roundedValue = typeof noisyValue === 'number' ? Number(noisyValue.toFixed(2)) : parseFloat(noisyValue);
      noisyData[key] = roundedValue;
    }
  }
  return noisyData;
};

