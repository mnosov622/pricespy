import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from '@/utils';
import Product from '@/utils/models/product.model';
import { connectToDb } from '@/utils/mongoose';
import { generateEmailBody, sendEmail } from '@/utils/nodemailer';
import { scrapeAmazonProduct } from '@/utils/scraper';
import { NextResponse } from 'next/server';

export const maxDuration = 60;

export const dynamic = 'force-dynamic';

export const revalidate = 0;

export async function GET() {
	try {
		connectToDb();

		const products = await Product.find({});

		if (!products) {
			throw new Error('No products found');
		}

		const updatedProducts = await Promise.all(
			products.map(async (product) => {
				const scrapedProduct = await scrapeAmazonProduct(product.url);
				if (!scrapedProduct) {
					throw new Error('Error scraping product');
				}

				const updatedPriceHistory: any = [
					...product?.priceHistory,
					{ price: scrapedProduct.currentPrice },
				];

				product = {
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

				const emailNotifType = getEmailNotifType(scrapedProduct, product);

				if (emailNotifType && updatedProduct.users.length > 0) {
					const productInfo = {
						title: updatedProduct.title,
						url: updatedProduct.url,
					};

					const emailContent = await generateEmailBody(productInfo, emailNotifType);

					const userEmails = updatedProduct.users.map((user: any) => user.email);

					await sendEmail(emailContent, userEmails);

					return updatedProduct;
				}
			})
		);

		return NextResponse.json({
			message: 'OK',
			data: updatedProducts,
		});
	} catch (e) {
		throw new Error(`Error in cron job ${e}`);
	}
}
