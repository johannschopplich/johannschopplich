// Heavily copied from: https://github.com/terkelg/terkelg/

const BP_MEDIUM = 550;
const BP_LARGE = 700;

interface Props {
	width?: number;
	height: number;
	theme: 'light' | 'dark';
}

interface Attributes {
	height: string;
	'data-theme': 'light' | 'dark';
	[key: string]: string;
}

const SHARED_STYLESHEET = /* css */ `
	:root {
		--color-text-light: rgb(31, 35, 40);
		--color-text-dark: white;
		--color-accent: #89937A;
	}

	[data-theme="dark"] {
		--color-text: var(--color-text-dark);
	}

	[data-theme="light"] {
		--color-text: var(--color-text-light);
	}

	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
	}

	.container {
		contain: strict;
		block-size: calc(var(--size-height) * 1px);
		container-type: inline-size;
		position: relative;
		overflow: clip;
		font-family: ui-sans-serif, system-ui, sans-serif;
		color: var(--color-accent);
	}

	.label {
		contain: content;
		font-size: 16px;
		font-weight: 600;
	}

	.link {
		contain: content;
		font-size: 16px;
	}

	p {
		constrain: content;
		margin: 0;
	}

	.fade-in {
		will-change: opacity;
		animation-name: fade-in;
		animation-fill-mode: both;
		animation-duration: var(--duration, 1.5s);
		animation-timing-function: var(--ease, ease-out);
		animation-delay: var(--delay, 1s);
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.shine {
		background-color: var(--color-accent);
		background-image: linear-gradient(-75deg,
			rgb(0 0 0 / 0) 0%,
			rgb(255 255 255 / 0.18) 15%,
			rgb(0 0 0 / 0) 25%
		);
		background-size: 200%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-fill-color: transparent;

		animation-name: shine;
		animation-duration: 14s;
		animation-iteration-count: infinite;
	}

	@keyframes shine {
		0% {
			background-position: 200%;
		}
		10% {
			background-position: 0%;
		}
		to {
			background-position: 0%;
		}
	}
`;

export function top(props: Props) {
	const styles = /* css */ `
		${SHARED_STYLESHEET}

		:root {
			--size-height: ${props.height};
		}

		.container {
			align-items: center;
		}

		/* Hide in Firefox */
		@-moz-document url-prefix() {
			.container {
				display: none;
			}
		}
	
		.container > :nth-child(1) {
			contain: content;
			text-align: left;
			grid-area: 1 / 1 / span 1 / span 3;
		}
		.container > :nth-child(2) {
			contain: content;
			text-align: right;
			grid-area: 1 / 4 / span 1 / span 3;
		}

		/*
		@media (width > ${BP_MEDIUM}px) {
			.container > :nth-child(1) {
				grid-area: 1 / 1 / span 1 / span 2;
			}
			.container > :nth-child(2) {
				text-align: left;
				grid-area: 1 / 3 / span 1 / span 4;
			}
		}

		@media (width > ${BP_LARGE}px) {
			.container > :nth-child(1) {
				grid-area: 1 / 1 / span 1 / span 3;
			}
			.container > :nth-child(2) {
				text-align: left;
				grid-area: 1 / 4 / span 1 / span 3;
			}
		}
		*/
	`;

	const html = /*html*/ `
		<div class="container grid label">
			<div>Navigation</div>
			<div>Johann Schopplich</div>
		</div>
	`;

	return svg(html, styles, {
		height: `${props.height}`,
		'data-theme': `${props.theme}`,
	});
}

export function link(props: Props & { index: number; label: string }) {
	const styles = /* css */ `
		${SHARED_STYLESHEET}

		:root {
			--size-height: ${props.height};
		}

		.link {
			display: flex;
			justify-content: start;
			align-items: center;
			gap: 3px;
			animation-delay: ${250 + props.index * 250}ms;
		}

		.link__label {
			animation-delay: ${Math.random() * 10}s;
		}

		.link__arrow {
			font-size: 0.75em;
			position: relative;
			inset-block-start: 0.1em;
		}
	`;

	const html = /*html*/ `
		<main class="container">
			<a class="link fade-in">
				<div class="${props.index === 0 ? 'shine' : ''}">${props.label}</div>
				<div class="link__arrow">↗</div>
			</a>
		</main>
	`;

	return svg(html, styles, {
		width: `${props.width}`,
		height: `${props.height}`,
		'data-theme': `${props.theme}`,
	});
}

export function bottom(props: Props) {
	return svg({
		width: `${props.width}`,
		height: `${props.height}`,
		'data-theme': `${props.theme}`,
		viewbox: `0 0 ${props.width} ${props.height}`,
	});
}

function attr(obj: Record<string, string>) {
	return Object.entries(obj).reduce(
		(acc, [key, value]) => `${acc} ${key}="${value}"`,
		'',
	);
}

function svg(html: string, styles: string, attributes: Attributes): string;
function svg(attributes: Attributes): string;
function svg(...args: any[]): string {
	const html: string = typeof args[0] === 'string' ? args[0] : '';
	const styles: string = typeof args[1] === 'string' ? args[1] : '';
	const attributes: Attributes =
		typeof args[0] === 'object' ? args[0] : args[2];

	attributes.width ||= '100%';

	return /* html */ `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" ${attr(attributes)}>
	<foreignObject width="100%" height="100%">
		<div xmlns="http://www.w3.org/1999/xhtml">
			<style>${styles}</style>
			${html}
		</div>
	</foreignObject>
</svg>`.trimStart();
}
