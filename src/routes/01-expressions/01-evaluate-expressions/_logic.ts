import { Term, Expression, WorkingExpression, BracketedTerm, Fraction } from 'mathlify';
import { math, display } from '$lib/math';

export function generateQn(
	a: number,
	b: number,
	x: number,
	y: number,
	level: number
): { qn: string; answer: Fraction; working: string; xSub: string; ySub: string } {
	let qnString: string, answer: Fraction, working: string;
	if (level === 0) {
		// ax = by
		const aX = new Term(a, 'x');
		const bY = new Term(b, 'y');
		const aXPlusBY = new Expression(aX, bY);
		qnString = `${aXPlusBY}`;
		// answer
		answer = new Fraction(a * x + b * y);
		// working
		const workingExp1 = new WorkingExpression(new Term(a, `(${x})`), new Term(b, `(${y})`));
		const workingExp2 = new WorkingExpression(a * x, b * y);
		working = display(`\\begin{align*}
			${qnString} &= ${workingExp1} \\\\
			&= ${workingExp2} \\\\
			&= ${answer} \\\\
		\\end{align*}`);
	} else if (level === 1 || level === 2) {
		// level 1: axy
		// level 2: a(xy) | x(ay). former if b>0
		const aXY =
			level === 1
				? new Term(a, 'xy')
				: b > 0
				? new BracketedTerm(a, 'xy')
				: new Term(1, `x (${new Term(a, 'y')})`);
		qnString = `${aXY}`;
		// answer
		answer = new Fraction(a * x * y);
		// working
		const workingStep1 = level === 2 && b < 0 ? `${x} (${a}) (${y})` : `${a} (${x}) (${y})`;
		working = display(`\\begin{align*}
			${qnString} &= ${workingStep1}\\\\
			&= ${a * x} (${y}) \\\\
			&= ${answer} \\\\
		\\end{align*}`);
	} else if (level === 3) {
		// a(x+by)
		const xPlusBY = new Expression('x', new Term(b, 'y'));
		const aXPlusBY = new BracketedTerm(a, xPlusBY);
		qnString = `${aXPlusBY}`;
		// answer
		answer = new Fraction(a * (x + b * y));
		// working
		const workingExp1a = new WorkingExpression(x, new Term(b, `(${y})`));
		const workingExp1 = new BracketedTerm(a, workingExp1a);
		const workingExp2a = new WorkingExpression(x, b * y);
		const workingExp2 = new BracketedTerm(a, workingExp2a);
		working = display(`\\begin{align*}
			${qnString} &= ${workingExp1} \\\\
			&= ${workingExp2} \\\\
			&= ${workingExp2.simplifyInnerExpression()} \\\\
			&= ${answer} \\\\
		\\end{align*}`);
	} else if (level === 4) {
		const num = b > 0 ? a : new Term(a, 'x');
		const den = b > 0 ? 'xy' : 'y';
		qnString = `\\frac{${num}}{${den}}`;
		// answer
		answer = b > 0 ? new Fraction(a, x * y) : new Fraction(a * x, y);
		// working
		const numWorking = b > 0 ? a : `${a} (${x})`;
		const denWorking = b > 0 ? `${x} (${y})` : `${y}`;
		const numWorking1 = b > 0 ? a : a * x;
		const denWorking1 = b > 0 ? x * y : y;
		const step3 = answer.den === denWorking1 ? '' : `&= ${answer}`;
		working = display(`\\begin{align*}
			${qnString} &= \\frac{${numWorking}}{${denWorking}} \\\\
			&= \\frac{${numWorking1}}{${denWorking1}} \\\\
			${step3}
		\\end{align*}`);
	} else if (level === 5 || level === 6) {
		const sign = b > 0 ? '+' : '-';
		qnString = level === 5 ? `x^2 ${sign} y^2` : `(x ${sign} y)^2`;
		// answer
		if (level === 5) {
			answer = b > 0 ? new Fraction(x * x + y * y) : new Fraction(x * x - y * y);
			// working
			working = display(`\\begin{align*}
				${qnString} &= (${x})^2 ${sign} (${y})^2 \\\\
				&= ${x * x} ${sign} ${y * y} \\\\
				&= ${answer} \\\\
			\\end{align*}`);
		} else {
			const xPlusY = b > 0 ? x + y : x - y;
			answer = new Fraction(xPlusY * xPlusY);
			// working
			const xPlusYWorking = b > 0 ? new WorkingExpression(x, y) : new WorkingExpression(x, -y);
			working = display(`\\begin{align*}
				${qnString} &= (${xPlusYWorking})^2 \\\\
				&= (${xPlusYWorking.simplify()})^2 \\\\
				&= ${answer} \\\\
			\\end{align*}`);
		}
	} else {
		throw new Error(`${level} not from 0-6`);
	}
	const qn = math(`\\displaystyle ${qnString}`);
	return { qn, answer, working, xSub: math(`x=${x}`), ySub: math(`y=${y}.`) };
}
