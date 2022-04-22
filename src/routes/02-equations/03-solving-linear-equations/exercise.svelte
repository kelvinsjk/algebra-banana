<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { math } from '$lib/math';
	import { slide, fade } from 'svelte/transition';
	import { Fraction, getRandomInt, JSONParse, Term } from 'mathlify';
	import QnTaskbar from '$lib/QnTaskbar/index.svelte';
	import QnReview from '$lib/QnReview/index.svelte';
	import FractionInput from '$lib/FractionInput/FractionInput.svelte';
	import { generateQn, assignMarks, generateNewVariables } from './_logic';

	const title = 'Solving Linear Equations';
	const nextSectionName = 'Fractions and Decimals';
	const nextSectionSlug = '/03-fractions-and-decimals/01-fractional-coefficients/example';

	// qn props
	export let variables: [
		number,
		number,
		number,
		number,
		number,
		number,
		boolean,
		boolean,
		boolean,
		boolean
	];
	export let level: number;

	// qn setup
	let { qn, answer, working } = generateQn(...variables, level);

	// mode and score setup
	let randomMode = true;
	let score = 0;
	let marks: number = undefined;

	// setup for qn state
	let attempt: Fraction = undefined;
	let invalid: boolean = undefined;
	let simplified: boolean = undefined;
	let submitted = false;
	let disabled = false;

	// setup for choice of level
	const options = ['&#9733;', '&#9733;&#9733;'];
	let selectedIndex = level;
	$: level = selectedIndex;

	function newQn(): void {
		// generate variables
		if (randomMode) {
			selectedIndex = getRandomInt(0, 1);
			level = selectedIndex;
		}
		// update qn
		({ qn, answer, working } = generateQn(...generateNewVariables(level), level));
		// reset qn
		[attempt, invalid, simplified, submitted, disabled, marks] = [
			undefined,
			true,
			undefined,
			false,
			false,
			undefined
		];
	}

	function checkAnswer(): void {
		marks = assignMarks(attempt, answer, simplified);
		score += marks;
		submitted = true;
		disabled = true;
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
		<p class="text-center max-w-prose">Solve the following equation:</p>
		<div class="flex flex-col text-center mb-0 max-w-prose custom-height">
			{#key qn}
				<div transition:slide|local>
					{@html qn}
				</div>
			{/key}
		</div>
		<div class="qn max-w-prose flex-center p-4 gap-4">
			<div id="answer-input" class="flex items-center h-16">
				<FractionInput
					name={'x='}
					bind:value={attempt}
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
							disabled={invalid || attempt === undefined || disabled}
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

<nav class="flex flex-initial items-end justify-end">
	<div class="px-4 py-2 bg-green-100">
		<a class="underline" rel="prefetch" href={nextSectionSlug}>
			&raquo; {nextSectionName} &raquo;
		</a>
	</div>
</nav>

<style>
	.custom-height {
		height: 8.3em;
		margin-bottom: -4.15em;
	}
</style>
