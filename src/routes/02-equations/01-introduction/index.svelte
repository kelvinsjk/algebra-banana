<script lang="ts">
	import { math } from '$lib/math';

	const title = 'Algebraic Equations';
	const nextSectionName = 'Addition and subtraction';
	const nextSectionSlug = './02-manipulation/addition-and-subtraction';
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
		<h2 id="theory" class="mt-0">Introduction</h2>
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
	<section
		aria-labelledby="example"
		id="example-container"
		class="example-container flex-center full-bleed px-2"
	>
		<h2 id="example" class="mt-0">Algebraic Manipulation</h2>
		<div class="text-center max-w-prose">
			We work with algebraic equations by <span class="emphasis">manipulating</span>
			them to get <span class="emphasis">equivalent</span> equations. There are three basic rules we
			can use to manipulate equations:
			<ul class="text-left">
				<li>
					<span class="emphasis">Reverising the order.</span>
					<br />For example, {@html math('2=x')} can be reordered to {@html math('x=2')}
				</li>
				<li>
					<span class="emphasis">Adding/subtracting</span> the same quantity on both sides.
					<br />For example, {@html math('x+2=4')} is equivalent to
					{@html math('x+3=5')} by adding {@html math('1')} on both sides.
					<br />
					{@html math('x+2=4')} is also equivalent to {@html math('x=2')} by subtracting {@html math(
						'2'
					)} on both sides.
				</li>
				<li>
					<span class="emphasis">Multiplying/dividing </span>the same non-zero quantity on both
					sides.
					<br />For example, {@html math('x+2=4')} is equivalent to
					{@html math('2(x+2)=8')} and {@html math('\\frac{x+2}{2}=2')} by multiplying/dividing by {@html math(
						'2'
					)} on both sides.
				</li>
			</ul>
		</div>
	</section>
</article>

<nav class="flex justify-end">
	<a class="px-4 py-2 bg-green-100 underline" rel="prefetch" href={nextSectionSlug}>
		&raquo; {nextSectionName} &raquo;
	</a>
</nav>
