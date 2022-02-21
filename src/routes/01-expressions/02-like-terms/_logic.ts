import { Term, Expression, WorkingExpression, Fraction, getRandomInt } from 'mathlify';
import { math, display } from '$lib/math';
import { shuffle, coinFlip } from '$lib/utils/index';

export function generateNewVariables(level: number): [Term[], Coefficients, number] {
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
		const c = 5; //getRandomInt(-9, 9, { avoid: [0] });
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
	return [terms, coefficients, coinFlip() ? 0 : getRandomInt(1, terms.length - 1)];
}

export function generateQn(
	terms: Term[],
	coefficients: Coefficients,
	bracketPos: number,
	level: number
): { qn: string; answer: string; working: string } {
	let qn: string, working: string;

	const qnString = new WorkingExpression(...terms);
	const answer = math(`${qnString.simplify()}`);
	if (level === 0 || bracketPos === 0) {
		qn = math(`${qnString}`);
		const workingExpression = new WorkingExpression(...arrangeTerms(terms));

		const workingStep1 =
			`${qnString}` === `${workingExpression}`
				? `&= ${workingExpression.simplify()}`
				: `&= ${workingExpression}`;
		const workingStep2 =
			`${qnString}` === `${workingExpression}` ? '' : `&= ${workingExpression.simplify()}`;

		working = display(`\\begin{align*}
			&\\phantom{=} ${qnString} \\\\
			${workingStep1} \\\\
			${workingStep2}
		\\end{align*}`);
	} else {
		const specialTerm = terms[bracketPos];
		const bracketedTerm = new Term(
			specialTerm.coeff.isGreaterThan(0) ? -1 : 1,
			specialTerm.coeff.isGreaterThan(0) ? `(${specialTerm.negative()})` : `(${specialTerm})`
		);
		const workingExpression = new WorkingExpression(
			...terms.slice(0, bracketPos),
			bracketedTerm,
			...terms.slice(bracketPos + 1)
		);
		qn = math(`${workingExpression}`);
		const workingExpression2 = new WorkingExpression(...arrangeTerms(terms));
		const workingStep1 =
			`${qnString}` === `${workingExpression2}`
				? `&= ${workingExpression2.simplify()}`
				: `&= ${workingExpression2}`;
		const workingStep2 =
			`${qnString}` === `${workingExpression2}` ? '' : `&= ${workingExpression2.simplify()}`;
		working = display(`\\begin{align*}
			&\\phantom{=} ${workingExpression} \\\\
			&= ${qnString} \\\\
			${workingStep1} \\\\
			${workingStep2}
		\\end{align*}`);
	}
	return {
		qn,
		answer,
		working
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
			if (!value.isEqualTo(0)) {
				correct = false;
			}
		}
	}
	for (const [key, value] of Object.entries(coefficients)) {
		if (!(key in coefficientsAttempt) || !coefficientsAttempt[key].isEqualTo(value)) {
			if (!value.isEqualTo(0)) {
				correct = false;
			}
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

function arrangeTerms(terms: Term[]): Term[] {
	const type1Terms: Term[] = [];
	const type2Terms: Term[] = [];
	const type3Terms: Term[] = [];
	let type1Variable: string, type2Variable: string;
	terms.forEach((term) => {
		if (type1Variable === undefined) {
			type1Variable = term.variable;
			type1Terms.push(term);
		} else {
			if (term.variable === type1Variable) {
				type1Terms.push(term);
			} else {
				if (type2Variable === undefined) {
					type2Variable = term.variable;
					type2Terms.push(term);
				} else {
					if (term.variable === type2Variable) {
						type2Terms.push(term);
					} else {
						type3Terms.push(term);
					}
				}
			}
		}
	});
	return [...type1Terms, ...type2Terms, ...type3Terms];
}

export interface Coefficients {
	[index: string]: Fraction;
	''?: Fraction;
	x?: Fraction;
	'x^2'?: Fraction;
	xy?: Fraction;
	y?: Fraction;
}
