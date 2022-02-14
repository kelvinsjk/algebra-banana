	import { cubicOut } from 'svelte/easing';
  
  type EasingFunction = (t: number) => number;
	interface SlideParams {
		delay?: number;
		duration?: number;
		easing?: EasingFunction;
	}
	interface TransitionConfig {
		delay?: number;
		duration?: number;
		easing?: EasingFunction;
		css?: (t: number, u: number) => string;
		tick?: (t: number, u: number) => void;
	}

	export function scaleX(
		node: Element,
		{ delay = 0, duration = 400, easing = cubicOut }: SlideParams = {}
	): TransitionConfig {
		const w = Number(getComputedStyle(node).width.slice(0, -2));
		return {
			delay,
			duration,
			easing,
			css: (t) => `width: ${t * w}px`
		};
	}