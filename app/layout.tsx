import Navbar from '@/components/Navbar';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
					<Analytics />
				</main>
			</body>
		</html>
	);
}
