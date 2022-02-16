import { getRandomInt } from 'mathlify';

export function shuffleAndInsertAns(ans: string, array: string[]): [string[], number] {
	array = shuffle(array);
	const n = array.length;
	const ansID = getRandomInt(0, n);
	array.splice(ansID, 0, ans);
	return [array, ansID];
}

/**
 * shuffles an array
 *
 * WARNING: mutates array
 */
export function shuffle(array: any[]): any[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
