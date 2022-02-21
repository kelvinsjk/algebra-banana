import { getRandomInt } from 'mathlify';
import { generateNewVariables } from './_logic';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
	const level = getRandomInt(0, 2);
	const [terms, coefficients] = generateNewVariables(level);
	const coefficientsInt: {
		''?: number;
		x?: number;
		'x^2'?: number;
		xy?: number;
		y?: number;
	} = {};
	for (const [key, value] of Object.entries(coefficients)) {
		coefficientsInt[key] = value.num;
	}
	return {
		body: {
			termsJSON: JSON.stringify(terms),
			coefficientsInt,
			level
		}
	};
}
