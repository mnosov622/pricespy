'use client';

import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const heroImages = [
	{ imgUrl: '/assets/images/hero-1.svg', alt: 'Smartwatch' },
	{ imgUrl: '/assets/images/hero-2.svg', alt: 'Bag' },
	{ imgUrl: '/assets/images/hero-3.svg', alt: 'Lamp' },
	{ imgUrl: '/assets/images/hero-4.svg', alt: 'air fryer' },
	{ imgUrl: '/assets/images/hero-5.svg', alt: 'chair' },
];

const HeroCarousel = () => {
	return (
		<div className="hero-carousel">
			<Carousel
				showArrows={false}
				showStatus={false}
				showThumbs={false}
				infiniteLoop
				autoPlay
				interval={5000}
			>
				{heroImages.map((image, index) => (
					<Image
						key={index}
						src={image.imgUrl}
						alt={image.alt}
						width={484}
						height={484}
						className="object-contain"
					/>
				))}
			</Carousel>
			<Image
				src="/assets/icons/hand-drawn-arrow.svg"
				width={175}
				height={175}
				alt="Arrow left"
				className="max-xl:hidden absolute -left-[15%] bottom-0 z-0"
			/>
		</div>
	);
};

export default HeroCarousel;
