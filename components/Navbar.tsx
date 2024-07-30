import Image from 'next/image';
import Link from 'next/link';

const navIcons = [
	{
		src: '/assets/icons/search.svg',
		alt: 'Search',
	},
	{
		src: '/assets/icons/black-heart.svg',
		alt: 'Favorites',
	},
	{
		src: '/assets/icons/user.svg',
		alt: 'User',
	},
];

function Navbar() {
	return (
		<header className="w-full">
			<nav className="nav">
				<Link
					href="/"
					className="flex items-center gap-2"
				>
					<Image
						src="/assets/icons/logo.svg"
						alt="Price Spy logo"
						width={27}
						height={27}
					/>
					<p className="nav-logo">
						Price <span className="text-primary">Spy</span>
					</p>
				</Link>
				<div className="flex items-center gap-5">
					{navIcons.map((icon, index) => (
						<Image
							key={index}
							src={icon.src}
							alt={icon.alt}
							width={28}
							height={28}
							className="object-contain"
						/>
					))}
				</div>
			</nav>
		</header>
	);
}

export default Navbar;
