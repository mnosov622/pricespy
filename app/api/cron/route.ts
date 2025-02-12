import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from '@/utils';
import Product from '@/utils/models/product.model';
import { connectToDb } from '@/utils/mongoose';
import { generateEmailBody, sendEmail } from '@/utils/nodemailer';
import { scrapeAmazonProduct } from '@/utils/scraper';
import { NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
	try {
		connectToDb();

		const products = await Product.find({});

		if (!products) throw new Error('No product fetched');

		const updatedProducts = await Promise.all(
			products.map(async (currentProduct) => {
				const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

				if (!scrapedProduct) return;

				const updatedPriceHistory = [
					...currentProduct.priceHistory,
					{
						price: scrapedProduct.currentPrice,
					},
				];

				const product = {
					...scrapedProduct,
					priceHistory: updatedPriceHistory,
					lowestPrice: getLowestPrice(updatedPriceHistory),
					highestPrice: getHighestPrice(updatedPriceHistory),
					averagePrice: getAveragePrice(updatedPriceHistory),
				};

				const updatedProduct = await Product.findOneAndUpdate(
					{
						url: product.url,
					},
					product
				);

				const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);

				if (emailNotifType && updatedProduct.users.length > 0) {
					const productInfo = {
						title: updatedProduct.title,
						url: updatedProduct.url,
					};
					const emailContent = await generateEmailBody(productInfo, emailNotifType);

					const userEmails = updatedProduct.users.map((user: any) => user.email);

					await sendEmail(emailContent, userEmails);
				}

				return updatedProduct;
			})
		);

		return NextResponse.json({
			message: 'Ok',
			data: updatedProducts,
		});
	} catch (error: any) {
		throw new Error(`Failed to get all products: ${error.message}`);
	}
}
