<script context="module" lang="ts">
	export const prerender = true;

	import { keyboardOptions, keyboardOptionsNoY, expressionLayer } from './keyboardLayout';
	import { isValidExpression,} from './parser';
	import type { Fraction, Term } from 'mathlify';
	import { math } from '$lib/math';

	let mathlive;
	let kbOptions = keyboardOptions;
	let kbOptions1 = keyboardOptionsNoY;
</script>

<script lang="ts">
	import { onMount, tick, createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { slide } from 'svelte/transition';

	// allow y and xy
	export let xOnly = false;

	export let coefficients: {
			''?: Fraction;
			x?: Fraction;
			'x^2'?: Fraction;
			xy?: Fraction;
			y?: Fraction;
		} = undefined;
	export let terms: Term[] = undefined;
	export let value: string = undefined;
	export let simplified: boolean = undefined;
	export let invalid = coefficients === undefined;
	export let name: string = undefined;
	export let correct: boolean = undefined;
	export let disabled = false;
	export let loading = true;

	let nameString = '';

	let mathliveElement;
	let mathliveContainer: HTMLElement;

	onMount(async () => {
		// import mathlive
		if (mathlive === undefined) {
			mathlive = await import('mathlive');
		}
		nameString = name ? math(name) : '';
		// create mathlive element
		mathliveElement = new mathlive.MathfieldElement();
		mathliveElement.value = value === undefined ? '\\bigstar' : value.toString();
		// remove loading spinner and load container into DOM
		loading = false;
		await tick();
		// append mathlife element into DOM
		if (mathliveContainer) {
			mathliveContainer.appendChild(mathliveElement);
		}
		const keyboardOptions = xOnly ? kbOptions1 : kbOptions;
		mathliveElement.setOptions({
			...keyboardOptions,
			onContentDidChange: updateValue,
			onFocus: focusScroll,
			customVirtualKeyboardLayers: expressionLayer,
			inlineShortcuts: null
		});
		mathliveElement.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				dispatch('enter');
			}
		});
	});

	function focusScroll(mathfield) {
		if (mathliveContainer) {
			mathliveContainer.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
			if (mathfield.getValue() === '\\bigstar') {
				mathfield.setValue('');
			}
		}
	}
	function updateValue(mathfield) {
		value = mathfield.getValue();
		const [valid, values] = isValidExpression(value);
		if (valid) {
			({ coefficients, terms, simplified } = values);
			invalid = false;
			if (mathliveContainer) {
				mathliveContainer.classList.remove('invalid');
				mathliveContainer.classList.remove('correct');
				mathliveContainer.classList.remove('wrong');
			}
		} else {
			invalid = true;
			if (mathliveContainer) {
				mathliveContainer.classList.add('invalid');
				mathliveContainer.classList.remove('correct');
				mathliveContainer.classList.remove('wrong');
			}
		}
	}

	$: if (value === undefined && mathliveElement) {
		mathliveElement.setValue('\\bigstar');
	}

	$: if (disabled) {
		if (mathliveElement) {
			mathliveElement.disabled = true;
			mathliveElement.virtualKeyboardMode = 'off';
			mathliveElement.setOptions({
				onFocus: () => {}
			});
		}
	} else {
		if (mathliveElement) {
			mathliveElement.disabled = false;
			mathliveElement.virtualKeyboardMode = 'onfocus';
			mathliveElement.setOptions({
				onFocus: focusScroll
			});
		}
	}
</script>

<div>
	{#if loading}
		<div>loading...</div>
	{:else}
		<div
			class="flex items-center justify-end gap-2 mx-2 transition-all duration-500 border"
			in:slide
		>
			{#if name}
				<span>{@html nameString}</span>
			{/if}
			<div
				class="mathfield-input"
				class:invalid
				class:correct={correct !== undefined && correct}
				class:wrong={correct !== undefined && !correct}
				class:disabled
				bind:this={mathliveContainer}
			/>
		</div>
	{/if}
</div>

<style>
	.mathfield-input {
		height: 3.5em;
		padding: 0.5em 1em;
		border: 1px solid black;
		box-sizing: border-box;
		display: flex;
		flex-basis: 100%;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		color: midnightblue;
		border: 3px solid midnightblue;
	}
	.disabled {
		border: none;
	}
	.invalid.mathfield-input {
		border: 3px solid #f97316;
		background: #f9731630;
	}
	.wrong.mathfield-input {
		border: 5px solid rgb(255, 0, 0);
		background: rgba(255, 0, 0, 0.2);
	}
	.correct.mathfield-input {
		border: 5px solid rgb(0, 100, 0);
		background: rgba(0, 100, 0, 0.2);
		color: black;
	}
	:global(.ML__keyboard) {
		/* background-color: black !important; */
		--keycap-font-size: 3em !important;
	}
	:global(.ML__keyboard--plate) {
		background-color: black !important;
	}
	:global(.keycap) {
		background-color: white !important;
	}
	:global(.action) {
		background-color: #ddd !important;
	}
</style>
