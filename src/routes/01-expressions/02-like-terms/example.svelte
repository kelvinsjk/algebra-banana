<script lang="ts">
	import { math } from '$lib/math';
	import { slide, scale } from 'svelte/transition';
	import ExamplePicker from '$lib/ExamplePicker/index.svelte';
	import { scaleX } from '$lib/transition/scaleX';

	let selectedIndex = 0;
	const options = ['Example 1', 'Example 2'];
	let example1 = true;
	let example2 = false;

	const title = 'Combining Like Terms';

	let step1 = false;
	let step2 = false;
	let phase1 = false;
	let phase2 = false;
	let phase3 = false;
	let final = false;
	let buttonText = 'show answer';

	$: updateSelection(selectedIndex);

	function updateSelection(i: number): void {
		if (i === 1) {
			example1 = false;
		} else {
			example2 = false;
		}
	}

	const solnItems2 = [
		{
			content: ''
		},
		{ content: math('+2x'), classes: '' }
	];

	async function clickButton() {
		if (!step1) {
			step1 = true;
		} else {
			buttonText = 'show answer';
			step1 = false;
			step2 = false;
			phase1 = false;
			phase2 = false;
			phase3 = false;
			final = false;
		}
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<article class="prose flex-center mb-8">
	<h1 class="mt-8 text-center">{title}</h1>
	<section id="theory-container" class="theory-container flex-center full-bleed px-2">
		<h2 class="mt-0">Theory</h2>
		<p class="text-center max-w-prose">
			<span class="emphais">Algebraic expression</span> can be broken up into
			<span class="emphasis">terms</span>
			separated by
			{@html math('+')} or {@html math('-.')} For example, there are two terms, {@html math('3x')} and
			{@html math('-1,')} in the expression
			{@html math('3x-1')} and five terms in the expression {@html math('-3x^2 + 2x - 5 + 4x - y.')}
		</p>
		<p class="text-center max-w-prose">
			A term with only a number and no variables is called a <span class="emphasis"
				>constant term</span
			>. For example, {@html math('-1')} is the constant term in the expression {@html math(
				'3x-1.'
			)}
		</p>
		<p class="text-center max-w-prose">
			Non-constant terms can be further broken down: the number in each term is called its <span
				class="emphasis">coefficient</span
			>. For example, the term {@html math('2x')} has a coefficient of {@html math('2')} and the coefficient
			of the term {@html math('-y')} is {@html math('-1.')}
			For the expression {@html math('-3x^2 + 2x - 5 + 4x - y')}, we say that the coefficient of the {@html math(
				'x^2'
			)}
			term is {@html math('-3.')}
		</p>
		<p class="text-center max-w-prose">
			<span class="emphasis">Like terms</span> are terms with the exact same combination of
			variables. For example, {@html math('3x')} and {@html math('4x')}
			are like terms. Meanwhile, {@html math('3x^2')} and {@html math('4x')} are unlike terms, as are
			{@html math('3x')} and {@html math('4y.')}
		</p>
		<p class="text-center max-w-prose">
			We can <span class="emphasis">simplify</span> expressions by
			<span class="emphasis">combining like terms</span>. For example, {@html math('5x + 3x')} can be
			simplified to {@html math('8x')} and {@html math('3x^2 - 2x^2')} can be simplified to {@html math(
				'x^2.'
			)}
			Unlike terms cannot be combined. For example, {@html math('3x-1')} cannot be further simplified.
		</p>
	</section>
	<ExamplePicker {options} bind:selectedIndex />
	<section id="example-container" class="question-container flex-center full-bleed px-2">
		<h2 class="mt-0">Illustrated Example</h2>
		{#if example1}
			<p
				class="text-center max-w-prose"
				transition:scale|local
				on:outroend={() => {
					example2 = true;
				}}
			>
				Simplify {@html math('2x+3x.')}
			</p>
		{/if}
		{#if example2}
			<p
				class="text-center max-w-prose"
				transition:scale|local
				on:outroend={() => {
					example1 = true;
				}}
			>
				Simplify {@html math('6x^2+2x-x^2.')}
			</p>
		{/if}
	</section>

	<section id="solution-container" class="example-container flex-center full-bleed px-2">
		<h2 class="mt-0">Solution</h2>
		{#if example1}
			<p transition:scale|local class="text-center max-w-prose">
				Since
				<span class="text-red-600">{@html math('2')}</span><span class="text-green-700"
					>{@html math('x')}</span
				>
				and
				<span class="text-red-600">{@html math('3')}</span><span class="text-green-700"
					>{@html math('x')}</span
				>
				are <span class="emphasis">like terms</span> in
				<span class="text-green-700">{@html math('x,')}</span> we add the
				<span class="emphasis">coefficients</span>,
				<span class="text-red-600">{@html math('2+3,')}</span>
				to simplify the expression.
			</p>
		{/if}
		{#if example2}
			<p transition:scale|local class="text-center max-w-prose">
				Since
				<span class="text-red-600">{@html math('6')}</span><span class="text-green-700"
					>{@html math('x^2')}</span
				>
				and
				<span class="text-red-600">{@html math('-')}</span><span class="text-green-700"
					>{@html math('x^2')}</span
				>
				are <span class="emphasis">like terms</span> in
				<span class="text-green-700">{@html math('x^2,')}</span> we will combine them and leave the
				unlike term {@html math('2x')} alone.
			</p>
		{/if}
		{#if example1}
			<div class="flex text-center max-w-prose">
				<div transition:scale|local class="flex items-center overflow-clip gap-0.5">
					<span class="text-red-600">
						{@html math('3')}
					</span>
					<span class="text-green-700">
						{@html math('x')}
					</span>
					<span>
						{@html math('+')}
					</span>
					<span class="text-red-600">
						{@html math('2')}
					</span>
					<span class="text-green-700">
						{@html math('x')}
					</span>
					<span>
						{@html math('=')}
					</span>
					<span class="text-red-600">
						{@html math('5')}
					</span>
					<span class="text-green-700">
						{@html math('x')}
					</span>
				</div>
			</div>
		{/if}
		{#if example2}
			<button
				transition:scale|local
				class="btn btn-primary btn-sm mb-5 transition-all duration-500 whitespace-nowrap"
				style:width={buttonText === 'show answer' ? '10em' : '5em'}
				on:click={clickButton}>{buttonText}</button
			>
			<div class="flex-center">
				<div transition:slide|local>
					{@html math('6x^2+2x-x^2')}
				</div>
				{#if step1}
					<div
						transition:slide|local
						class="flex gap-1"
						on:introend={() => {
							phase1 = true;
							setTimeout(() => {
								step2 = true;
							}, 700);
						}}
					>
						<div class="mx-1">
							{@html math('=')}
						</div>
						<div>
							{@html math('6x^2')}
						</div>
						<div
							class="transition duration-700"
							style:transform={phase1 ? 'translateX(2.4em)' : ''}
							class:text-red-600={!step2}
						>
							{@html math('+2x')}
						</div>
						<div
							class="transition duration-700"
							style:transform={phase1 ? 'translateX(-2.4em)' : ''}
							class:text-green-700={!step2}
						>
							{@html math('-x^2')}
						</div>
					</div>
				{/if}
				{#if step2}
					<div
						transition:slide|local
						class="flex gap-1"
						on:introend={() => {
							phase2 = true;
						}}
					>
						<div class="mx-1">
							{@html math('=')}
						</div>
						{#each solnItems2 as item, i (i)}
							<div>
								{@html item.content}
								{#if i === 0}
									{#if !phase2}
										<div
											out:scaleX|local
											class="text-red-600 overflow-clip flex justify-center"
											on:outroend={() => {
												phase3 = true;
											}}
										>
											{@html math('6x^2-x^2')}
										</div>
									{/if}
									{#if phase3}
										<div
											in:scaleX|local
											class="text-red-600 overflow-clip flex justify-center"
											class:text-red-600={!final}
											on:introend={() => {
												final = true;
												buttonText = 'reset';
											}}
										>
											{@html math('5x^2')}
										</div>
									{/if}
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
		{#if example1}
			<p transition:slide|local>
				Answer: {@html math('5x.')}
			</p>
		{/if}
		{#if example2}
			{#if final}
				<p transition:slide|local>
					Answer: {@html math('5x^2+2x.')}
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
