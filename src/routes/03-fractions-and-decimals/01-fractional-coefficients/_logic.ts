import { Term, WorkingExpression, Fraction, getRandomInt, getRandomFrac, Polynomial, BracketedTerm } from 'mathlify';
import { display } from '$lib/math';
import { coinFlip } from '$lib/utils/index';

// a, b, c, d, A, C, variant, swap1, swap2, swap3
export function generateNewVariables(level:number): [Fraction, Fraction, Fraction, Fraction, Fraction, Fraction, boolean, boolean, boolean, boolean] {
	const variant = coinFlip();
	const avoid = level===0 ? [0,1] : [0];
	let a = getRandomFrac({avoid});
	let b = getRandomFrac({avoid:[0]});
	let d = getRandomFrac({avoid:[0]});
	let A: Fraction, C: Fraction, c: Fraction;
	if (level===0 || (level===1&&variant)){
		A = Fraction.ONE;
		C = level===0 ? Fraction.ONE : new Fraction(getRandomInt(-5,5, {avoid:[0,1]}));
		c = (level===0 && !variant) ? Fraction.ZERO : getRandomFrac({avoid:[0]});
		if (level!==0){
			[[a,b]] = Fraction.factorize(a,b);
		}
	} else {
		c = getRandomFrac({avoid: [0]});
		[[a,b],A] = Fraction.factorize(a,b);
		[[c,d],C] = Fraction.factorize(c,d);
	}
	while (A.times(a).isEqualTo(C.times(c))){
		c = (level===0 && !variant) ? Fraction.ZERO : getRandomFrac({avoid:[0]});
		d = getRandomFrac({avoid:[0]});
		[[c,d,C]] = Fraction.factorize(c,d);
	}
	return [a,b,c,d,A,C,variant, coinFlip(), coinFlip(), coinFlip()];
}

export function generateQn(
	a: Fraction,
	b: Fraction,
	c: Fraction,
	d: Fraction,
	A: Fraction,
	C: Fraction,
	variant: boolean,
	swap1: boolean,
	swap2: boolean,
	swap3: boolean,
	level: number
): { qn: string; answer: Fraction, working: string } {
	let qnString: string;
	let working = '';
	const answer = C.times(d).minus(A.times(b)).divide(A.times(a).minus(C.times(c)));
	const aXPlusB = new Polynomial([a,b]);
	const cXPlusD = new Polynomial([c,d]);
	aXPlusB.changeAscending(swap2);
	cXPlusD.changeAscending(swap3);
	if (level===0){ // ax + b = cx + d;
		qnString = `${aXPlusB} = ${cXPlusD}`;
		if (!variant){ // ax + b = c
			const finalStep = a.isEqualTo(1) ? '' : `x &= ${d.minus(b)} \\times ${a.reciprocal()} \\\\ x &= ${answer}`
			working = `\\begin{align*}
				${aXPlusB} &= ${cXPlusD} \\\\
				${new Term(a,'x')} &= ${new WorkingExpression(d, b.negative())} \\\\
				${new Term(a,'x')} &= ${d.minus(b)} \\\\
				x &= ${d.minus(b)} \\div ${a} \\\\
				${finalStep}
			\\end{align*}`;
		} else {
			const finalStep = a.minus(c).isEqualTo(1) ? '' : `x &= ${d.minus(b)} \\times ${(a.minus(c)).reciprocal()} \\\\ x &= ${answer}`;
			working = `\\begin{align*}
				${aXPlusB} &= ${cXPlusD} \\\\
				${new WorkingExpression(new Term(a, 'x'), new Term(c.negative(), 'x'))} &= ${new WorkingExpression(d, b.negative())} \\\\
				${new Term(a.minus(c),'x')} &= ${d.minus(b)} \\\\
				x &= ${d.minus(b)} \\div ${a.minus(c)} \\\\
				${finalStep}
			\\end{align*}`;
		}
	} else {
		if (!variant){ // A(ax+b) = C(cx+d);
			const aXPlusBTerm = new BracketedTerm(A, aXPlusB);
			const cXPlusDTerm = new BracketedTerm(C, cXPlusD);
			const minusCXPlusDTerm = new BracketedTerm(C.negative(), cXPlusD);
			const lhs = new WorkingExpression(aXPlusBTerm, minusCXPlusDTerm);
			qnString = swap1 ? `${aXPlusBTerm} = ${cXPlusDTerm}` : `${lhs} = 0`;
			if (swap1){
				working = `\\begin{align*}
					${aXPlusBTerm} &= ${cXPlusDTerm} \\\\
					${aXPlusBTerm.simplify()} &= ${cXPlusDTerm.simplify()} \\\\
				${new WorkingExpression(new Term(A.times(a), 'x'), new Term(C.times(c).negative(), 'x'))} &= ${new WorkingExpression(C.times(d), A.times(b).negative())} \\\\`
			} else {
				working = `\\begin{gather*} ${lhs} = 0 \\\\
					${new WorkingExpression(...aXPlusBTerm.simplify().terms, ...minusCXPlusDTerm.simplify().terms)} = 0 \\\\
				${new Polynomial([A.times(a).minus(C.times(c)), A.times(b).minus(C.times(d))])} = 0 \\\\`
			}
			working += `${new Term(A.times(a).minus(C.times(c)), 'x')} ${swap1 ? '&' : ''}= ${C.times(d).minus(A.times(b))} \\\\`;
			if (!A.times(a).minus(C.times(c)).isEqualTo(1)){
				working += `x ${swap1 ? '&' : ''}= ${C.times(d).minus(A.times(b))} \\div ${A.times(a).minus(C.times(c))} \\\\`;
				working += `x ${swap1 ? '&' : ''}= ${C.times(d).minus(A.times(b))} \\times ${(A.times(a).minus(C.times(c))).reciprocal()} \\\\`;
				working += `x ${swap1 ? '&' : ''}= ${answer}`;
			}
			working += swap1 ? `\\end{align*}` : `\\end{gather*}`;
		} else { // (ax+b)/C = cx+d
			qnString = swap1 ? `\\frac{${aXPlusB}}{${C}} = ${cXPlusD}` : `${cXPlusD} = \\frac{${aXPlusB}}{${C}}`;
			working = `\\begin{align*}`;
			working += swap1 ? `\\frac{${aXPlusB}}{${C}} &= ${cXPlusD} \\\\` : `${cXPlusD} &= \\frac{${aXPlusB}}{${C}} \\\\ \\frac{${aXPlusB}}{${C}} &= ${cXPlusD} \\\\`;
			const bracketedTerm = new BracketedTerm(C, cXPlusD);
			working += `${aXPlusB} &= ${bracketedTerm} \\\\`;
			working += `${aXPlusB} &= ${bracketedTerm.simplify()} \\\\`;
			working += `${new WorkingExpression(new Term(A.times(a), 'x'), new Term(C.times(c).negative(), 'x'))} &= ${new WorkingExpression(C.times(d), A.times(b).negative())} \\\\`
			working += `${new Term(A.times(a).minus(C.times(c)), 'x')} &= ${C.times(d).minus(A.times(b))} \\\\`;
			if (!A.times(a).minus(C.times(c)).isEqualTo(1)){
				working += `x &= ${C.times(d).minus(A.times(b))} \\div ${A.times(a).minus(C.times(c))} \\\\`;
				working += `x &= ${C.times(d).minus(A.times(b))} \\times ${(A.times(a).minus(C.times(c))).reciprocal()} \\\\`;
				working += `x &= ${answer}`;
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
