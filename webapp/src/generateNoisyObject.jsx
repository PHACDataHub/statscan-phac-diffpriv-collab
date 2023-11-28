import addLaplaceNoise from './addLaplaceNoise'; // Replace with the correct path to your addLaplaceNoise file

const generateNoisyObject = (originalObject, sensitivity, epsilon) => {
  const noisyData = {};
  for (const key in originalObject) {
    if (originalObject.hasOwnProperty(key)) {
      const noisyValue = addLaplaceNoise(originalObject[key], sensitivity, epsilon);
      const roundedValue = typeof noisyValue === 'number' ? Number(noisyValue.toFixed(2)) : parseFloat(noisyValue);
      noisyData[key] = roundedValue;
    }
  }
  return noisyData;
};

export default generateNoisyObject;
