import React from 'react';

const CoinFlip = ({ formSubmissions, setFormSubmissions, formState }) => {
  const flipCoinAndUpdateTable = () => {
    const updatedData = formSubmissions.map((submission) => {
      const updatedRow = {};

      for (const key in submission) {
        const coinFlip = Math.random() < 0.5;

        if (coinFlip) {
          const field = formState[key];
          const randomIndex = Math.floor(Math.random() * field.values.length);
          updatedRow[key] = {
            ...submission[key],
            value: field.values[randomIndex].value,
          };
        } else {
          updatedRow[key] = submission[key];
        }
      }

      return updatedRow;
    });

    setFormSubmissions(updatedData);
  };

  return (
    <div>
      <button onClick={flipCoinAndUpdateTable}>Flip Coin and Update Table</button>
    </div>
  );
};

export default CoinFlip;
