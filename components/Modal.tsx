'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import { FormEvent, useState } from 'react';

interface Props {
	productId: string;
}

const Modal = ({ productId }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [email, setEmail] = useState('');

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		// await addUserEmailToProduct(productId, email);

		setIsSubmitting(false);
		setEmail('');
		closeModal();
	};

	const openModal = () => setIsOpen(true);

	const closeModal = () => setIsOpen(false);

	return (
		<>
			<button
				type="button"
				className="btn transition-all"
				onClick={openModal}
			>
				Track
			</button>

			<Dialog.Root
				open={isOpen}
				onOpenChange={setIsOpen}
			>
				<Dialog.Trigger asChild>
					<button style={{ display: 'none' }}>Open Dialog</button>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
					<Dialog.Content className="dialog-content fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
						<div className="flex flex-col">
							<div className="flex justify-between">
								<div className="p-3 border border-gray-200 rounded-10">
									<Image
										src="/assets/icons/logo.svg"
										alt="logo"
										width={28}
										height={28}
									/>
								</div>

								<Image
									src="/assets/icons/x-close.svg"
									alt="close"
									width={24}
									height={24}
									className="cursor-pointer"
									onClick={closeModal}
								/>
							</div>

							<h4 className="dialog-head_text">
								Stay updated with product pricing alerts right in your inbox!
							</h4>

							<p className="text-sm text-gray-600 mt-2">
								Never miss a bargain again with our timely alerts!
							</p>
						</div>

						<form
							className="flex flex-col mt-5"
							onSubmit={handleSubmit}
						>
							<label
								htmlFor="email"
								className="text-sm font-medium text-gray-700"
							>
								Email address
							</label>
							<div className="dialog-input_container">
								<Image
									src="/assets/icons/mail.svg"
									alt="mail"
									width={18}
									height={18}
								/>

								<input
									required
									type="email"
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email address"
									className="dialog-input"
								/>
							</div>

							<button
								type="submit"
								className="dialog-btn"
							>
								{isSubmitting ? 'Submitting...' : 'Track'}
							</button>
						</form>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	);
};

export default Modal;
