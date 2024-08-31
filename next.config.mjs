/** @type {import('next').NextConfig} */
const nextConfig = {
	// Дозволити віддалені зображення з усіх хостів
	images: {
		remotePatterns: [
		  {
			protocol: 'https',
			hostname: '**', // Дозволити всі хости
		  },
		  {
			protocol: 'http',
			hostname: '**', // Дозволити всі хости з HTTP
		  },
		],
	}
};

export default nextConfig;
