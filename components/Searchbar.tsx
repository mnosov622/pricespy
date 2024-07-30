'use client';

import { isValidAmazonProducUrl } from '@/utils';
import { scrapeAndStoreProduct } from '@/utils/actions';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

const Searchbar = () => {
	const [searchPrompt, setSearchPrompt] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const isValidLink = isValidAmazonProducUrl(searchPrompt);

		if (!isValidLink) {
			toast.error('Invalid Amazon product link');
			return;
		}

		try {
			setIsLoading(true);

			const product = await scrapeAndStoreProduct(searchPrompt);
		} catch (e) {
			toast.error('Failed to fetch product details');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			className="flex flex-wrap gap-4 mt-12"
			onSubmit={handleSubmit}
		>
			<input
				type="text"
				value={searchPrompt}
				onChange={(e) => setSearchPrompt(e.target.value)}
				placeholder="Enter product link"
				className="searchbar-input"
			/>

			<button
				type="submit"
				className="searchbar-btn"
				disabled={isLoading || searchPrompt.trim().length === 0}
			>
				{isLoading ? 'Searching...' : 'Search'}
			</button>
		</form>
	);
};

export default Searchbar;
