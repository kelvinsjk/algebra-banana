import { getRandomInt } from 'mathlify';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
	const level = getRandomInt(0, 6);
	const avoid = level === 4 ? [0] : [];
	return {
		body: {
			a: getRandomInt(-9, 9, { avoid: [0] }),
			b: getRandomInt(-9, 9, { avoid: [0] }),
			x: getRandomInt(-9, 9, { avoid }),
			y: getRandomInt(-9, 9, { avoid }),
			level
		}
	};
}
