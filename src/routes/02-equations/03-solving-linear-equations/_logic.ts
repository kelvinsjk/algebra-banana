import { Term, WorkingExpression, Fraction, getRandomInt, Polynomial, BracketedTerm } from 'mathlify';
import { display } from '$lib/math';
import { coinFlip } from '$lib/utils/index';

// a, b, c, d, A, C, variant, swap1, swap2, swap3
export function generateNewVariables(level:number): [number, number, number, number, number, number, boolean, boolean, boolean, boolean] {
	const variant = coinFlip();
	const avoid = level===0 ? [0,1] : [0];
	const a = getRandomInt(-9,9, {avoid});
	const b = getRandomInt(-9,9, {avoid:[0]});
	const d = getRandomInt(-9,9, {avoid:[0]});
	const A = (level===0 || (level===1&&variant)) ? 1 : getRandomInt(-5,5, {avoid:[0,1]});
	let c = (level===0 && !variant) ? 0 : getRandomInt(-9,9, {avoid:[0]});
	let C = (level===0) ? 1 : getRandomInt(-5,5, {avoid:[0,1]});
	while (A*a===C*c){
		c = (level===0 && !variant) ? 0 : getRandomInt(-9,9, {avoid:[0]});
		C = (level===0) ? 1 : getRandomInt(-9,9, {avoid:[0,1]});
	}
	return [a,b,c,d,A,C,variant, coinFlip(), coinFlip(), coinFlip()];
}

export function generateQn(
	a: number,
	b: number,
	c: number,
	d: number,
	A: number,
	C: number,
	variant: boolean,
	swap1: boolean,
	swap2: boolean,
	swap3: boolean,
	level: number
): { qn: string; answer: Fraction, working: string } {
	let qnString: string;
	let working = '';
	const answer = new Fraction(C*d-A*b, A*a-C*c);
	const aXPlusB = new Polynomial([a,b]);
	const cXPlusD = new Polynomial([c,d]);
	aXPlusB.changeAscending(swap2);
	cXPlusD.changeAscending(swap3);
	if (level===0){ // ax + b = cx + d;
		qnString = `${aXPlusB} = ${cXPlusD}`;
		if (!variant){ // ax + b = c
			const finalStep = a === answer.den && answer.num > 0 ? '' : `x &= ${answer}`
			working = `\\begin{align*}
				${aXPlusB} &= ${cXPlusD} \\\\
				${new Term(a,'x')} &= ${new WorkingExpression(d, -b)} \\\\
				${new Term(a,'x')} &= ${d-b} \\\\
				x &= \\frac{${d-b}}{${a}} \\\\
				${finalStep}
			\\end{align*}`;
		} else {
			const finalStep = a-c === answer.den && answer.num > 0 ? '' : `x &= ${answer}`
			working = `\\begin{align*}
				${aXPlusB} &= ${cXPlusD} \\\\
				${new WorkingExpression(new Term(a, 'x'), new Term(-c, 'x'))} &= ${new WorkingExpression(d, -b)} \\\\
				${new Term(a-c,'x')} &= ${d-b} \\\\
				x &= \\frac{${d-b}}{${a-c}} \\\\
				${finalStep}
			\\end{align*}`;
		}
	} else {
		if (!variant){ // A(ax+b) = C(cx+d);
			const aXPlusBTerm = new BracketedTerm(A, aXPlusB);
			const cXPlusDTerm = new BracketedTerm(C, cXPlusD);
			const minusCXPlusDTerm = new BracketedTerm(-C, cXPlusD);
			const lhs = new WorkingExpression(aXPlusBTerm, minusCXPlusDTerm);
			qnString = swap1 ? `${aXPlusBTerm} = ${cXPlusDTerm}` : `${lhs} = 0`;
			if (swap1){
				working = `\\begin{align*}
					${aXPlusBTerm} &= ${cXPlusDTerm} \\\\
					${aXPlusBTerm.simplify()} &= ${cXPlusDTerm.simplify()} \\\\
				${new WorkingExpression(new Term(A*a, 'x'), new Term(-C*c, 'x'))} &= ${new WorkingExpression(C*d, -A*b)} \\\\`
			} else {
				working = `\\begin{gather*} ${lhs} = 0 \\\\
					${new WorkingExpression(...aXPlusBTerm.simplify().terms, ...minusCXPlusDTerm.simplify().terms)} = 0 \\\\
				${new Polynomial([A*a-C*c, A*b-C*d])} = 0 \\\\`
			}
			working += `${new Term(A*a-C*c, 'x')} ${swap1 ? '&' : ''}= ${C*d-A*b} \\\\`;
			if (A*a-C*c !== 1){
				working += `x ${swap1 ? '&' : ''}= \\frac{${C*d-A*b}}{${A*a-C*c}} \\\\`;
				if (!(answer.den === A*a-C*c && answer.num > 0)){
					working += `x ${swap1 ? '&' : ''}= ${answer}`;
				}
			}
			working += swap1 ? `\\end{align*}` : `\\end{gather*}`;
		} else { // (ax+b)/C = cx+d
			qnString = swap1 ? `\\frac{${aXPlusB}}{${C}} = ${cXPlusD}` : `${cXPlusD} = \\frac{${aXPlusB}}{${C}}`;
			working = `\\begin{align*}`;
			working += swap1 ? `\\frac{${aXPlusB}}{${C}} &= ${cXPlusD} \\\\` : `${cXPlusD} &= \\frac{${aXPlusB}}{${C}} \\\\ \\frac{${aXPlusB}}{${C}} &= ${cXPlusD} \\\\`;
			const bracketedTerm = new BracketedTerm(C, cXPlusD);
			working += `${aXPlusB} &= ${bracketedTerm} \\\\`;
			working += `${aXPlusB} &= ${bracketedTerm.simplify()} \\\\`;
			working += `${new WorkingExpression(new Term(A*a, 'x'), new Term(-C*c, 'x'))} &= ${new WorkingExpression(C*d, -A*b)} \\\\`
			working += `${new Term(A*a-C*c, 'x')} &= ${C*d-A*b} \\\\`;
			if (A*a-C*c !== 1){
				working += `x &= \\frac{${C*d-A*b}}{${A*a-C*c}} \\\\`;
				if (!(answer.den === A*a-C*c && answer.num > 0)){
					working += `x &= ${answer}`;
				}
			}
			working += '\\end{align*}'
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
