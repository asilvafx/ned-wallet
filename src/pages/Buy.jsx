import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from "../components/Breadcrumbs";
import { SITE_URL } from '../data/config';
import { loadStripeOnramp } from "@stripe/crypto";
import { CryptoElements, OnrampElement } from '../components/StripeCryptoElements';
import { SiPolygon } from "react-icons/si";

const stripeOnrampPromise = loadStripeOnramp("pk_test_51L9a5yJAJnmQ0fU3xf2Vk9T6ppfbzwkHySdOfL0jEbVklf0XI5iY3g8r5hsQFJx396B8kNDHDMAHXkx6z9s20QwH0029XOfdMw");

const Buy = () => {
    const { t } = useTranslation();
    const [amount, setAmount] = useState('');
    const [fee, setFee] = useState(0);
    const [totalNED, setTotalNED] = useState(0);
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [message, setMessage] = useState("");

    useEffect(() => {

        setMessage('Loading..');
        // Fetches an onramp session and captures the client secret
        fetch(
            SITE_URL + "/api/create-payment",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transaction_details: {
                        source_currency: "usd",
                        destination_currency: "btc",
                        destination_exchange_amount: "13.37",
                        destination_network: "ethereum",
                        wallet_addresses: {
                            "bitcoin": null,
                            "ethereum": null,
                            "polygon": "0xB00F0759DbeeF5E543Cc3E3B07A6442F5f3928a2",
                            "solana": null,
                            "stellar": null,
                            "destination_tags": null
                        },
                    }
                }),
            })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const onChange = React.useCallback(({ session }) => {
        setMessage(``);
    }, []);

    const calculateFeeAndTotal = (value) => {
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue) && parsedValue > 0) {
            const calculatedFee = parsedValue * 0.003; // 0.30% fee
            const total = parsedValue - calculatedFee;
            setFee(calculatedFee);
            setTotalNED(total);
        } else {
            setFee(0);
            setTotalNED(0);
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);
        calculateFeeAndTotal(value);
    };

    const handlePredefinedAmount = (predefinedAmount) => {
        setAmount(predefinedAmount);
        calculateFeeAndTotal(predefinedAmount);
    };

    const handlePaymentButtonClick = async () => {
        if (totalNED > 0) {
            try {
                const response = await fetch(SITE_URL + '/api/create-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount: totalNED }), // Send the amount to your server
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    console.error('Error creating payment intent:', errorMessage);
                    setError('Failed to create payment intent. Please try again.');
                    return;
                }

                const data = await response.json();
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error('Error creating payment intent:', error);
                setError('Failed to create payment intent. Please try again.');
            }
        } else {
            setError('Please enter a valid amount.');
        }
    };

    const rampAppearance = {
        theme: 'dark',
    };

    const breadcrumbsLinks = [
        { label: 'Home', path: '/' },
        { label: 'Carteira', path: '/wallet' },
        { label: 'Comprar NED', path: '/buy' },
    ];

    return (
        <>
            <Helmet>
                <title>{t('Comprar NED')}</title>
                <meta name='description' content={t('Troca Euros por $NED')} />
            </Helmet>
            <Breadcrumbs links={breadcrumbsLinks} />
            <div className="px-4 mt-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">{t('Comprar NED')}</h1>
                    <span className="text-md inline-flex items-center gap-2">
                        <span className="btn p-1 rounded-lg">
                            <SiPolygon className="text-sm" />
                        </span>
                        <span className="text-gray-400 font-normal">
                        10.034 POL
                        </span>
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 bg-secondary border rounded-lg gap-6">
                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    <div className="w-full relative p-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                                {t('Valor em EUR')}
                            </label>
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={handleAmountChange}
                                required
                                className="py-2 px-4 w-full rounded-md border"
                                placeholder="Introduza o valor em EUR"
                            />
                        </div>

                        <div className="mb-4">
                            <h2 className="text-lg font-semibold mb-2">{t('Predefined Amounts')}</h2>
                            <div className="flex flex-wrap gap-2">
                                {[10, 25, 50, 100, 250, 500].map((predefinedAmount) => (
                                    <button
                                        key={predefinedAmount}
                                        type="button"
                                        onClick={() => handlePredefinedAmount(predefinedAmount)}
                                        className="btn-alt border rounded-md px-4 py-2"
                                    >
                                        {predefinedAmount} EUR
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    <div className="w-full relative p-6">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold mb-2">{t('Transaction Summary')}</h2>
                            <p>{t('Network Fee')}: {fee.toFixed(2)} EUR</p>
                            <p>{t('POL Tokens Required')}: {totalNED.toFixed(3)} POL</p>
                            <p>{t('NED Tokens Received')}: {totalNED.toFixed(3)} NED</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handlePaymentButtonClick}
                                className="w-full btn-primary rounded-md px-4 py-2"
                            >
                                Trocar
                            </button>
                            <button
                                onClick={handlePaymentButtonClick}
                                className="w-full rounded-md px-4 py-2"
                            >
                                Comprar MATIC
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div className="w-full px-4 relative">
                <div className="flex mb-4">
                    <h2 className="text-2xl font-bold">Comprar MATIC</h2>
                </div>
                {message && <div id="onramp-message">{message}</div>}

                <CryptoElements stripeOnramp={stripeOnrampPromise}>
                    {clientSecret && (
                        <OnrampElement
                            id="onramp-element"
                            clientSecret={clientSecret}
                            appearance={rampAppearance}
                            onChange={onChange}
                        />
                    )}
                </CryptoElements>
            </div>
        </>
    );
};

export default Buy;