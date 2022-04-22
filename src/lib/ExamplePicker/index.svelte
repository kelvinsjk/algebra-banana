<script lang="ts">
	export let options: string[];
	export let selectedIndex: number = 0;
</script>

<aside title="example-picker" id="overlay" class="flex flex-row justify-center mt-8">
	<div class="btn-group">
		{#each options as option, i}
			<button
				class="btn"
				class:btn-sm={options.length < 3}
				class:btn-xs={options.length >= 3}
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
</aside>
