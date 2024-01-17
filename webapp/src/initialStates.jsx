export const initFormState = {
	exerciseIntensity: {
		value: '',
		label: 'Exercise Frequency (days per week):',
		type: 'select',
		values: [
			{ value: '', label: 'Select Frequency' },
			{ value: '0', label: '0' },
			{ value: '1', label: '1' },
			{ value: '2', label: '2' },
			{ value: '3', label: '3' },
			{ value: '4', label: '4' },
			{ value: '5', label: '5' },
			{ value: '6', label: '6' },
			{ value: '7', label: '7' }
		],
	},
	exerciseSessionLength: {
		value: '',
		label: 'Exercise Session Length (minutes):',
		type: 'select',
		values: [
			{ value: '', label: 'Select Session Length' },
			{ value: '30', label: '30' },
			{ value: '40', label: '40' },
			{ value: '50', label: '50' },
			{ value: '60', label: '60' },
			{ value: '70', label: '70' },
			{ value: '80', label: '80' },
			{ value: '90', label: '90' },
			{ value: '100', label: '100' }
		],
	},
	hoursOfSleep: {
		value: '',
		label: 'Hours of Sleep at Night:',
		type: 'select',
		values: [
			{ value: '', label: 'Select Hours' },
			{ value: '<5', label: 'Less than 5' },
			{ value: '5-6', label: '5-6' },
			{ value: '6-7', label: '6-7' },
			{ value: '7-8', label: '7-8' },
			{ value: '8-9', label: '8-9' },
			{ value: '9-10', label: '9-10' }
		],
	},
	bmi: {
		value: '',
		label: 'Body Mass Index (BMI):',
		type: 'select',
		values: [
			{ value: '', label: 'Select BMI' },
			{ value: '<18.5', label: 'Less than 18.5' },
			{ value: '18.5-24.9', label: '18.5-24.9' },
			{ value: '25.0-29.9', label: '25.0-29.9' },
			{ value: '30.0-34.9', label: '30.0-34.9' },
			{ value: '>35.0', label: 'More than 35.0' }
		],
	},
}
