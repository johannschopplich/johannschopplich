import { link, main, top } from './render.js';

const worker: ExportedHandler = {
	async fetch(request) {
		const { searchParams } = new URL(request.url);
		const theme = (searchParams.get('theme') ?? 'light') as 'light' | 'dark';
		const section = searchParams.get('section') ?? '';
		const label = searchParams.get('label') ?? '';
		let content = ':-)';

		if (section === 'top') {
			content = top({ height: 20, theme });
		} else if (section === 'link') {
			content = link({ height: 18, width: 100, label, theme });
		} else {
			content = main({ height: 200, theme });
		}

		return new Response(content, {
			headers: {
				'content-type': 'image/svg+xml',
				'cache-control':
					'no-store, no-cache, must-revalidate, proxy-revalidate',
				pragma: 'no-cache',
				expires: '0',
			},
		});
	},
};

export default worker;
