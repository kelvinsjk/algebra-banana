<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { math, display } from '$lib/math';
	import { slide, fade } from 'svelte/transition';
	import {flip} from 'svelte/animate';
	import FractionInput from '$lib/FractionInput/FractionInput.svelte';
	import { Fraction, getRandomInt, Polynomial, Term, Expression } from 'mathlify';
	import QnTaskbar from '$lib/QnTaskbar/index.svelte';
	import QnReview from '$lib/QnReview/index.svelte';
	import {generateQn} from './_logic';

	const title = 'Evaluating Expressions';

	// qn props
	export let a: number;
	export let b: number;
	export let x: number;
	export let y: number;
	export let level: number;

	// qn setup
	let { qn, answer, working, xSub, ySub } = generateQn(a,b,x,y,level);

	const qnParts = [
		{content: 'Evaluate',
	classes: ''},
		{content: '',
		classes: ''},
		{content: 'when',
		classes: ''},
		{content: '',
		classes: ''},
		{content: 'and',
		classes: ''},
		{content: '',
		classes: ''},
	]

	// mode and score setup
	let randomMode = true;
	let score = 0;
	let marks: number;

	// setup for qn state
	let attempt: Fraction = undefined;
	let invalid: boolean = undefined;
	let simplified: boolean = undefined;
	let submitted = false;
	let disabled = false;

	// setup for choice of level
	const options = ['a', 'b','c','d','e','f','g'];
	let selectedIndex = level;
	$: level = selectedIndex;

	function generateNewVariables(
		level: number
	): [number, number, number, number] {
			const avoid = level === 4 ? [0] : [];
      a = getRandomInt(-9, 9, {avoid: [0]});
      b = getRandomInt(-9, 9, {avoid: [0]});
      x = getRandomInt(-9, 9, {avoid});
      y = getRandomInt(-9, 9, {avoid});
		return [a, b, x, y];
	}

	function newQn(): void {
		// generate variables
		if (randomMode) {
			selectedIndex = getRandomInt(0, 6);
			level = selectedIndex;
		}
		const variables = generateNewVariables(level);
		// update qn
		({ qn, answer, working, xSub, ySub } = generateQn(...variables, level));
		// reset qn
		[attempt, simplified, marks, invalid, submitted, disabled] = [
			undefined,
			undefined,
			undefined,
			true,
			false,
			false
		];
	}

	function checkAnswer(): void {
		submitted = true;
		disabled = true;
		if (attempt.isEqualTo(answer)) {
			marks = simplified ? 2 : 1;
			score += marks;
		} else {
			marks = 0;
		}
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
			{#each qnParts as qnPart,i (i)}
			<div animate:flip={{duration: 400}} class={qnPart.classes}>
				{qnPart.content}
				{#if i===1}
					<div>
						{@html qn}
					</div>
				{:else if i===3}
					<div>
						{@html xSub}
					</div>
				{:else if i===5}
					<div>
						{@html ySub}
					</div>
				{/if}
			</div>
			{/each}
		</div>
		<div class="qn max-w-prose flex-center p-4 gap-4">
			<div id="answer-input" class="flex items-center h-16">
				<div>
					{@html math('x = ')}
				</div>
				<FractionInput
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

<nav class="flex justify-end">
	<a class="px-4 py-2 bg-green-100 underline" rel="prefetch" href="../02-like-terms/example">
		&raquo; Combining like terms &raquo;
	</a>
</nav>