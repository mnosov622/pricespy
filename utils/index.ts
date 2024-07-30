export const isValidAmazonProducUrl = (url: string) => {
	try {
		const parsedUrl = new URL(url);
		const hostname = parsedUrl.hostname;

		if (
			hostname.includes('amazon.com') ||
			hostname.includes('amazon.') ||
			hostname.includes('amazon')
		) {
			return true;
		}
	} catch (e) {
		return false;
	}

	return false;
};

export function extractPrice(...elements: any) {
	for (const element of elements) {
		const priceText = element.text().trim();

		console.log(priceText);

		if (priceText) {
			const cleanPrice = priceText.replace(/[^\d.]/g, '');

			let firstPrice;

			if (cleanPrice) {
				firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
			}

			return firstPrice || cleanPrice;
		}
	}

	return '';
}

export function extractCurrency(element: any) {
	const currencyText = element.text().trim().slice(0, 1);

	if (currencyText) {
		return currencyText;
	}

	return '';
}
