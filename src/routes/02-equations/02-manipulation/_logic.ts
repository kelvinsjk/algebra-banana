import { Term, WorkingExpression, Fraction, getRandomInt, Polynomial } from 'mathlify';
import { display } from '$lib/math';
import { coinFlip } from '$lib/utils/index';

// a, b, m, additionMode, variant, swap1, swap2, swap3
export function generateNewVariables(): [number, number, number, boolean, boolean, boolean, boolean, boolean] {
	const additionMode = coinFlip();
	const avoid = additionMode ? [0] : [0,1,-1];
	const a = getRandomInt(-9,9, {avoid});
	const b = getRandomInt(-9,9);
	const m = getRandomInt(-9,9, {avoid:[0,-1]});
	return [a,b,m,additionMode, coinFlip(), coinFlip(), coinFlip(),coinFlip()];
}

export function generateQn(
	a: number,
	b: number,
	m: number,
	additionMode: boolean,
	variant: boolean,
	swap1: boolean,
	swap2: boolean,
	swap3: boolean,
	level: number
): { qn: string; answer: Fraction, working: string } {
	let qnString: string, working: string;
	let answer: Fraction;
	if (additionMode){
		if (level===0){
			if (variant){ // x + a = b
				const xPlusA = swap1 ? new Polynomial([1,a]) : new Polynomial([a,1], {ascending:true});
				qnString = `${xPlusA} = ${b}`;
				answer = new Fraction(b-a,1);
				working = `\\begin{align*}
					${xPlusA} &= ${b} \\\\
					x &= ${new WorkingExpression(b,-a)} \\\\
					x &= ${answer} \\\\
				\\end{align*}`
			} else { // (m+1)x = mx + b
				const mxPlusB = swap1 ? new Polynomial([m,b]) : new Polynomial([b,m], {ascending:true});
				qnString = `${new Term(m+1, 'x')} = ${mxPlusB}`;
				answer = new Fraction(b,1);
				working = `\\begin{align*}
					${new Term(m+1, 'x')} &= ${mxPlusB} \\\\
					${new WorkingExpression(new Term(m+1,'x'), new Term(-m, 'x'))} &= ${b} \\\\
					x &= ${answer} \\\\
				\\end{align*}`
			}
		} else { // level 1: (m+1)x + a = mx + b
			const mPlusOneXPlusA = swap1 ? new Polynomial([m+1,a]) : new Polynomial([a,m+1], {ascending:true});
			const mxPlusB = swap2 ? new Polynomial([m,b]) : new Polynomial([b,m], {ascending:true});
			qnString = swap3 ? `${mPlusOneXPlusA} = ${mxPlusB}` : `${mxPlusB} = ${mPlusOneXPlusA}`;
			answer = new Fraction(b-a,1);
			const step1 = swap3 ? `${mPlusOneXPlusA} &= ${mxPlusB}` : `${mxPlusB} &= ${mPlusOneXPlusA}`;
			const step2 = swap3 ? `${new WorkingExpression(new Term(m+1,'x'),new Term(-m,'x'))} &= ${new WorkingExpression(b,-a)}` : `${new WorkingExpression(b,-a)} &= ${new WorkingExpression(new Term(m+1,'x'),new Term(-m,'x'))}`;
			const step3 = swap3 ? `x &= ${answer}` : `${answer} &= x`;
			const step4 = swap3 ? '' : `x &= ${answer}`;
				working = `\\begin{align*}
					${step1} \\\\
					${step2} \\\\
					${step3} \\\\
					${step4} 
				\\end{align*}`
		}
	} else { // multiplication
		if (level===0){
			if (variant){ // ax = am
				qnString = `${new Term(a, 'x')} = ${a*m}`;
				answer = new Fraction(m);
				working = `\\begin{align*}
					${new Term(a, 'x')} &= ${a*m} \\\\
					x &= \\frac{${a*m}}{${a}} \\\\
					x &= ${answer} \\\\
				\\end{align*}`
			} else { // x/|a| = b
				qnString = `\\frac{x}{${Math.abs(a)}} = ${b}`;
				answer = new Fraction(Math.abs(a)*b);
				working = `\\begin{align*}
					\\frac{x}{${Math.abs(a)}} &= ${b} \\\\
					x &= ${b} (${Math.abs(a)}) \\\\
					x &= ${answer} \\\\
				\\end{align*}`
			}
		} else {
			if (variant){ // ax = b
				qnString = swap1 ? `${new Term(a, 'x')} = ${b}` : `${b} = ${new Term(a, 'x')}`;
				answer = new Fraction(b,a);
				const step1 = swap1 ? `${new Term(a, 'x')} &= ${b}` : `${b} &= ${new Term(a, 'x')}`;
				const step2 = swap1 ? `x &= \\frac{${b}}{${a}}` : `\\frac{${b}}{${a}} &= x`;
				const step3 = (swap1 && answer.den === a) ? '' : `x &= ${answer}`;
				working = `\\begin{align*}
					${step1} \\\\
					${step2} \\\\
					${step3} 
				\\end{align*}`
			} else { // b = x/|a|
				qnString = `${b} = \\frac{x}{${Math.abs(a)}}`;
				answer = new Fraction(Math.abs(a)*b);
								working = `\\begin{align*}
					${b} &= \\frac{x}{${Math.abs(a)}} \\\\
					${b} (${Math.abs(a)}) &= x \\\\
					x &= ${answer} \\\\
				\\end{align*}`
			}
		}
	}

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
