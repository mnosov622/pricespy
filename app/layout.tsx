import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'Price Spy',
	description: 'Track prices of your favorite products and get notified when they drop',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<main className="max-w-10xl mx-auto">
					<Navbar />
					{children}
					<Toaster />
					<NextTopLoader color="#E43030" />
				</main>
			</body>
		</html>
	);
}
