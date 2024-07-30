'use server';

import { revalidatePath } from 'next/cache';
import { getAveragePrice, getHighestPrice, getLowestPrice } from '..';
import Product from '../models/product.model';
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

		let product = scrapedProduct;

		const existingProduct = await Product.findOne({ url: scrapedProduct.url });

		if (existingProduct) {
			const updatedPriceHistory: any = [
				...existingProduct?.priceHistory,
				{ price: scrapedProduct.currentPrice },
			];

			product = {
				...scrapedProduct,
				priceHistory: updatedPriceHistory,
				lowestPrice: getLowestPrice(updatedPriceHistory),
				highestPrice: getHighestPrice(updatedPriceHistory),
				averagePrice: getAveragePrice(updatedPriceHistory),
			};
		}

		const newProduct = await Product.findOneAndUpdate(
			{
				url: product.url,
			},
			product,
			{ upsert: true, new: true }
		);

		revalidatePath(`/products/${newProduct._id}`);
	} catch (e: any) {
		throw new Error(`Failed to scrape product details ${e.message}`);
	}
}
