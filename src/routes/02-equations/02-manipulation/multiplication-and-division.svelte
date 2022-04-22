<script lang="ts">
	import { math } from '$lib/math';
	import { slide, scale, crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import ExamplePicker from '$lib/ExamplePicker/index.svelte';
	const [send, receive] = crossfade({ duration: 900 });

	let selectedIndex = 0;
	const options = ['Example 1', 'Example 2'];
	let initialized = false;
	let example1 = true;
	let example2 = false;
	let pending = 0;

	const title = 'Multiplication and Division';
	const nextSectionName = 'Try out some exercises';
	const nextSectionSlug = './exercise';

	let step1 = false;
	let step2 = false;
	let final = false;
	let buttonText = 'show answer';

	let soln1Left = [
		{ content: math('-3'), index: 0 },
		{ content: math('x'), index: 1 }
	];
	let soln1Right = [{ content: math('6'), index: 2 }];
	let soln2Left = [
		{ content: math('x'), index: 10 },
		{ content: '', index: 11 },
		{ content: math('2'), index: 12 }
	];
	let soln2Right = [{ content: math('4'), index: 13 }];

	$: closeExample(selectedIndex);

	function closeExample(i: number): void {
		if (!initialized) {
			initialized = true;
			return;
		}
		example1 = false;
		example2 = false;
		pending = i;
		resetExample();
	}
	function startExample(): void {
		if (pending === 0) {
			example1 = true;
		} else if (pending === 1) {
			example2 = true;
		}
	}

	function resetExample(): void {
		step1 = false;
		step2 = false;
		final = false;
		buttonText = 'show answer';
		soln1Left = [
			{ content: math('-3'), index: 0 },
			{ content: math('x'), index: 1 }
		];
		soln1Right = [{ content: math('6'), index: 2 }];
		soln2Left = [
			{ content: math('x'), index: 10 },
			{ content: '', index: 11 },
			{ content: math('2'), index: 12 }
		];
		soln2Right = [{ content: math('4'), index: 13 }];
	}

	function clickButton(): void {
		if (final) {
			resetExample();
			return;
		}

		soln1Left = [{ content: math('x'), index: 1 }];
		soln1Right = [
			{ content: math('6'), index: 2 },
			{ content: '', index: 3 },
			{ content: math('-3'), index: 0 }
		];
		soln2Left = [{ content: math('x'), index: 10 }];
		soln2Right = [
			{ content: math('4'), index: 13 },
			{ content: math('(2)'), index: 12 }
		];
		step1 = true;
		setTimeout(() => {
			step2 = true;
			setTimeout(() => {
				final = true;
				buttonText = 'reset';
			}, 700);
		}, 700);
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<article class="prose flex-center mb-8">
	<h1 class="mt-8 text-center">{title}</h1>
	<section
		aria-labelledby="theory"
		id="theory-container"
		class="theory-container flex-center full-bleed px-2"
	>
		<h2 id="theory" class="mt-0">Theory</h2>
		<p class="text-center max-w-prose">
			We can also solve equations using the multiplication/division rule. For example, for the
			equation
			{@html math('-3x=6,')} dividing by {@html math('-3')} on both sides give us the solution {@html math(
				'x=-2.'
			)} We can also think of this rule as moving the {@html math('\\times (-3)')} on the left to become
			a {@html math('\\div (-3)')} on the right.
		</p>
		<p class="text-center max-w-prose">
			For {@html math('\\displaystyle \\frac{x}{2}=4,')} multiplying by {@html math('2')} on both sides
			give us the solution {@html math('x=8.')} We can think of this as moving the {@html math(
				'\\div 2'
			)} on the left to become a {@html math('\\times 2')} on the right.
		</p>
	</section>
	<ExamplePicker {options} bind:selectedIndex />
	<section
		aria-labelledby="example"
		id="example-container"
		class="question-container flex-center full-bleed px-2"
	>
		<h2 id="example" class="mt-0">Illustrated Example</h2>
		{#if example1}
			<p class="text-center max-w-prose" transition:scale|local on:outroend={startExample}>
				Solve {@html math('-3x=6.')}
			</p>
		{/if}
		{#if example2}
			<p class="text-center max-w-prose" transition:scale|local on:outroend={startExample}>
				Simplify {@html math('\\displaystyle \\frac{x}{2} = 4.')}
			</p>
		{/if}
	</section>

	<section
		aria-labelledby="solution"
		id="solution-container"
		class="example-container flex-center full-bleed px-2"
	>
		<h2 id="solution" class="mt-0">Solution</h2>
		<button
			transition:scale|local
			class="btn btn-primary btn-sm mb-5 transition-all duration-500 whitespace-nowrap"
			style:width={buttonText === 'show answer' ? '10em' : '5em'}
			on:click={clickButton}>{buttonText}</button
		>
		{#if example1}
			<div
				class="flex text-center max-w-prose mt-4 justify-center"
				transition:scale|local
				on:outroend={startExample}
			>
				<div class="flex flex-col">
					<div>
						{@html math('-3x=6')}
					</div>
					<div class="flex gap-1 justify-center items-center">
						<div class="flex">
							{#each soln1Left as step, i (step.index)}
								<div animate:flip={{ duration: 900 }} class="flex">
									<div class:highlight={step.index === 0} out:send={{ key: step.index }}>
										{@html step.content}
									</div>
								</div>
							{/each}
						</div>
						<div>
							{@html math('=')}
						</div>
						<div class="flex flex-col items-center">
							{#each soln1Right as step, i (step.index)}
								<div
									animate:flip={{ duration: 900 }}
									class="flex"
									class:divider={step.index === 3}
									class:divider-custom={step.index === 3}
								>
									{#if i !== 1}
										<div
											class:highlight={step.index === 0 && !step2}
											in:receive={{ key: step.index }}
										>
											{@html step.content}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
					{#if step2}
						<div transition:slide|local>
							{@html math('x=-2')}
						</div>
					{/if}
					{#if final}
						<p transition:slide|local>
							Answer: {@html math('x=-2.')}
						</p>
					{/if}
				</div>
			</div>
		{/if}
		{#if example2}
			<div
				class="flex text-center max-w-prose mt-4 justify-center"
				transition:scale|local
				on:outroend={startExample}
			>
				<div class="flex flex-col">
					<div>
						{@html math('\\displaystyle \\frac{x}{2} = 4')}
					</div>
					<div class="flex gap-1 justify-center items-center">
						<div class="flex flex-col items-center">
							{#each soln2Left as step, i (step.index)}
								<div
									class:divider={step.index === 11 && !step1}
									class:divider-custom={step.index === 11 && !step1}
									animate:flip={{ duration: 900 }}
									class="flex"
								>
									{#if step.index !== 1}
										<div
											class:highlight={step.index === 12 && !step2}
											out:send={{ key: step.index }}
										>
											{@html step.content}
										</div>
									{/if}
								</div>
							{/each}
						</div>
						<div>
							{@html math('=')}
						</div>
						<div class="flex">
							{#each soln2Right as step, i (step.index)}
								<div animate:flip={{ duration: 900 }} class="flex">
									<div
										class:highlight={step.index === 12 && !step2}
										in:receive={{ key: step.index }}
									>
										{@html step.content}
									</div>
								</div>
							{/each}
						</div>
					</div>
					{#if step2}
						<div transition:slide|local>
							{@html math('x=8')}
						</div>
					{/if}
					{#if final}
						<p transition:slide|local>
							Answer: {@html math('x=8.')}
						</p>
					{/if}
				</div>
			</div>
		{/if}
	</section>
	<ExamplePicker {options} bind:selectedIndex />
</article>

<nav class="flex justify-end">
	<a class="px-4 py-2 bg-green-100 underline" rel="prefetch" href={nextSectionSlug}>
		&raquo; {nextSectionName} &raquo;
	</a>
</nav>

<style>
	.highlight {
		background-color: #86efac80;
		border-radius: 9999px;
		color: #dc2626;
		padding-left: 0.125em;
		padding-right: 0.125em;
		transition-property: all;
		transition-duration: 700ms;
	}
	.divider-custom {
		gap: 0;
		margin-top: -0.25em;
		margin-bottom: -0.25em;
	}
	.divider-custom::after,
	.divider-custom::before {
		background-color: black;
	}
</style>
