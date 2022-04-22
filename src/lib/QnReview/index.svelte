<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	export let marks: number;
	export let submitted: boolean;
	export let working: string;
</script>

{#if submitted}
	<section
		aria-labelledby="review"
		id="qn-review-solution"
		class="flex-center"
		transition:slide|local
	>
		<h2 id="review">Review</h2>
		<section id="review-container">
			{#if marks === 2}
				✅ ✅ Correct! Well done!
			{:else if marks === 1}
				✅ ❌ While technically correct, we can simplify our answer further.
			{:else}
				❌ Not quite. Try again!
			{/if}
		</section>

		<section aria-labelledby="solution" id="solution-container" class="text-center">
			<h2 id="solution">Solution</h2>
			<div>
				{@html working}
			</div>
		</section>
	</section>
{/if}
