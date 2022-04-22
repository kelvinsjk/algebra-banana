<script lang="ts">
	import { math } from '$lib/math';
	import { slide, scale, crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import ExamplePicker from '$lib/ExamplePicker/index.svelte';
	const [send, receive] = crossfade({ duration: 700 });

	let selectedIndex = 0;
	const options = ['Example 1', 'Example 2', 'Example 3'];
	let initialized = false;
	let example1 = true;
	let example2 = false;
	let example3 = false;
	let pending = 0;

	const title = 'Addition and Subtraction';
	const nextSectionName = 'Multiplication and Division';
	const nextSectionSlug = './multiplication-and-division';

	let step1Start = false;
	let step1End = false;
	let step2 = false;
	let final = false;
	let buttonText = 'show answer';

	let soln1Steps = [
		{ content: math('x'), index: 0 },
		{ content: math('=2'), index: 2 }
	];
	let soln2Steps = [
		{ content: math('x'), index: 0 },
		{ content: math('=6'), index: 2 }
	];
	let soln3Steps = [
		{ content: math('2x'), index: 0 },
		{ content: math('='), index: 1 },
		{ content: math(''), index: 2 },
		{ content: math('1'), index: 3 }
	];

	$: closeExample(selectedIndex);

	function closeExample(i: number): void {
		if (!initialized) {
			initialized = true;
			return;
		}
		example1 = false;
		example2 = false;
		example3 = false;
		pending = i;
		resetExample();
	}
	function startExample(): void {
		if (pending === 0) {
			example1 = true;
		} else if (pending === 1) {
			example2 = true;
		} else if (pending === 2) {
			example3 = true;
		}
	}

	function resetExample(): void {
		step1Start = false;
		step1End = false;
		step2 = false;
		final = false;
		buttonText = 'show answer';
		soln1Steps = [
			{ content: math('x'), index: 0 },
			{ content: math('=2'), index: 2 }
		];
		soln2Steps = [
			{ content: math('x'), index: 0 },
			{ content: math('=6'), index: 2 }
		];
		soln3Steps = [
			{ content: math('2x'), index: 0 },
			{ content: math('='), index: 1 },
			{ content: math(''), index: 2 },
			{ content: math('1'), index: 3 }
		];
	}

	function clickButton(): void {
		if (final) {
			resetExample();
			return;
		}
		step1Start = !step1Start;
		setTimeout(() => {
			step1End = !step1End;
			setTimeout(() => {
				step2 = true;
				setTimeout(() => {
					final = true;
					buttonText = 'reset';
				}, 700);
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
			<span class="emphasis">Solving</span> an algebraic equation means finding out what the unknown
			variable (typically {@html math('x')}) is.
		</p>
		<p class="text-center max-w-prose">
			We can do that by using the addition/subtraction rule. For example, for the equation
			{@html math('x-1=2,')} adding {@html math('1')} to both sides give us the
			<span class="emphasis">solution</span>
			{@html math('x=3.')} We can also think of this rule as moving the {@html math('-1')} on the left
			to become a {@html math('+1')} on the right.
		</p>
		<p class="text-center max-w-prose">
			For {@html math('x+2=6,')} subtracting {@html math('2')} on both sides give us the solution {@html math(
				'x=4.'
			)} We can think of this as moving the {@html math('+2')} on the left to become a {@html math(
				'-2'
			)} on the right.
		</p>
		<p class="text-center max-w-prose">
			These rules also apply for terms involving variables. For the example {@html math('2x=x+1,')} subtracting
			{@html math('x')} on both sides give us the solution {@html math('x=1.')} We can think of this
			as moving the {@html math('x')} on the right to become a {@html math('-x')} on the left.
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
				Solve {@html math('x-1=2.')}
			</p>
		{/if}
		{#if example2}
			<p class="text-center max-w-prose" transition:scale|local on:outroend={startExample}>
				Simplify {@html math('x+2=6.')}
			</p>
		{/if}
		{#if example3}
			<p class="text-center max-w-prose" transition:scale|local on:outroend={startExample}>
				Simplify {@html math('2x=x+1.')}
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
						{@html math('x-1=2')}
					</div>
					<div class="flex gap-1 justify-center">
						{#each soln1Steps as step, i (step.index)}
							<div animate:flip={{ duration: 900 }} class="flex">
								<div>
									{@html step.content}
								</div>
								{#if i === 0}
									{#if !step1Start}
										<div
											out:receive={{ key: 1 }}
											class="rounded-full px-1 text-red-600 bg-green-300/50"
										>
											{@html math('- 1')}
										</div>
									{/if}
								{:else if i === 1}
									{#if step1Start}
										<div
											in:send={{ key: 1 }}
											class="rounded-full px-1"
											class:text-red-600={!step2}
											class:green-background={!step2}
										>
											{@html math('+ 1')}
										</div>
									{/if}
								{/if}
							</div>
						{/each}
					</div>
					{#if step2}
						<div transition:slide|local>
							{@html math('x=3')}
						</div>
					{/if}
					{#if final}
						<p transition:slide|local>
							Answer: {@html math('x=3.')}
						</p>
					{/if}
				</div>
			</div>
		{/if}
		{#if example2}
			<div
				class="flex text-center max-w-prose mt-4"
				transition:scale|local
				on:outroend={startExample}
			>
				<div class="flex flex-col">
					<div>
						{@html math('x+2=6')}
					</div>
					<div class="flex gap-1 justify-center">
						{#each soln2Steps as step, i (step.index)}
							<div animate:flip={{ duration: 900 }} class="flex">
								<div>
									{@html step.content}
								</div>
								{#if i === 0}
									{#if !step1Start}
										<div
											out:receive={{ key: 1 }}
											class="rounded-full px-1 text-red-600 bg-green-300/50"
										>
											{@html math('+ 2')}
										</div>
									{/if}
								{:else if i === 1}
									{#if step1Start}
										<div
											in:send={{ key: 1 }}
											class="rounded-full px-1"
											class:text-red-600={!step2}
											class:green-background={!step2}
										>
											{@html math('- 2')}
										</div>
									{/if}
								{/if}
							</div>
						{/each}
					</div>
					{#if step2}
						<div transition:slide|local>
							{@html math('x=4')}
						</div>
					{/if}
					{#if final}
						<p transition:slide|local>
							Answer: {@html math('x=4.')}
						</p>
					{/if}
				</div>
			</div>
		{/if}
		{#if example3}
			<div
				class="flex text-center max-w-prose mt-4"
				transition:scale|local
				on:outroend={startExample}
			>
				<div class="flex flex-col">
					<div>
						{@html math('2x=x+1')}
					</div>
					<div class="flex gap-1 justify-center">
						{#each soln3Steps as step, i (step.index)}
							<div animate:flip={{ duration: 900 }} class="flex">
								{#if i === 3}
									{#if !step1End}
										<div>
											{@html math('+')}
										</div>
									{/if}
								{/if}
								<div>
									{@html step.content}
								</div>
								{#if i === 0}
									{#if step1Start}
										<div
											in:send={{ key: 1 }}
											class="rounded-full px-1"
											class:text-red-600={!step2}
											class:green-background={!step2}
										>
											{@html math('- x')}
										</div>
									{/if}
								{:else if i === 2}
									{#if !step1Start}
										<div
											out:receive={{ key: 1 }}
											class="rounded-full px-1 text-red-600 bg-green-300/50"
										>
											{@html math('x')}
										</div>
									{/if}
								{/if}
							</div>
						{/each}
					</div>
					{#if step2}
						<div transition:slide|local>
							{@html math('x=1')}
						</div>
					{/if}
					{#if final}
						<p transition:slide|local>
							Answer: {@html math('x=1.')}
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
	.green-background {
		background-color: #86efac80;
	}
</style>
