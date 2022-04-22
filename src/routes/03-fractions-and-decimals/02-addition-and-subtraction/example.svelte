<script lang="ts">
	import { math } from '$lib/math';
	import { slide, scale, crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import ExamplePicker from '$lib/ExamplePicker/index.svelte';
	const [send, receive] = crossfade({ duration: 700 });

	let selectedIndex = 0;
	const options = ['Example 1', 'Example 2'];
	let initialized = false;
	let example1 = true;
	let example2 = false;
	let pending = 0;

	const title = 'Addition and Subtraction of Algebraic Fractions';
	const nextSectionName = 'Try out some exercises';
	const nextSectionSlug = './exercise';

	let step1Start = false;
	let step1End = false;
	let step1 = false;
	let step2 = false;
	let step3 = false;
	let step3A = false;
	let step3B = false;
	let step4 = false;
	let step4A = false;
	let step4B = false;
	let final = false;
	let buttonText = 'show answer';

	const baseSteps = [
		[
			{ content: math('0.2x'), index: 0 },
			{ content: '', index: 1 },
			{ content: math('='), index: 2 },
			{ content: math('0.5'), index: 3 }
		],
		[
			{ content: '', index: 10 },
			{ content: math('x'), index: 11 },
			{ content: math('='), index: 12 },
			{ content: math('0.6'), index: 13 }
		],
		[
			{ content: math('\\displaystyle \\frac{1}{2}(x-1)'), index: 0 },
			{ content: math('='), index: 1 },
			{ content: math('\\displaystyle \\frac{3}{4}\\left(x-\\frac{4}{9}\\right)'), index: 2 }
		],
		[
			{ content: math('\\displaystyle \\frac{1}{2}x'), index: 10 },
			{ content: math('='), index: 11 },
			{ content: math('\\displaystyle -\\frac{1}{3}'), index: 12 }
		],
		[
			{ content: math('x'), index: 20 },
			{ content: math('='), index: 21 },
			{ content: math('\\displaystyle \\frac{1}{6}'), index: 22 }
		]
	];
	let [soln1ASteps, soln1BSteps, soln2ASteps, soln2BSteps, soln2CSteps] = baseSteps;

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
		step1Start = false;
		step1End = false;
		step1 = false;
		step2 = false;
		step3 = false;
		step3A = false;
		step3B = false;
		step4 = false;
		step4A = false;
		step4B = false;
		final = false;
		buttonText = 'show answer';
		[soln1ASteps, soln1BSteps, soln2ASteps, soln2BSteps, soln2CSteps] = baseSteps;
	}

	function clickButton(): void {
		if (final) {
			resetExample();
			return;
		}
		if (example1) {
			step3A = true;
			setTimeout(() => {
				soln1ASteps = [
					{ content: math('0.2x'), index: 0 },
					{ content: math('='), index: 2 },
					{ content: math('0.6'), index: 3 }
				];
				step3B = true;
				setTimeout(() => {
					step4 = true;
					setTimeout(() => {
						step4A = true;
						setTimeout(() => {
							soln1BSteps = [
								{ content: math('x'), index: 11 },
								{ content: math('='), index: 12 },
								{ content: math('3'), index: 13 }
							];
							step4B = true;
							setTimeout(() => {
								final = true;
								buttonText = 'reset';
							}, 700);
						}, 700);
					}, 700);
				}, 700);
			}, 700);
		} else if (example2) {
			soln2ASteps = [
				{ content: math('\\displaystyle \\frac{1}{2}x-\\frac{1}{2}'), index: 0 },
				{ content: math('='), index: 1 },
				{ content: math('\\displaystyle \\frac{3}{4}x-\\frac{1}{3}'), index: 2 }
			];
			setTimeout(() => {
				step3 = true;
				setTimeout(() => {
					step3A = true;
					setTimeout(() => {
						soln2BSteps = [
							{ content: math('\\displaystyle -\\frac{1}{4}x'), index: 10 },
							{ content: math('='), index: 11 },
							{ content: math('\\displaystyle \\frac{1}{6}'), index: 12 }
						];
						step3B = true;
						setTimeout(() => {
							step4 = true;
							setTimeout(() => {
								step4A = true;
								setTimeout(() => {
									soln2CSteps = [
										{ content: math('x'), index: 20 },
										{ content: math('='), index: 21 },
										{ content: math('\\displaystyle -\\frac{2}{3}'), index: 22 }
									];
									step4B = true;
									setTimeout(() => {
										final = true;
										buttonText = 'reset';
									}, 700);
								}, 700);
							}, 700);
						}, 700);
					}, 1400);
				}, 700);
			}, 700);
		}
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
			Addition and subtraction of fractions involve making <span class="emphasis"
				>common denominators</span
			>. For example, {@html math('\\frac{1}{2}+\\frac{1}{3}')} is simplified by making the common denominator
			{@html math('6')} so that {@html math(
				'\\frac{1}{2}+\\frac{1}{3}=\\frac{3}{6}+\\frac{2}{6}=\\frac{5}{6}.'
			)}
		</p>
		<p class="text-center max-w-prose">
			The same can be done for <span class="emphasis">rational expressions</span> which involve
			algebraic terms. For example, to evaluate {@html math(
				'\\displaystyle \\frac{1}{2} - \\frac{x}{x+1}'
			)}, we make the common denominator
			{@html math('2(x+1)')} so that {@html math(
				'\\displaystyle \\frac{1}{2}-\\frac{x}{x+1}=\\frac{x+1}{2(x+1)}-\\frac{2x}{2(x+1)}=\\frac{1-x}{2(x+1)}.'
			)}
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
				Solve {@html math('0.2x-0.1=0.5.')}
			</p>
		{/if}
		{#if example2}
			<p class="text-center max-w-prose" transition:scale|local on:outroend={startExample}>
				Solve {@html math(
					'\\displaystyle \\frac{1}{2}(x-1)=\\frac{3}{4}\\left(x-\\frac{4}{9}\\right).'
				)}
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
						{@html math('0.2x-0.1=0.5')}
					</div>
					<div transition:slide|local class="flex gap-1 justify-center">
						{#each soln1ASteps as step, i (step.index)}
							<div animate:flip={{ duration: 900 }} class="flex">
								<div class:text-red-600={step3B && step.index === 3 && !step4}>
									{@html step.content}
								</div>
								{#if !step3A && step.index === 1}
									<div
										out:send={{ key: 'minusOne' }}
										class="rounded-full px-1 text-red-600 bg-green-300/50"
									>
										{@html math('-0.1')}
									</div>
								{/if}
								{#if step3A && !step3B && step.index === 3}
									<div
										in:receive={{ key: 'minusOne' }}
										class="rounded-full px-1"
										class:green-background={!step3B}
										class:text-red-600={!step3B}
									>
										{@html math('+0.1')}
									</div>
								{/if}
							</div>
						{/each}
					</div>
					{#if step4}
						<div transition:slide|local class="flex gap-1 justify-center">
							{#each soln1BSteps as step, i (step.index)}
								<div animate:flip={{ duration: 900 }} class="flex">
									<div class:text-red-600={step4B && step.index === 13 && !final}>
										{@html step.content}
									</div>
									{#if !step4A && step.index === 10}
										<div
											out:send={{ key: 'two' }}
											class="rounded-full px-1 text-red-600 bg-green-300/50"
										>
											{@html math('0.2')}
										</div>
									{/if}
									{#if step4A && !step4B && step.index === 13}
										<div
											in:receive={{ key: 'two' }}
											class="rounded-full px-1"
											class:green-background={!step4B}
											class:text-red-600={!step4B}
										>
											{@html math('\\div 0.2')}
										</div>
									{/if}
								</div>
							{/each}
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
				class="flex text-center max-w-prose mt-4 justify-center"
				transition:scale|local
				on:outroend={startExample}
			>
				<div class="flex flex-col gap-2">
					<div>
						{@html math(
							'\\displaystyle \\frac{1}{2}(x-1)=\\frac{3}{4}\\left(x-\\frac{4}{9}\\right)'
						)}
					</div>
					<div transition:slide|local class="flex gap-1 justify-center items-center">
						{#each soln2ASteps as step, i (step.index)}
							<div animate:flip={{ duration: 900 }} class="flex">
								<div class:text-red-600={!step3 && step.index !== 1}>
									{@html step.content}
								</div>
							</div>
						{/each}
					</div>
					{#if step3}
						<div transition:slide|local class="flex gap-1 justify-center items-center">
							{#each soln2BSteps as step, i (step.index)}
								<div animate:flip={{ duration: 900 }} class="flex">
									{#if !step3A && step.index === 12}
										<div out:send={{ key: 'fiveX' }} class="rounded-full px-1 text-red-600">
											{@html math('\\displaystyle \\frac{3}{4}x')}
										</div>
									{/if}
									<div
										class:text-red-600={step3A && step.index === 10 && !step4}
										class:green-background={step3A && step.index === 12 && !step4}
										class="rounded-full px-1"
									>
										{@html step.content}
									</div>
									{#if !step3A && step.index === 10}
										<div out:send={{ key: 'minusTwo' }} class="rounded-full px-1 bg-green-300/50">
											{@html math('\\displaystyle -\\frac{1}{2}')}
										</div>
									{/if}
									{#if step3A && !step3B && step.index === 10}
										<div
											in:receive={{ key: 'fiveX' }}
											class="rounded-full px-1"
											class:text-red-600={!step3B}
										>
											{@html math('\\displaystyle -\\frac{3}{4}x')}
										</div>
									{/if}
									{#if step3A && !step3B && step.index === 12}
										<div
											in:receive={{ key: 'minusTwo' }}
											class="rounded-full px-1"
											class:green-background={!step3B}
										>
											{@html math('\\displaystyle +\\frac{1}{2}')}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
					{#if step4}
						<div transition:slide|local class="flex gap-1 justify-center items-center">
							{#each soln2CSteps as step, i (step.index)}
								<div animate:flip={{ duration: 900 }} class="flex">
									{#if !step4A && step.index === 20}
										<div
											out:send={{ key: 'minusThree' }}
											class="rounded-full px-1 text-red-600 bg-green-300/50"
										>
											{@html math('\\displaystyle -\\frac{1}{4}')}
										</div>
									{/if}
									<div class:text-red-600={step4A && step.index === 22 && !final}>
										{@html step.content}
									</div>
									{#if step4A && !step4B && step.index === 22}
										<div
											in:receive={{ key: 'minusThree' }}
											class="rounded-full px-1"
											class:text-red-600={!step4B}
											class:green-background={!step4B}
										>
											{@html math('\\times (-4)')}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
					{#if final}
						<p transition:slide|local>
							Answer: {@html math('\\displaystyle x=-\\frac{2}{3}.')}
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
