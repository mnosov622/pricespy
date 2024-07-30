import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractPrice } from '..';

export async function scrapeAmazonProduct(url: string) {
	if (!url) {
		return;
	}

	const username = String(process.env.BRIGHT_DATA_USERNAME);
	const password = String(process.env.BRIGHT_DATA_PASSWORD);
	const port = 2225;

	const session_id = (1000000 * Math.random()) | 0;

	const options = {
		auth: {
			username: `${username}-session-${session_id}`,
			password: password,
		},
		host: 'brd.superproxy.io',
		port,
		rejectUnauthorized: false,
	};

	try {
		const { data } = await axios.get(url, options);

		const $ = cheerio.load(data);

		const title = $('#productTitle').text().trim();

		let currentPrice = extractPrice(
			$('.priceToPay span.a-price-whole'),
			$('.a-price-whole'),
			$('.priceToPay')
		);

		currentPrice = currentPrice.replace(/\.$/, '');

		const originalPriceExists = $('.a-price.a-text-price .a-offscreen').length > 0;

		let originalPrice = originalPriceExists
			? extractPrice($('.a-price.a-text-price .a-offscreen'))
			: currentPrice;

		originalPrice = originalPrice.replace(/\.$/, '');

		const outOfStock = $('#availability').text().toLowerCase() === 'currently unavailable';
		const images =
			$('#imgBlkFront').attr('data-a-dynamic-image') ||
			$('#landingImage').attr('data-a-dynamic-image') ||
			'{}';

		const imageUrls = Object.keys(JSON.parse(images));

		const currency = extractCurrency($('.a-price-symbol'));

		const discountRate = $('.aok-offscreen').text().replace(/[-%]/g, '');

		const discountRates = discountRate
			.match(/\d+ percent savings/g)
			?.map((rate) => rate.match(/\d+/)?.[0]);

		const totalDiscount = discountRates?.[0];

		const productDescription = $('#productDescription').text().trim();

		console.log('Discount:', productDescription);

		const productData = {
			title,
			currency: currency || '$',
			originalPrice: Number(originalPrice),
			currentPrice: Number(currentPrice) || originalPrice,
			isOutOfStock: outOfStock,
			image: imageUrls[0],
			discountRate: totalDiscount,
			productDescription,
			priceHistory: [],
			category: '',
			reviewsCount: 100,
			stars: 4.5,
		};
	} catch (e: any) {
		throw new Error(`Failed to scrape product details ${e.message}`);
	}
}
