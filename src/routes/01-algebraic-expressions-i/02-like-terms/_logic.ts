import {
	Term,
	Expression,
	WorkingExpression,
	BracketedTerm,
	Fraction,
	getRandomInt
} from 'mathlify';
import { math, display } from '$lib/math';
import { shuffle, coinFlip } from '$lib/utils/index';

export function generateNewVariables(level: number): [Term[], Coefficients] {
	const variables = ['', 'x', 'x^2', 'y', 'xy'];
	const terms: Term[] = [];
	const coefficients: Coefficients = {};
	const variable1Index = getRandomInt(0, 4);
	const a = getRandomInt(-9, 9, { avoid: [0] });
	const b = getRandomInt(-9, 9, { avoid: [0] });
	terms.push(new Term(a, variables[variable1Index]), new Term(b, variables[variable1Index]));
	coefficients[variables[variable1Index]] = new Fraction(a + b);
	if (level === 0 || level === 1) {
		// 0: xx y, 1: xx y z or xxx y
		const variable2Index = getRandomInt(0, 4, { avoid: [variable1Index] });
		const c = getRandomInt(-9, 9, { avoid: [0] });
		terms.push(new Term(c, variables[variable2Index]));
		coefficients[variables[variable2Index]] = new Fraction(c);
		if (level === 1) {
			if (coinFlip()) {
				const variable3Index = getRandomInt(0, 4, { avoid: [variable1Index, variable2Index] });
				const d = getRandomInt(-9, 9, { avoid: [0] });
				terms.push(new Term(d, variables[variable3Index]));
				coefficients[variables[variable3Index]] = new Fraction(d);
			} else {
				const d = getRandomInt(-9, 9, { avoid: [0] });
				terms.push(new Term(d, variables[variable1Index]));
				coefficients[variables[variable1Index]] = coefficients[variables[variable1Index]].plus(d);
			}
		}
	} else {
		// xx yy z or xxx yy
		const variable2Index = getRandomInt(0, 4, { avoid: [variable1Index] });
		const c = getRandomInt(-9, 9, { avoid: [0] });
		const d = getRandomInt(-9, 9, { avoid: [0] });
		terms.push(new Term(c, variables[variable2Index]), new Term(d, variables[variable2Index]));
		coefficients[variables[variable2Index]] = new Fraction(c + d);
		if (coinFlip()) {
			const variable3Index = getRandomInt(0, 4, { avoid: [variable1Index, variable2Index] });
			const e = getRandomInt(-9, 9, { avoid: [0] });
			terms.push(new Term(e, variables[variable3Index]));
			coefficients[variables[variable3Index]] = new Fraction(e);
		} else {
			const e = getRandomInt(-9, 9, { avoid: [0] });
			terms.push(new Term(e, variables[variable1Index]));
			coefficients[variables[variable1Index]] = coefficients[variables[variable1Index]].plus(e);
		}
	}
	shuffle(terms);
	return [terms, coefficients];
}

export function generateQn(
	terms: Term[],
	coefficients: Coefficients,
	level: number
): { qn: string; answer: string; working: string } {
	let qnString: string, answer: string, working: string;

	const workingExpression = new WorkingExpression(...terms);
	return {
		qn: math(`${workingExpression}`),
		answer: math(`${workingExpression.simplify()}`),
		working: ''
	};
}

export function assignMarks(
	coefficientsAttempt: Coefficients,
	termsAttempt: Term[],
	coefficients: Coefficients,
	terms: Term[],
	level: number,
	simplified: boolean
): number {
	terms = new Expression(...terms).terms;
	const termNoArray = [3, 4, 5];
	let correct = true;
	for (const [key, value] of Object.entries(coefficientsAttempt)) {
		if (!(key in coefficients) || !coefficients[key].isEqualTo(value)) {
			correct = false;
		}
	}
	for (const [key, value] of Object.entries(coefficients)) {
		if (!(key in coefficientsAttempt) || !coefficientsAttempt[key].isEqualTo(value)) {
			correct = false;
		}
	}
	if (correct) {
		if (termsAttempt.length === terms.length) {
			// all terms are combined
			return simplified ? 2 : 1;
		} else {
			// some terms combined
			return termsAttempt.length < termNoArray[level] ? 1 : 0;
		}
	} else {
		return 0;
	}
}

export interface Coefficients {
	[index: string]: Fraction;
	''?: Fraction;
	x?: Fraction;
	'x^2'?: Fraction;
	xy?: Fraction;
	y?: Fraction;
}
