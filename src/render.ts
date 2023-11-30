// Heavily copied from: https://github.com/terkelg/terkelg/

const BP_MEDIUM = 550;
const BP_LARGE = 700;
const BODY_COPY =
  'Somewhere in between development and design. Formerly a pharmacist. Great to meet!';

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

const attr = (obj: Record<string, string>) =>
  Object.entries(obj).reduce((acc, [key, value]) => `${acc} ${key}="${value}"`, '');

const svg = (styles: string, html: string, attributes: Attributes) => {
  attributes.width ||= '100%';

  return /*html*/ `
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" ${attr(attributes)}>
		<foreignObject width="100%" height="100%">
			<div xmlns="http://www.w3.org/1999/xhtml">
				<style>${styles}</style>
				${html}
			</div>
		</foreignObject>
	</svg>`;
};

export const shared = /* css */ `
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
		font-size: 14px;
		font-weight: 600;
	}

	.link {
		contain: content;
		font-size: 14px;
	}

	p {
		constrain: content;
		margin: 0;
	}
`;

export const main = (props: Props) => {
  const styles = /*css*/ `
		${shared}

		:root {
			--size-width: 100cqw;
			--size-height: ${props.height};
			--size-label-height: 20;
		}

		.container {
			align-items: flex-end;
			grid-template-rows: 1fr auto;
			row-gap: 20px;
		}

		.intro {
			contain: content;
			grid-area: 1 / 1 / span 1 / span 6;
			font-size: 18px;
			font-weight: 300;
		}

		@media (width > ${BP_MEDIUM}px) {
			.intro {
				grid-area: 1 / 3 / span 1 / span 4;
				font-size: 22px;
			}
		}
		@media (width > ${BP_LARGE}px) {
			.intro {
				grid-area: 1 / 4 / span 1 / span 3;
			}
		}
	`;

  const html = /* html */ `
		<main class="container grid">
			<article class="intro">
				<p>${BODY_COPY}</p>
			</article>
		</main>
	`;

  return svg(styles, html, {
    height: `${props.height}`,
    'data-theme': `${props.theme}`,
  });
};

export const top = (props: Props) => {
  const styles = /* css */ `
		${shared}

		:root {
			--size-height: ${props.height};
		}

		.container {
			align-items: center;
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
	`;

  const html = /*html*/ `
		<div class="container grid label">
			<div>Links</div>
			<div>Johann Schopplich</div>
		</div>
	`;

  return svg(styles, html, {
    height: `${props.height}`,
    'data-theme': `${props.theme}`,
  });
};

export const link = (props: Props & { label: string }) => {
  const styles = /*css*/ `
		${shared}

		:root {
			--size-height: ${props.height};
			--size-width: ${props.width};
		}

		.link {
			display: flex;
			justify-content: start;
			align-items: center;
			gap: 3px;
		}

		.link__arrow {
			font-size: 0.75em;
			position: relative;
			inset-block-start: 0.1em;
		}
	`;

  const html = /*html*/ `
		<main class="container">
			<a class="link">
				<div>${props.label}</div>
				<div class="link__arrow">↗</div>
			</a>
		</main>
	`;

  return svg(styles, html, {
    width: `${props.width}`,
    height: `${props.height}`,
    'data-theme': `${props.theme}`,
  });
};
