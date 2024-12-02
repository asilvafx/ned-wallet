import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [name, setName] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [formErrorMessage, setFormErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormErrorMessage(null);

        if (!stripe || !elements) {
            setFormErrorMessage('Stripe.js has not yet loaded.');
            setIsLoading(false);
            return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment`,
            },
        });

        if (error) {
            console.log('Payment error: ', error);
            setFormErrorMessage(error.message);
        } else if (paymentIntent) {
            console.log('Payment successful: ', paymentIntent);
            // Handle successful payment here (e.g., update user balance, show success message)
        }

        setIsLoading(false);
    };

    return (
        <div>
            <div className="relative">
                <div className="bg-secondary p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="card-nr" className="block text-sm font-medium mb-1">
                                Card Number
                            </label>
                            <CardNumberElement id="card-nr" className='text-sm text-gray-700 bg-white border rounded px-3 py-2 border-gray-300' />
                        </div>
                        <div>
                            <label htmlFor="card-exp" className="block text-sm font-medium mb-1">
                                Card Exp
                            </label>
                            <CardExpiryElement id="card-exp" className='text-sm text-gray-700 bg-white border rounded px-3 py-2 border-gray-300' />
                        </div>
                        <div>
                            <label htmlFor="card-cvc" className="block text-sm font-medium mb-1">
                                Card CVC
                            </label>
                            <CardCvcElement id="card-cvc" className='text-sm text-gray-700 bg-white border rounded px-3 py-2 border-gray-300' />
                        </div>
                        <div>
                            <label htmlFor="customer-name" className="block text-sm font-medium mb-1">
                                Name
                            </label>
                            <input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className='text-sm text-gray-700 bg-white border rounded px-3 py-2 border-gray-300 w-full' required />
                        </div>
                        <div>
                            <label htmlFor="postal-code" className="block text-sm font-medium mb-1">
                                Postal Code
                            </label>
                            <input placeholder="Your Postal Code" value={postalCode} onChange={e => setPostalCode(e.target.value)} className='text-sm text-gray-700 bg-white border rounded px-3 py-2 border-gray-300 w-full' required />
                        </div>

                        {formErrorMessage && <label className="my-2 text-xs text-red-500">{formErrorMessage}</label>}
                        <button disabled={isLoading || !stripe || !elements} className="flex items-center justify-center bg-primary px-4 py-2 rounded w-full text-center">
                            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;