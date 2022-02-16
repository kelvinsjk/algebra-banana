<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { math, display } from '$lib/math';
	import { slide, fade } from 'svelte/transition';
	import {flip} from 'svelte/animate';
	import { Fraction, getRandomInt, JSONParse, Polynomial, Term, Expression } from 'mathlify';
	import QnTaskbar from '$lib/QnTaskbar/index.svelte';
	import QnReview from '$lib/QnReview/index.svelte';
	import ExpressionInput from '$lib/ExpressionInput/ExpressionInput.svelte';
	import {generateQn, generateNewVariables, assignMarks, Coefficients } from './_logic';

	const title = 'Evaluating Expressions';

	// qn props
	export let termsJSON: string;
	export let coefficientsInt: {
		''?: number;
		x?: number;
		'x^2'?: number;
		xy?: number;
		y?: number;
	};
	export let level: number;

	let coefficients: Coefficients = {};
	let terms = JSONParse(termsJSON) as Term[];
	for (const [key, value] of Object.entries(coefficientsInt)) {
		coefficients[key] = new Fraction(value);
	}

	// qn setup
	let { qn, answer, working } = generateQn(terms,coefficients,level);

	// mode and score setup
	let randomMode = true;
	let score = 0;
	let marks: number;

	// setup for qn state
	let coefficientsAttempt: Coefficients = undefined;
	let termsAttempt: Term[] = undefined;
	let value: string = undefined;
	let invalid: boolean = undefined;
	let simplified: boolean = undefined;
	let submitted = false;
	let disabled = false;

	// setup for choice of level
	const options = [math('\\bigstar'), math('\\bigstar \\bigstar'), math('\\bigstar \\bigstar \\bigstar')];
	let selectedIndex = level;
	$: level = selectedIndex;

	function newQn(): void {
		// generate variables
		if (randomMode) {
			selectedIndex = getRandomInt(0, 2);
			level = selectedIndex;
		}
		[terms, coefficients] = generateNewVariables(level);
		// update qn
		({ qn, answer, working } = generateQn(terms, coefficients, level));
		// reset qn
		[coefficientsAttempt, termsAttempt,value, simplified, marks, invalid, submitted, disabled] = [
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			true,
			false,
			false
		];
	}

	function checkAnswer(): void {
		//submitted = true;
		//disabled = true;
		marks = assignMarks(coefficientsAttempt, termsAttempt, coefficients, terms, level, simplified);
		score += marks;
	}

</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<article class="prose flex-center mb-8">
	<h1 class="mt-8 text-center">{title}</h1>
	<QnTaskbar on:newQn={newQn} {options} bind:randomMode bind:selectedIndex {score} />
	<section
		id="question-container"
		class="question-container flex-center full-bleed px-2"
		class:correct={marks === 2}
		class:partial={marks === 1}
		class:wrong={marks === 0}
	>
		<h2 class="mt-0">Question</h2>
		<div class="flex text-center mb-0 max-w-prose gap-2 flex-wrap justify-center">
			{@html qn}, {@html answer}
		</div>
		<div class="qn max-w-prose flex-center p-4 gap-4">
			<div id="answer-input" class="flex items-center h-16">
				<div>
					{@html math('x = ')}
				</div>
				<ExpressionInput
					bind:coefficients={coefficientsAttempt}
					bind:terms={termsAttempt}
					bind:value
					bind:invalid
					bind:simplified
					{disabled}
					on:enter={() => {
						if (!invalid && !disabled) {
							checkAnswer();
						}
					}}
				/>
				<div id="submit-button" class="flex-center">
					{#if !submitted}
						<button
							class="btn btn-primary"
							disabled={invalid || termsAttempt === undefined || disabled}
							on:click={checkAnswer}
						>
							Submit
						</button>
					{:else}
						<button in:fade|local={{ duration: 1000 }} class="btn btn-primary" on:click={newQn}>
							New Question
						</button>
					{/if}
				</div>
			</div>
		</div>
	</section>
	<QnReview {marks} {submitted} {working} />
</article>

<nav class="flex justify-end">
	<a class="px-4 py-2 bg-green-100 underline" rel="prefetch" href="../02-like-terms/example">
		&raquo; Combining like terms &raquo;
	</a>
</nav>