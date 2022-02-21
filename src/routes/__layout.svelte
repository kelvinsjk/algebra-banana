<script>
	import '../app.css';
	import '../katex.min.css';
	import '../mathlive-fonts.css';
</script>

<header class="text-center">
	<a sveltekit:prefetch href="/">Home</a>
</header>
<main class="bg-stone-100 grid items-end">
	<slot />
</main>
<footer>Footer</footer>

<style>
	main {
		min-height: 100vh;
		max-width: 100%;
	}
	footer {
		min-height: 50vw;
		background: midnightblue;
	}
</style>
