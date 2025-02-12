'use server';

import { User } from '@/types';
import { revalidatePath, unstable_noStore } from 'next/cache';
import { getAveragePrice, getHighestPrice, getLowestPrice } from '..';
import Product from '../models/product.model';
import { connectToDb } from '../mongoose';
import { generateEmailBody, sendEmail } from '../nodemailer';
import { scrapeAmazonProduct } from '../scraper';

unstable_noStore();

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

		const productId = newProduct._id.toString();

		return productId;
	} catch (e: any) {
		throw new Error(`Failed to scrape product details ${e.message}`);
	}
}

export async function getProductById(productId: string) {
	try {
		connectToDb();

		const product = await Product.findOne({ _id: productId });

		if (!product) {
			throw new Error('Product not found');
		}
		return product;
	} catch (e: any) {
		throw new Error(`Failed to get product details ${e.message}`);
	}
}

export async function getAllProducts() {
	try {
		connectToDb();

		const products = await Product.find();

		if (!products) {
			throw new Error('No products found');
		}

		return products;
	} catch (e: any) {
		throw new Error(`Failed to get all products ${e.message}`);
	}
}

export async function getLastTwelveProducts() {
	try {
		connectToDb();

		const products = await Product.find().sort({ createdAt: -1 }).limit(12);

		if (!products || products.length === 0) {
			throw new Error('No products found');
		}

		return products;
	} catch (e: any) {
		throw new Error(`Failed to get last five products: ${e.message}`);
	}
}

export async function getSimilarProducts(productId: string) {
	try {
		connectToDb();

		const currentProduct = await Product.findById(productId);

		if (!currentProduct) return null;

		const similarProducts = await Product.find({
			_id: { $ne: productId },
		}).limit(3);

		return similarProducts;
	} catch (error) {
		console.log(error);
	}
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
	try {
		const product = await Product.findById(productId);

		if (!product) return;

		const userExists = product.users.some((user: User) => user.email === userEmail);

		if (!userExists) {
			product.users.push({ email: userEmail });

			await product.save();

			const emailContent = await generateEmailBody(product, 'WELCOME');

			const result: any = await sendEmail(emailContent, [userEmail]);

			console.log(result);
		}
	} catch (error) {
		console.log(error);
	}
}
