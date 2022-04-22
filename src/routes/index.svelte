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

<section class="flex flex-wrap justify-center items-center gap-4 p-4">
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/01-expressions/01-evaluate-expressions/example">Evalutate expressions</a
	>
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/01-expressions/01-evaluate-expressions/exercise">Evalutate expressions exercise</a
	>
	<a class="btn btn-primary" sveltekit:prefetch href="/01-expressions/02-like-terms/example"
		>Like terms</a
	>
	<a class="btn btn-primary" sveltekit:prefetch href="/01-expressions/02-like-terms/exercise"
		>Like terms exercise</a
	>
	<a class="btn btn-primary" sveltekit:prefetch href="/01-expressions/03-expansion/example"
		>Expansion</a
	>
	<a class="btn btn-primary" sveltekit:prefetch href="/01-expressions/03-expansion/exercise"
		>Expansion Exercise</a
	>
	<a class="btn btn-primary" sveltekit:prefetch href="/02-equations/01-introduction"
		>Equations Introduction</a
	>
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/02-equations/02-manipulation/addition-and-subtraction">Addition/Subtraction</a
	>
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/02-equations/02-manipulation/multiplication-and-division">Multiplication/Division</a
	>
	<a class="btn btn-primary" sveltekit:prefetch href="/02-equations/02-manipulation/exercise"
		>Manipulation Exercise</a
	>
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/02-equations/03-solving-linear-equations/example">Linear Equations</a
	>
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/02-equations/03-solving-linear-equations/exercise">Linear Equations Exercise</a
	>
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/03-fractions-and-decimals/01-fractional-coefficients/example">Fractional Coefficients</a
	>
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/03-fractions-and-decimals/01-fractional-coefficients/exercise"
		>Fractional Coefficients Exercise</a
	>
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/03-fractions-and-decimals/01-fractional-coefficients/exercise2"
		>Decimal Coefficients Exercise***</a
	>
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/03-fractions-and-decimals/02-addition-and-subtraction/example">Addition/Subtraction</a
	>
	<a
		class="btn btn-primary"
		sveltekit:prefetch
		href="/03-fractions-and-decimals/02-addition-and-subtraction/exercise"
		>Addition/Subtraction Exercise</a
	>
</section>

<section class="flex flex-col justify-center items-center gap-4 py-4">
	<p>
		{@html math('2x+3,y')} x
	</p>

	<FractionInput />
	<ExpressionInput />
</section>
