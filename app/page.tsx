import HeroCarousel from '@/components/HeroCarousel';
import ProductCard from '@/components/ProductCard';
import Searchbar from '@/components/Searchbar';
import { Product } from '@/types';
import { getAllProducts } from '@/utils/actions';
import Image from 'next/image';

const dynamic = 'force-dynamic';
const revalidate = 0;

export const fetchCache = 'force-no-store';

const HomePage = async () => {
	const products = await getAllProducts();

	return (
		<>
			<section className="px-6 md:px-20 py-20">
				<div className="flex max-xl:flex-col gap-16">
					<div className="flex flex-col justify-center">
						<p className="small-text">
							Smart Shopping Starts Here
							<Image
								src="/assets/icons/arrow-right.svg"
								width={16}
								height={16}
								alt="Arrow right"
							/>
						</p>
						<h1 className="head-text">
							Unleash the Power of <span className="text-primary">PriceSpy</span>
						</h1>
						<p className="mt-6">
							Powerful, self-serve product and growth analytics to help you convert, engage, and
							retain more.
						</p>
						<Searchbar />
					</div>
					<HeroCarousel />
				</div>
			</section>

			<section className="trending-section">
				<h2 className="section-text">Trending</h2>

				<div className="flex flex-wrap gap-x-8 gap-y-16">
					{products?.map((product: Product) => (
						<ProductCard
							product={product}
							key={product._id}
						/>
					))}
				</div>
			</section>
		</>
	);
};

export default HomePage;
