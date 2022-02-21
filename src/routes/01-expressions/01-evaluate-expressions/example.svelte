<script lang="ts">
	import { math } from '$lib/math';
	import { slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { tick } from 'svelte';

	const title = 'Evaluating Expressions';

	let showXVal = false;
	let initial = true;
	let final = false;

	let a: HTMLElement, b: HTMLElement, c: HTMLElement, d: HTMLElement, e: HTMLElement;
	let elements = [a, b, c, d, e];
	let x = math('x');
	let buttonText = 'show answer';

	const solnItems = [
		{ content: math('3'), classes: '', visible: true },
		{
			content: '',
			classes: 'relative px-px text-red-600',
			visible: true,
			child: true
		},
		{ content: math('-2'), classes: '', visible: true },
		{
			content: math(' =15-2'),
			classes: 'pl-1',
			visible: false
		},
		{
			content: math(' =13'),
			classes: 'pl-1',
			visible: false
		}
	];

	async function clickButton() {
		if (!showXVal) {
			x = math('\\phantom{(}x\\phantom{)}');
			initial = false;
			await tick();
			showXVal = true;
			setTimeout(() => {
				solnItems[3].visible = true;
				setTimeout(() => {
					solnItems[4].visible = true;
					setTimeout(() => {
						buttonText = 'reset';
						final = true;
					}, 800);
				}, 800);
			}, 800);
		} else {
			x = math('x');
			showXVal = false;
			solnItems[3].visible = false;
			solnItems[4].visible = false;
			buttonText = 'show answer';
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
			We use symbols and letters like {@html math('x')} and {@html math('y')} to represent unknown numbers
			in algebra. These symbols are called <span class="emphasis">variables</span>.
		</p>
		<p class="text-center max-w-prose">
			We can <span class="emphasis">evaluate</span> an
			<span class="emphais">algebraic expression</span>
			like {@html math('2x')}
			once we know what {@html math('x')} represents. If {@html math('x=3,')} then we can replace {@html math(
				'x'
			)} with
			{@html math('3')} in {@html math('2x')} to get {@html math('2(3)=6')}.
		</p>
	</section>
	<section id="example-container" class="question-container flex-center full-bleed px-2">
		<h2 class="mt-0">Illustrated Example</h2>
		<p class="text-center max-w-prose">
			Evaluate {@html math('3x-2')} when {@html math('x=5.')}
		</p>
	</section>

	<section id="solution-container" class="example-container flex-center full-bleed px-2">
		<h2 class="mt-0">Solution</h2>
		<p class="text-center max-w-prose">
			We replace <span class="text-red-600">{@html math('x')}</span> with
			<span class="text-red-600">{@html math('5')}</span> and evaluate the result.
		</p>
		<button
			class="btn btn-primary btn-sm mb-5 transition-all duration-500 whitespace-nowrap"
			style:width={buttonText === 'show answer' ? '10em' : '5em'}
			on:click={clickButton}>{buttonText}</button
		>
		<div class="flex border text-center max-w-prose">
			{#each solnItems.filter((e) => e.visible) as item, i (item)}
				<div animate:flip class={item.classes} in:slide|local={{ duration: 700 }}>
					{@html item.content}
					{#if item['child']}
						<div style:opacity={showXVal ? 0 : 100} class="transition duration-700">
							{@html x}
						</div>
						{#if !initial}
							<div
								class="absolute text-center text-red-600 bg-green-300/50 transition  duration-700 top-0 inset-x-0 mx-auto w-fit px-px rounded-full"
								style:transform={showXVal ? null : 'translateY(-2em)'}
								style:opacity={showXVal ? 100 : 0}
								bind:this={elements[i]}
							>
								{@html math('(5)')}
							</div>
						{/if}
					{/if}
				</div>
			{/each}
		</div>
		{#if final}
			<p transition:slide|local>
				Answer: {@html math('13.')}
			</p>
		{/if}
	</section>
</article>
<nav class="flex justify-end">
	<a class="px-4 py-2 bg-green-100 underline" rel="prefetch" href="./exercise">
		&raquo; Try out some exercises &raquo;
	</a>
</nav>
