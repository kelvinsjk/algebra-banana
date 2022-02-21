import { Term, Expression, WorkingExpression, Fraction, getRandomInt, Polynomial, BracketedTerm } from 'mathlify';
import { math, display } from '$lib/math';
import { coinFlip } from '$lib/utils/index';

// a, b, c, d, e, f, xPos, yPos, axMode
export function generateNewVariables(level: number): [number, number, number, number, number, number, number, number, boolean] {
	const a = getRandomInt(-9,9, {avoid:[0,1]});
	const b = level===0 ?  getRandomInt(-9,9, {avoid:[0,1]}) : getRandomInt(-9,9, {avoid:[0]});
	const c = getRandomInt(-9,9, {avoid:[0]});
	const d = getRandomInt(-9,9, {avoid:[0,1]});
	const e = getRandomInt(-9,9, {avoid:[0]});
	const f = getRandomInt(-9,9, {avoid:[0]});
	const xPos = level === 1 ? getRandomInt(0,2) : getRandomInt(0,1);
	const yPos = getRandomInt(0,2, {avoid:[xPos]});
	const axMode = coinFlip();
	return [a,b,c,d,e,f,xPos,yPos,axMode];
}

export function generateQn(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number,
	xPos: number,
	yPos: number,
	axMode: boolean,
	level: number
): { qn: string; answer: Coefficients; working: string } {
	let qnString: string, working: string;
	const answer: Coefficients = {};
	if (level === 0) { // a(bx) or a(bx+c)
		if (yPos===0){ // a(bx)
			qnString = `${axMode ? new Term(a,'x') : a}(${new Term(b, 'x')})`;
			if (axMode){
				qnString = `${new Term(a,'x')}(${new Term(b,'x')})`
				answer['x^2'] = new Fraction(a*b);
				working = display(`${qnString} = ${new Term(a*b, 'x^2')}`);
			} else {
				qnString = `${a}(${new Term(b,'x')})`
				answer['x'] = new Fraction(a*b);
				working = display(`${qnString} = ${new Term(a*b, 'x')}`);
			}
		} else { // a(bx+c);
			const bxPlusC = new Polynomial([b,c])
			if (xPos===0) {bxPlusC.changeAscending()}
			if (axMode){
				qnString = `${new Term(a,'x')}(${bxPlusC})`
				answer['x^2'] = new Fraction(a*b);
				answer['x'] = new Fraction(a*c);
				working = display(`${qnString} = ${bxPlusC.multiply(new Polynomial([a],{degree:1}))}`);
			} else {
				qnString = `${a}(${bxPlusC})`
				answer['x'] = new Fraction(a*b);
				answer[''] = new Fraction(a*c);
				working = display(`${qnString} = ${bxPlusC.multiply(a)}`);
			}
		}
	} else if (level===1) { // a(bx+cy+d)
		const terms: Term[] = [];
		const answerTerms: Term[] = [];
		if (xPos===0){
			terms.push(new Term(b,'x'));
			answerTerms.push(axMode ? new Term(a*b,'x^2') : new Term(a*b,'x'));
		} else if (yPos===0) {
			terms.push(new Term(c, 'y'));
			answerTerms.push(axMode ? new Term(a*c,'xy') : new Term(a*c,'y'));
		} else {
			terms.push(new Term(d));
			answerTerms.push(axMode ? new Term(a*d,'x') : new Term(a*d,''));
		}
		if (xPos===1){
			terms.push(new Term(b,'x'));
			answerTerms.push(axMode ? new Term(a*b,'x^2') : new Term(a*b,'x'));
		} else if (yPos===1) {
			terms.push(new Term(c, 'y'));
			answerTerms.push(axMode ? new Term(a*c,'xy') : new Term(a*c,'y'));

		} else {
			terms.push(new Term(d));
			answerTerms.push(axMode ? new Term(a*d,'x') : new Term(a*d,''));

		}
		if (xPos===2){
			terms.push(new Term(b,'x'));
			answerTerms.push(axMode ? new Term(a*b,'x^2') : new Term(a*b,'x'));
			
		} else if (yPos===2) {
			terms.push(new Term(c, 'y'));
			answerTerms.push(axMode ? new Term(a*c,'xy') : new Term(a*c,'y'));

		} else {
			terms.push(new Term(d));
			answerTerms.push(axMode ? new Term(a*d,'x') : new Term(a*d,''));
		}
		if (axMode) {
			qnString = `${new Term(a, 'x')}(${new Expression(...terms)})`
			answer['x^2'] = new Fraction(a*b);
			answer['xy'] = new Fraction(a*c);
			answer['x'] = new Fraction(a*d);
		} else {
			qnString = `${a}(${new Expression(...terms)})`
			answer['x'] = new Fraction(a*b);
			answer['y'] = new Fraction(a*c);
			answer[''] = new Fraction(a*d);
		}
		working = display(`\\begin{gather*} ${qnString} \\\\ = ${new Expression(...answerTerms)} \\end{gather*}`)
	} else { // a(bx+c)+d(ex+f)
		const bxPlusC = new Polynomial([b,c]);
		const exPlusF = new Polynomial([e,f]);
		if (xPos===0) {bxPlusC.changeAscending()}
		if (axMode) {exPlusF.changeAscending()}
		const firstTerm = new BracketedTerm(a, bxPlusC);
		const secondTerm = new BracketedTerm(d, exPlusF);
		qnString = `${new WorkingExpression(firstTerm, secondTerm)}`;
		answer['x'] = new Fraction(a*b+d*e);
		answer[''] = new Fraction(a*c+d*f);
		const workingTerms = [...bxPlusC.multiply(a).terms, ...exPlusF.multiply(d).terms];
		working = display(`\\begin{align*}
			&\\phantom{=} ${qnString} \\\\
			&= ${new WorkingExpression(...workingTerms)} \\\\
			&= ${new WorkingExpression(...arrangeTerms(workingTerms))} \\\\
			&= ${bxPlusC.multiply(a).add(exPlusF.multiply(d))}
		\\end{align*}`);
	}
	return {
		qn: math(qnString),
		answer,
		working
	};
}

export function assignMarks(
	coefficientsAttempt: Coefficients,
	termsAttempt: Term[],
	coefficients: Coefficients,
	level: number,
	simplified: boolean
): number {
	let terms: Term[] = [];
	let correct = true;
	for (const [key, value] of Object.entries(coefficients)) {
		terms.push(new Term(value, key));
		if (!(key in coefficientsAttempt) || !coefficientsAttempt[key].isEqualTo(value)) {
			if (!value.isEqualTo(0)) {
				correct = false;
			}
		}
	}
	// simplify if necessary
	terms = new Expression(...terms).terms;
	for (const [key, value] of Object.entries(coefficientsAttempt)) {
		if (!(key in coefficients) || !coefficients[key].isEqualTo(value)) {
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
			return 1;
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
