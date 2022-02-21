<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { math } from '$lib/math';
	import FractionInput from '$lib/FractionInput/FractionInput.svelte';
	import ExpressionInput from '$lib/ExpressionInput/ExpressionInput.svelte';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section class="flex flex-col justify-center items-center gap-4 py-4">
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/01-expressions/01-evaluate-expressions/example">Evalutate expressions</a
	>
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/01-expressions/01-evaluate-expressions/exercise"
		>Evalutate expressions exercise</a
	>
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/01-expressions/02-like-terms/example">Like terms</a
	>
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/01-expressions/02-like-terms/exercise">Like terms exercise</a
	>
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/01-expressions/03-expansion/example">Expansion</a
	>
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/01-expressions/03-expansion/exercise">Expansion Exercise</a
	>

	<p>
		{@html math('2x+3,y')} x
	</p>

	<FractionInput />
	<ExpressionInput />
</section>
