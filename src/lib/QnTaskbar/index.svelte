<script lang="ts">
	import Options from './Options.svelte';
	import Score from './Score.svelte';

	export let options: string[];
	export let randomMode: boolean;
	export let selectedIndex: number;
	export let score: number;
</script>

<section title="options-and-score" id="overlay" class="flex flex-row justify-center">
	<Options on:newQn {options} bind:randomMode bind:selectedIndex />
	<div class="divider divider-horizontal mx-4" />
	<Score {score} />
</section>
