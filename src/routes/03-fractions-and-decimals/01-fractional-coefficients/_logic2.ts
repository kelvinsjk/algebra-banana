import { Term, WorkingExpression, Fraction, getRandomInt, Polynomial, BracketedTerm, Expression } from 'mathlify';
import { display } from '$lib/math';
import { coinFlip } from '$lib/utils/index';

// a, b, c, d, A, C, den, denPos1, denPos2, variant, swap1, swap2, swap3
export function generateNewVariables(level:number): [number, number, number, number, number, number, number, number, boolean, boolean, boolean, boolean] {
	const variant = coinFlip();
	const avoid = level===0 ? [0,1] : [0];
	const a = getRandomInt(-9,9, {avoid});
	const b = getRandomInt(-9,9, {avoid:[0]});
	const c = level===0 && !variant ? 0 : getRandomInt(-9,9, {avoid:[0,a]});
	const x = getRandomInt(-12,12);
	const denominators = [2,4,5,10];
	const den = denominators[getRandomInt(0,denominators.length-1)];
	const denPos1 = coinFlip() ? 0 : level===0 ? 1 : getRandomInt(1,2);
	const denPos2 = denPos1===0 ? 0 : 1;
	const A = getRandomInt(-9,9, {avoid:[0,1]});
	return [a,b,c,x,0,den,denPos1,denPos2,variant,coinFlip(),coinFlip(),coinFlip()];
}

export function generateQn(
	a: number,
	b: number,
	c: number,
	x: number,
	A: number,
	den: number,
	denPos1: number,
	denPos2: number,
	variant: boolean,
	swap1: boolean,
	swap2: boolean,
	swap3: boolean,
	level: number
): { qn: string; answer: Fraction, working: string } {
	let qnString: string;
	let working = '';
	const answer = denPos1 === 0 ? new Fraction(x,den) : new Fraction(x);
	const aX = denPos1===0 ? new Term(a, 'x') : new Term(Math.sign(a), Math.abs(a)/den===1 ? 'x' : `${Math.abs(a)/den}x`);
	const bTerm = denPos1===2 ? new Term(b) : new Term(Math.sign(b),`${Math.abs(b)/den}`);
	const negativeBTerm = denPos1===2 ? new Term(-b) : new Term(Math.sign(-b),`${Math.abs(b)/den}`);
	const aXPlusB = swap2 ? new Expression(aX, bTerm) : new Expression(bTerm,aX);
	const d = ((a-c)*x+b)/den;
	const cX = denPos2===0 ? new Term(c, 'x') : new Term(Math.sign(c),Math.abs(c)/den===1 ? 'x' : `${Math.abs(c)/den}x`);
	const negativeCX = denPos2===0 ? new Term(-c, 'x') : new Term(Math.sign(-c),Math.abs(c)/den===1 ? 'x' : `${Math.abs(c)/den}x`);
	const aMinusCX = denPos2===0 ? new Term(a-c, 'x') : new Term(Math.sign(a-c),Math.abs(a-c)/den===1 ? 'x' : `${Math.abs(a-c)/den}x`);
	const dTerm = new Term(Math.sign(d), `${Math.abs(d)}`);
	const cXPlusD = swap3 ? new Expression(cX, dTerm) : new Expression(dTerm,cX);	
	if (level===0){ // ax + b = cx + d;
		qnString = `${aXPlusB} = ${cXPlusD}`;
		if (!variant){ // ax + b = c
			const finalStep = a === answer.den && answer.num > 0 ? '' : `x &= ${denPos1 === 0 ? x/den : x}`
			working = `\\begin{align*}
				${aXPlusB} &= ${cXPlusD} \\\\
				${aX} &= ${new WorkingExpression(dTerm, negativeBTerm)} \\\\
				${aX} &= ${new Term(Math.sign(a*x), `${Math.abs(a*x/den)}`)} \\\\
				x &= ${new Term(Math.sign(a*x), `${Math.abs(a*x/den)}`)} \\div ${new Term(Math.sign(a), denPos1===1 ? `${Math.abs(a)/den}`: `${Math.abs(a)}`)} \\\\
				${finalStep}
			\\end{align*}`;
		} else {
			const finalStep = ((a-c === 1 && denPos1===0)||(a-c === den && denPos1===1)) ? '' : `x &= ${new Term(Math.sign((a-c)*x), `${Math.abs((a-c)*x/den)}`)} \\div ${new Term(Math.sign(a-c), denPos1===1 ? `${Math.abs(a-c)/den}`: `${Math.abs(a-c)}`)} \\\\ x &= ${denPos1 === 0 ? x/den : x}`
			working = `\\begin{align*}
				${aXPlusB} &= ${cXPlusD} \\\\
				${new WorkingExpression(aX, negativeCX)} &= ${new WorkingExpression(dTerm, negativeBTerm)} \\\\
				${aMinusCX} &= ${new Term(Math.sign((a-c)*x), `${Math.abs((a-c)*x/den)}`)} \\\\
				${finalStep}
			\\end{align*}`;
		}
	} // TODO: level 2
	return {
		qn: display(qnString),
		answer,
		working: display(working)
	};
}

export function assignMarks(
	attempt: Fraction,
	answer: Fraction,
	simplified: boolean
): number {
	if (attempt.isEqualTo(answer)){
		return simplified ? 2 : 1;
	} else {
		return 0
	}
}
