<script lang="ts">
	export let options: string[];
	export let selectedIndex: number = 0;
</script>

<section id="overlay" class="flex flex-row justify-center">
	<div class="btn-group">
		{#each options as option, i}
			<button
				class="btn btn-sm"
				class:btn-outline={!(i === selectedIndex)}
				class:btn-primary={i === selectedIndex}
				on:click={async () => {
					if (selectedIndex !== i) {
						selectedIndex = i;
					}
				}}
			>
				{@html option}
			</button>
		{/each}
	</div>
</section>
