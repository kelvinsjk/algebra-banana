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

	const title = 'Algebraic Equations';

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
	<section id="theory-container" class="theory-container flex-center full-bleed px-2">
		<h2 class="mt-0">Theory</h2>
		<p class="text-center max-w-prose">
			So far we have been working with <span class="emphasis">expressions</span> which represent
			quantities. For example, we could let {@html math('x')} represent the cost of a pencil and {@html math(
				'y'
			)} represent the cost of a pen. The expression {@html math('2x+y')}
			represents the cost of two pencils and one pen and {@html math('3(2x+y)')} represents the cost
			of three such sets.
		</p>
		<p class="text-center max-w-prose">
			In this chapter we will start to work with algebraic <span class="emphasis">equations</span>
			which are made up of expressions and the equal {@html math('(=)')} sign. Equations allow us to
			describe relationships between quantities. For example, if a pencil costs $2, we can write the
			equation
			{@html math('x=2.')} Meanwhile, if a pen costs $1 more than a pencil, we can write {@html math(
				'y=x+1.'
			)}
		</p>
	</section>
</article>

<nav class="flex justify-end">
	<a
		class="px-4 py-2 bg-green-100 underline"
		rel="prefetch"
		href="./01-introduction/manipulating-equations"
	>
		&raquo; Manipulating equations &raquo;
	</a>
</nav>
