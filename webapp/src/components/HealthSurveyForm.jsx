import React, { useState } from 'react';

const HealthSurveyForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    exerciseFrequency: '',
    exerciseDuration: '',
    exerciseIntensity: '',
    dailyStepCount: '',
    sleepDuration: '',
    weightStatus: '',
    weightChange: '',
    fitnessLevel: '',
    appUsageFrequency: '',
    caloricIntake: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Exercise Frequency (days per week):
          <input
            type="number"
            name="exerciseFrequency"
            value={formData.exerciseFrequency}
            onChange={handleChange}
          />
        </label>

        <label>
          Exercise Duration (minutes per session):
          <input
            type="number"
            name="exerciseDuration"
            value={formData.exerciseDuration}
            onChange={handleChange}
          />
        </label>

        <label>
          Exercise Intensity:
          <select
            name="exerciseIntensity"
            value={formData.exerciseIntensity}
            onChange={handleChange}
          >
            <option value="">Select Intensity</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          Daily Step Count:
          <input
            type="number"
            name="dailyStepCount"
            value={formData.dailyStepCount}
            onChange={handleChange}
          />
        </label>

        <label>
          Sleep Duration (hours per night):
          <input
            type="number"
            name="sleepDuration"
            value={formData.sleepDuration}
            onChange={handleChange}
          />
        </label>

        <label>
          Weight Status:
          <select
            name="weightStatus"
            value={formData.weightStatus}
            onChange={handleChange}
          >
            <option value="">Select Weight Status</option>
            <option value="underweight">Underweight</option>
            <option value="normal">Normal</option>
            <option value="overweight">Overweight</option>
            <option value="obese">Obese</option>
          </select>
        </label>

        <label>
          Weight Change (in the past six months):
          <input
            type="number"
            name="weightChange"
            value={formData.weightChange}
            onChange={handleChange}
          />
        </label>

        <label>
          Fitness Level (on a scale of 1 to 10):
          <input
            type="number"
            name="fitnessLevel"
            value={formData.fitnessLevel}
            onChange={handleChange}
          />
        </label>

        <label>
          App Usage Frequency (times per week):
          <input
            type="number"
            name="appUsageFrequency"
            value={formData.appUsageFrequency}
            onChange={handleChange}
          />
        </label>

        <label>
          Caloric Intake (calories per day):
          <input
            type="number"
            name="caloricIntake"
            value={formData.caloricIntake}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default HealthSurveyForm;
