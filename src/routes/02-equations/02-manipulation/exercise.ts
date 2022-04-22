import { getRandomInt } from 'mathlify';
import { generateNewVariables } from './_logic';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
	const level = getRandomInt(0, 1);
	const variables = generateNewVariables();
	return {
		body: {
			variables,
			level
		}
	};
}
