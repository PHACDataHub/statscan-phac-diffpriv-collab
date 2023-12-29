export const initFormState = {
    exerciseFrequency: {
      value : '',
      label : 'Exercise Frequency (days per week):',
      type : 'number',
      border : false,
      range : [0,7],
      performIntegerCheck : true
    },
    exerciseDuration: {
      value : '',
      label : 'Exercise Duration (minutes per session):',
      type : 'number',
      border : false,
      range : [0,60],
      performIntegerCheck : true
    },
    exerciseIntensity: {
      value : '',
      label : 'Exercise Intensity:',
      type : 'select',
      values : [{value : '', label : 'Select Intensity'},{value : 'low', label : 'Low'},{value : 'moderate', label : 'Moderate'},{value : 'high', label : 'High'}],
      border : false
    },
    dailyStepCount: {
      value : '',
      label : 'Daily Step Count:',
      type : 'number',
      border : false,
      range : [0,60],
      performIntegerCheck : true
    },
    sleepDuration: {
      value : '',
      label : 'Sleep Duration (hours per night):',
      type : 'number',
      border : false,
      range : [0, 8],
      performIntegerCheck : false
    },
    weightStatus: {
      value : '',
      label : 'Weight Status (in the past six months):',
      type : 'select',
      values : [{value : '', label : 'Select Weight Status'},{value : 'underweight', label : 'Underweight'},{value : 'normal', label : 'Normal'},{value : 'overweight', label : 'Overweight'},{value : 'obese', label : 'Obese'}],
      border : false
    },
    weightChange: {
      value : '',
      label : 'Weight Change (in the past six months):',
      type : 'number',
      border : false,
      range : [0,60],
      performIntegerCheck : false
    },
    fitnessLevel: {
      value : '',
      label : 'Fitness Level (on a scale of 1 to 10):',
      type : 'number',
      border : false,
      range : [1,10],
      performIntegerCheck : true
    },
    appUsageFrequency: {
      value : '',
      label : 'App Usage Frequency (times per week):',
      type : 'number',
      border : false,
      range : [0,60],
      performIntegerCheck : true
    },
    caloricIntake: {
      value : '',
      label : 'Caloric Intake (calories per day):',
      type : 'number',
      border : false,
      range : [0,60],
      performIntegerCheck : false 
    },
  }