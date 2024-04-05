import {addNoise,randomizeResponse} from './noiseFunctions.jsx';

export const generateNoisyObject = (originalObject, sensitivity, epsilon, noiseType) => {
  const noisyData = {};
  for (const key in originalObject) {
    if(originalObject[key].type === 'number'){
      const noisyValue = addNoise(originalObject[key].value, sensitivity, epsilon, noiseType);
      const roundedValue = typeof noisyValue === 'number' ? Number(noisyValue.toFixed(2)) : parseFloat(noisyValue);
      noisyData[key] = roundedValue;
    }
    else{
      const field = originalObject[key];
      const originalValue = field.value;
      const originalIndex = field.values.findIndex((el) => el.value === originalValue);
      const noisyIndex = randomizeResponse(originalIndex,field.values);
      noisyData[key] = field.values[noisyIndex].value;
    }
  }
  return noisyData;
};

