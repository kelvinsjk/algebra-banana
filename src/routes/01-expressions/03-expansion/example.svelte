<script lang="ts">
	import { math } from '$lib/math';
	import { slide, scale, crossfade } from 'svelte/transition';
	import ExamplePicker from '$lib/ExamplePicker/index.svelte';
	const [send, receive] = crossfade({ duration: 700 });

	let selectedIndex = 0;
	const options = ['Example 1', 'Example 2', 'Example 3'];
	let initialized = false;
	let example1 = true;
	let example2 = false;
	let example3 = false;
	let pending = 0;

	const title = 'Algebraic Expansion';

	let step1Start = false;
	let step1End = false;
	let step2 = false;
	let final = false;
	let buttonText = 'show answer';

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
	}

	function clickButton(): void {
		if (final) {
			resetExample();
			return;
		}
		if (selectedIndex === 0 || selectedIndex === 1) {
			step1Start = !step1Start;
			setTimeout(() => {
				step1End = !step1End;
				setTimeout(() => {
					final = true;
					buttonText = 'reset';
				}, 900);
			}, 900);
		} else {
			step1Start = !step1Start;
			setTimeout(() => {
				step1End = !step1End;
				setTimeout(() => {
					step2 = true;
					setTimeout(() => {
						final = true;
						buttonText = 'reset';
					}, 900);
				}, 900);
			}, 900);
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
			Removing brackets/parentheses is one of the ways to simplify algebraic expressions. If only
			one term is inside the parentheses, we just perform multiplication. For example, {@html math(
				'2(3x)'
			)} simplifies to {@html math('6x')} while {@html math('3x(x)')}
			simplifies to {@html math('3x^2.')}
		</p>
		<p class="text-center max-w-prose">
			If more than one term is inside the parentheses, we distribute the multiplication over the
			terms. This process is called
			<span class="emphasis">expansion</span>. For example,
			{@html math('2(3x+5)')} expands to {@html math('6x+10')} while {@html math('3x(x-5)')} expands
			to {@html math('3x^2-15x.')}
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
				Simplify {@html math('-(3x-5).')}
			</p>
		{/if}
		{#if example2}
			<p class="text-center max-w-prose" transition:scale|local on:outroend={startExample}>
				Simplify {@html math('3x(x-2y-5).')}
			</p>
		{/if}
		{#if example3}
			<p class="text-center max-w-prose" transition:scale|local on:outroend={startExample}>
				Simplify {@html math('2-3(2x-4).')}
			</p>
		{/if}
	</section>
	{#if example3}
		<section
			aria-labelledby="mistake"
			id="mistake-container"
			class="mistake-container flex-center full-bleed px-2"
			transition:slide|local
		>
			<h2 id="mistake" class="mt-0">Common Mistake</h2>
			<p class="text-center max-w-prose">
				One of the most common algebraic mistakes is in handling negative signs. For this example, a
				common
				<span class="emphasis">incorrect answer</span> will be to expand {@html math('2-3(2x-4)')}
				to {@html math('2-6x')}
				<span class="bg-red-500/50 p-1 rounded-full">{@html math('-12')}</span>
				{@html math('=-10-6x.')}
			</p>
		</section>
	{/if}

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
				class="flex text-center max-w-prose mt-4"
				transition:scale|local
				on:outroend={startExample}
			>
				<div class="flex flex-col items-start pl-1">
					<div class="flex">
						<div class="relative">
							{#if !step1Start && !final}
								<div
									class="bg-green-300/50 rounded-full px-1 text-red-600 absolute"
									out:receive={{ key: 1 }}
								>
									{@html math('-')}
								</div>
								<div
									class="bg-green-300/50 rounded-full px-1 text-red-600 absolute"
									out:receive={{ key: 2 }}
								>
									{@html math('-')}
								</div>
							{/if}
							<div
								class="rounded-full px-1"
								class:green-background={!final}
								class:text-red-600={!final}
							>
								{@html math('-')}
							</div>
						</div>
						<div>
							{@html math('(')}
						</div>
						<div class="relative">
							{#if step1Start && !step1End && !final}
								<div
									class="absolute text-center text-red-600 bg-green-300/50 top-0 inset-x-0 mx-auto w-fit px-px rounded-full -translate-y-8 -translate-x-1"
									in:send={{ key: 1 }}
									out:receive={{ key: 1 }}
								>
									{@html math('-1')}
								</div>
							{/if}
							{#if step1End && !final}
								<div
									class="absolute text-center text-red-600 bg-green-300/50 top-0 inset-x-0 mx-auto w-fit px-px rounded-full -translate-x-1"
									in:send={{ key: 1 }}
								>
									{@html math('-1')}
								</div>
							{/if}
							<div>
								{@html math('3x')}
							</div>
						</div>
						<div class="relative pl-2 pr-1">
							{#if step1Start && !step1End && !final}
								<div
									class="absolute text-center text-red-600 bg-green-300/50 top-0 inset-x-0 mx-auto w-fit px-px rounded-full -translate-y-8 translate-x-1"
									in:send={{ key: 2 }}
									out:receive={{ key: 2 }}
								>
									{@html math('-1')}
								</div>
							{/if}
							{#if step1End && !final}
								<div
									class="absolute text-center text-red-600 bg-green-300/50 top-0 inset-x-0 mx-auto w-fit px-px rounded-full translate-x-1"
									in:send={{ key: 2 }}
								>
									{@html math('-1')}
								</div>
							{/if}
							<div>
								{@html math('-')}
								{@html math('5')}
							</div>
						</div>
						<div>
							{@html math(')')}
						</div>
					</div>
					{#if step1End}
						<div class="flex" transition:slide|local>
							<div class="mr-2">
								{@html math('=')}
							</div>
							<div transition:scale|local>
								{@html math('-3x')}
							</div>
							<div class="flex ml-2" transition:scale|local>
								<div>
									{@html math('+')}
								</div>
								<div class="ml-1.5">
									{@html math('5')}
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
			{#if final}
				<p transition:slide|local>
					Answer: {@html math('-3x+5.')}
				</p>
			{/if}
		{/if}
		{#if example2}
			<div
				class="flex text-center max-w-prose mt-4"
				transition:scale|local
				on:outroend={startExample}
			>
				<div class="flex flex-col items-center pl-1 min-11">
					<div class="flex">
						<div class="relative">
							{#if !step1Start && !final}
								<div
									class="bg-green-300/50 rounded-full px-1 text-red-600 absolute"
									out:receive={{ key: 1 }}
								>
									{@html math('3x')}
								</div>
								<div
									class="bg-green-300/50 rounded-full px-1 text-red-600 absolute"
									out:receive={{ key: 2 }}
								>
									{@html math('3x')}
								</div>
								<div
									class="bg-green-300/50 rounded-full px-1 text-red-600 absolute"
									out:receive={{ key: 3 }}
								>
									{@html math('3x')}
								</div>
							{/if}
							<div
								class="rounded-full px-1"
								class:green-background={!final}
								class:text-red-600={!final}
							>
								{@html math('3x')}
							</div>
						</div>
						<div>
							{@html math('(')}
						</div>
						<div class="relative">
							{#if step1Start && !step1End && !final}
								<div
									class="absolute text-center text-red-600 bg-green-300/50 top-0 inset-x-0 mx-auto w-fit px-px rounded-full -translate-y-8 -translate-x-1"
									in:send={{ key: 1 }}
									out:receive={{ key: 1 }}
								>
									{@html math('3x')}
								</div>
							{/if}
							{#if step1End && !final}
								<div
									class="absolute text-center text-red-600 bg-green-300/50 top-0 inset-x-0 mx-auto w-fit px-px rounded-full -translate-x-1"
									in:send={{ key: 1 }}
								>
									{@html math('3x')}
								</div>
							{/if}
							<div>
								{@html math('x')}
							</div>
						</div>
						<div class="relative pl-2 pr-1">
							{#if step1Start && !step1End && !final}
								<div
									class="absolute text-center text-red-600 bg-green-300/50 top-0 inset-x-0 mx-auto w-fit px-px rounded-full -translate-y-8 translate-x-3"
									in:send={{ key: 2 }}
									out:receive={{ key: 2 }}
								>
									{@html math('3x')}
								</div>
							{/if}
							{#if step1End && !final}
								<div
									class="absolute text-center text-red-600 bg-green-300/50 top-0 inset-x-0 mx-auto w-fit px-px rounded-full translate-x-3"
									in:send={{ key: 2 }}
								>
									{@html math('3x')}
								</div>
							{/if}
							<div>
								{@html math('-')}
								{@html math('2y')}
							</div>
						</div>
						<div class="relative pl-2 pr-1">
							{#if step1Start && !step1End && !final}
								<div
									class="absolute text-center text-red-600 bg-green-300/50 top-0 inset-x-0 mx-auto w-fit px-px rounded-full -translate-y-8 translate-x-2"
									in:send={{ key: 3 }}
									out:receive={{ key: 3 }}
								>
									{@html math('3x')}
								</div>
							{/if}
							{#if step1End && !final}
								<div
									class="absolute text-center text-red-600 bg-green-300/50 top-0 inset-x-0 mx-auto w-fit px-px rounded-full translate-x-2"
									in:send={{ key: 3 }}
								>
									{@html math('3x')}
								</div>
							{/if}
							<div>
								{@html math('-')}
								{@html math('5')}
							</div>
						</div>
						<div>
							{@html math(')')}
						</div>
					</div>
					{#if step1End}
						<div class="flex" transition:slide|local>
							<div class="mr-2">
								{@html math('=')}
							</div>
							<div transition:scale|local>
								{@html math('3x^2')}
							</div>
							<div class="flex ml-2" transition:scale|local>
								<div>
									{@html math('-')}
								</div>
								<div class="ml-1.5">
									{@html math('6xy')}
								</div>
							</div>
							<div class="flex ml-2" transition:scale|local>
								<div>
									{@html math('-')}
								</div>
								<div class="ml-1.5">
									{@html math('15x')}
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
			{#if final}
				<p transition:slide|local>
					Answer: {@html math('3x^2-6xy-15x.')}
				</p>
			{/if}
		{/if}
		{#if example3}
			<div
				class="flex text-center max-w-prose mt-4"
				transition:scale|local
				on:outroend={startExample}
			>
				<div class="flex flex-col items-start pl-1 min-9">
					<div class="flex">
						<div>
							{@html math('2')}
						</div>
						<div class="relative">
							{#if !step1Start && !step2}
								<div
									class="bg-green-300/50 rounded-full px-1 text-red-600 absolute"
									out:receive={{ key: 1 }}
								>
									{@html math('-3')}
								</div>
								<div
									class="bg-green-300/50 rounded-full px-1 text-red-600 absolute"
									out:receive={{ key: 2 }}
								>
									{@html math('-3')}
								</div>
							{/if}
							<div
								class="rounded-full px-1"
								class:green-background={!step2}
								class:text-red-600={!step2}
							>
								{@html math('-3')}
							</div>
						</div>
						<div>
							{@html math('(')}
						</div>
						<div class="relative">
							{#if step1Start && !step1End && !step2}
								<div
									class="absolute text-center text-red-600 bg-green-300/50 top-0 inset-x-0 mx-auto w-fit px-px rounded-full -translate-y-8 -translate-x-1"
									in:send={{ key: 1 }}
									out:receive={{ key: 1 }}
								>
									{@html math('-3')}
								</div>
							{/if}
							{#if step1End && !step2}
								<div
									class="absolute text-center text-red-600 bg-green-300/50 top-0 inset-x-0 mx-auto w-fit px-px rounded-full -translate-x-1"
									in:send={{ key: 1 }}
								>
									{@html math('-3')}
								</div>
							{/if}
							<div>
								{@html math('2x')}
							</div>
						</div>
						<div class="relative pl-2 pr-1">
							{#if step1Start && !step1End && !step2}
								<div
									class="absolute text-center text-red-600 bg-green-300/50 top-0 inset-x-0 mx-auto w-fit px-px rounded-full -translate-y-8 translate-x-1"
									in:send={{ key: 2 }}
									out:receive={{ key: 2 }}
								>
									{@html math('-3')}
								</div>
							{/if}
							{#if step1End && !step2}
								<div
									class="absolute text-center text-red-600 bg-green-300/50 top-0 inset-x-0 mx-auto w-fit px-px rounded-full translate-x-1"
									in:send={{ key: 2 }}
								>
									{@html math('-3')}
								</div>
							{/if}
							<div>
								{@html math('-')}
								{@html math('4')}
							</div>
						</div>
						<div>
							{@html math(')')}
						</div>
					</div>
					{#if step1End}
						<div class="flex" transition:slide|local>
							<div class="mr-2">
								{@html math('=')}
							</div>
							<div transition:scale|local>
								{@html math('2')}
							</div>
							<div class="flex ml-2" transition:scale|local>
								<div>
									{@html math('-')}
								</div>
								<div class="ml-1.5">
									{@html math('6x')}
								</div>
							</div>
							<div class="flex ml-2 rounded-full bg-red-500/50 px-1" transition:scale|local>
								<div>
									{@html math('+')}
								</div>
								<div class="ml-1.5">
									{@html math('12')}
								</div>
							</div>
						</div>
					{/if}
					{#if step2}
						<div class="flex" transition:slide|local>
							<div class="mr-2">
								{@html math('=14-6x')}
							</div>
						</div>
					{/if}
				</div>
			</div>
			{#if final}
				<p transition:slide|local>
					Answer: {@html math('14-6x.')}
				</p>
			{/if}
		{/if}
	</section>
	<ExamplePicker {options} bind:selectedIndex />
</article>

<nav class="flex justify-end">
	<a class="px-4 py-2 bg-green-100 underline" rel="prefetch" href="./exercise">
		&raquo; Try out some exercises &raquo;
	</a>
</nav>

<style>
	.green-background {
		background-color: #86efac80;
	}
	.min-11 {
		min-width: 11em;
	}
	.min-9 {
		min-width: 9em;
	}
</style>
