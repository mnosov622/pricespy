'use server';

import { connectToDb } from '../mongoose';
import { scrapeAmazonProduct } from '../scraper';

export async function scrapeAndStoreProduct(productUrl: string) {
	if (!productUrl) {
		return;
	}

	try {
		connectToDb();

		const scrapedProduct = await scrapeAmazonProduct(productUrl);
		if (!scrapedProduct) {
			return;
		}
	} catch (e: any) {
		throw new Error(`Failed to scrape product details ${e.message}`);
	}
}
