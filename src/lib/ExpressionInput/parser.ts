import { Fraction, gcd, Term } from 'mathlify';

export function isValidExpression(x: string): [
	boolean,
	{
		coefficients?: {
			''?: Fraction;
			x?: Fraction;
			'x^2'?: Fraction;
			xy?: Fraction;
			y?: Fraction;
		};
		terms?: Term[];
		simplified?: boolean;
	}?
] {
	if (typeof x === 'string') {
		x = x.trim();
		if (x.length === 0) {
			return [false];
		}
		if (x.includes('+-')) {
			return [false];
		}
	} else {
		return [false];
	}
	const breakup = breakTerms(x);
	if (!breakup.valid) {
		return [false];
	}
	let simplified = true;
	let invalid = false;
	const terms: Term[] = [];
	const coefficients: {
		''?: Fraction;
		x?: Fraction;
		'x^2'?: Fraction;
		xy?: Fraction;
		y?: Fraction;
	} = {};

	breakup.terms.forEach((term) => {
		const { coefficient, variable } = breakTerm(term);
		let validCoefficient: boolean,
			coefficientType: { type?: string; fraction?: Fraction; simplified?: boolean };
		if (coefficient === '') {
			if (variable === '') {
				invalid = true;
				return;
			}
			validCoefficient = true;
			coefficientType = { type: 'int', fraction: new Fraction(1), simplified: true };
		} else if (coefficient === '-') {
			if (variable === '') {
				invalid = true;
				return;
			}
			validCoefficient = true;
			coefficientType = { type: 'int', fraction: new Fraction(-1), simplified: true };
		} else {
			[validCoefficient, coefficientType] = isValidConstant(coefficient);
			if (validCoefficient && coefficientType.fraction.abs().isEqualTo(1) && variable !== '') {
				simplified = false;
			}
		}
		const [validVariable, variableType] = isValidVariable(variable);

		if (!validCoefficient || !validVariable) {
			invalid = true;
			return;
		}
		simplified = simplified && coefficientType.simplified;
		coefficients[variableType] =
			coefficients[variableType] === undefined
				? coefficientType.fraction
				: coefficients[variableType].plus(coefficientType.fraction);
		terms.push(new Term(coefficientType.fraction, variableType));
	});
	if (invalid) {
		return [false];
	}
	return [
		true,
		{
			terms,
			coefficients,
			simplified
		}
	];
}

function breakTerms(x: string): { valid: boolean; terms: string[] } {
	let negative = false;
	if (x[0] === '-') {
		negative = true;
		x = x.slice(1);
	}
	const plusIndex = x.search(/\+/);
	const minusIndex = x.search(/-/);
	if (plusIndex === 0 || minusIndex === 0) {
		return { valid: false, terms: [] };
	}
	if (plusIndex < 0 && minusIndex < 0) {
		// only term
		return { valid: true, terms: [(negative ? '-' : '') + x] };
	} else {
		// more terms
		const indices = [plusIndex, minusIndex].filter((e) => e > 0);
		const index = Math.min(...indices);
		const firstTerm = (negative ? '-' : '') + x.slice(0, index);
		const remaining = x[index] === '-' ? x.slice(index) : x.slice(index + 1);
		const breakRemaining = breakTerms(remaining);
		return { valid: breakRemaining.valid, terms: [firstTerm, ...breakRemaining.terms] };
	}
}
function breakTerm(x: string): { coefficient: string; variable: string } {
	const xyIndex = x.search(/x|y/);
	return {
		coefficient: xyIndex === -1 ? x : x.slice(0, xyIndex),
		variable: xyIndex === -1 ? '' : x.slice(xyIndex)
	};
}
function isValidVariable(x: string): [boolean, string?] {
	if (x === '' || x === 'x' || x === 'x^2' || x === 'xy' || x === 'y') {
		return [true, x];
	}
	return [false];
}

/**
 * checks if input is valid, as an integer string, a decimal string, or a fraction latex string '\\frac{}{}'
 *
 * @returns [validity, type(int/decimal/fraction/mixedFraction), Fraction]
 */
function isValidConstant(
	x: string
): [boolean, { type?: string; fraction?: Fraction; simplified?: boolean }?] {
	if (isInteger(x)) {
		return [true, { type: 'int', fraction: new Fraction(Number(x)), simplified: true }];
	} else if (isDecimal(x)[0]) {
		return [true, { type: 'decimal', fraction: isDecimal(x)[1], simplified: true }];
	} else if (isFraction(x)[0]) {
		return [true, { type: 'fraction', fraction: isFraction(x)[1], simplified: isFraction(x)[2] }];
	} else if (isMixedFraction(x)[0]) {
		return [
			true,
			{ type: 'mixedFraction', fraction: isMixedFraction(x)[1], simplified: isMixedFraction(x)[2] }
		];
	} else {
		return [false];
	}
}

function isMixedFraction(x: string): [boolean, Fraction?, boolean?] {
	const mixedFractionRegex = /^(-?[1-9]\d*)\\frac\{([1-9]\d*)\}\{([1-9]\d*)\}$/;
	if (!mixedFractionRegex.test(x)) {
		return [false];
	}
	const match = x.match(mixedFractionRegex);
	const integer = Number(match[1]);
	const [num, den] = [Number(match[2]), Number(match[3])];
	const fractionalPart = new Fraction(num, den);
	const fraction =
		integer < 0 ? fractionalPart.negative().minus(integer) : fractionalPart.plus(integer);
	const simplified = gcd(num, den) === 1 && num !== 0 && num < den;
	return [true, fraction, simplified];
}

/**
 * @returns [validity, fraction, simplified]
 */
function isFraction(x: string): [boolean, Fraction?, boolean?] {
	const regex = /^(-?)\\frac\{((?:0)|(?:[1-9]\d*))\}\{([1-9]\d*)\}$/;
	const regex2 = /^()\\frac\{(-?(?:0|(?:[1-9]\d*)))\}\{([1-9]\d*)\}$/;
	if (!regex.test(x) && !regex2.test(x)) {
		return [false];
	}
	const match = regex.test(x) ? x.match(regex) : x.match(regex2);
	const [negative, num, den] = [match[1] === '-', Number(match[2]), Number(match[3])];
	const fraction = negative ? new Fraction(num, den).negative() : new Fraction(num, den);
	const simplified = gcd(num, den) === 1 && num !== 0 && den !== 1;
	return [true, fraction, simplified];
}
function isDecimal(x: string): [boolean, Fraction?] {
	const regex = /^(-?\d*)(\.)(\d+)/;
	const match = x.match(regex);
	if (match === null) {
		return [false];
	}
	const [integerString, decimal] = [match[1], Number(match[3])];
	const integer = integerString === '-' ? 0 : Number(integerString);
	let fractionalPart = new Fraction(decimal, Math.pow(10, decimal.toString().length));
	if (integerString[0] === '-') {
		fractionalPart = fractionalPart.negative();
	}
	const fraction = fractionalPart.plus(integer);
	return [true, fraction];
}

function isInteger(x: string): boolean {
	const regex = /^[1-9]\d*$/;
	const negativeRegex = /^-[1-9]\d*$/;
	return regex.test(x) || x === '0' || negativeRegex.test(x);
}
