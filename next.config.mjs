/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '"m.media-amazon.com',
			},
		],
	},

	headers: () => [
		{
			source: '/',
			headers: [
				{
					key: 'Cache-Control',
					value: 'no-store',
				},
			],
		},
	],
};

export default nextConfig;
