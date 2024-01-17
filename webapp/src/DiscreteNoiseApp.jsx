// Function to generate a random integer based on the given probability distribution
function generateRandomInteger(epsilon) {
	const rand = Math.random();
	const sign = Math.random() < 0.5 ? 1 : -1;

	let probability = (1 - epsilon/2) / (1 + epsilon/2);
	let integer = 0;

	while (rand > probability) {
			integer += sign;
			probability *= epsilon/2;
	}

	return integer;
}

// Example usage with epsilon = 0.2
const epsilon = 0.2;
const randomInteger = generateRandomInteger(epsilon);
console.log("Generated random integer:", randomInteger);
