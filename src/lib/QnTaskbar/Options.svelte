<script lang="ts">
	export let options: string[];
	export let randomMode: boolean;
	export let selectedIndex: number;

	import { createEventDispatcher, tick } from 'svelte';

	const dispatch = createEventDispatcher();

	function newQn() {
		dispatch('newQn');
	}
</script>

<aside id="options" class="flex-center">
	<button id="new-qn" class="btn btn-primary" on:click={newQn}> New Question </button>
	<div id="option-buttons" class="flex flex-col justify-center mt-4">
		{#if options.length <= 3}
			<div class="btn-group flex-nowrap">
				<button
					class="btn btn-xs"
					class:btn-outline={!randomMode}
					class:btn-primary={randomMode}
					on:click={() => {
						if (!randomMode) {
							randomMode = true;
						}
					}}
				>
					Random
				</button>
				{#each options as option, i}
					<button
						class="btn btn-xs"
						class:btn-outline={!(i === selectedIndex) || randomMode}
						class:btn-primary={i === selectedIndex && !randomMode}
						on:click={async () => {
							if (randomMode) {
								randomMode = false;
							}
							if (selectedIndex !== i) {
								selectedIndex = i;
								await tick();
								newQn();
							}
						}}
					>
						{@html option}
					</button>
				{/each}
			</div>
		{:else}
			<button
				class="btn btn-xs"
				class:btn-outline={!randomMode}
				class:btn-primary={randomMode}
				on:click={() => {
					if (!randomMode) {
						randomMode = true;
					}
				}}
			>
				Random
			</button>
			<div class="btn-group flex-nowrap">
				{#each options as option, i}
					<button
						class="btn btn-xs"
						class:btn-outline={!(i === selectedIndex) || randomMode}
						class:btn-primary={i === selectedIndex && !randomMode}
						on:click={async () => {
							if (randomMode) {
								randomMode = false;
							}
							if (selectedIndex !== i) {
								selectedIndex = i;
								await tick();
								newQn();
							}
						}}
					>
						{@html option}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</aside>
