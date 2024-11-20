import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { updateUserBalance } from '../data/db';
import Breadcrumbs from "../components/Breadcrumbs";

const Buy = () => {
    const { t } = useTranslation();
    const [amount, setAmount] = useState('');
    const [fee, setFee] = useState(0);
    const [totalNED, setTotalNED] = useState(0);
    const [error, setError] = useState('');

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);
        calculateFeeAndTotal(value);
    };

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

    const handlePredefinedAmount = (predefinedAmount) => {
        setAmount(predefinedAmount);
        calculateFeeAndTotal(predefinedAmount);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!amount || totalNED <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        // Call API to update user balance (this is a placeholder, implement according to your API)
        const result = await updateUserBalance({ nedTokens: totalNED });

        if (result) {
            alert('Exchange successful! You have received NED tokens.');
            setAmount(''); // Reset the amount
            setFee(0);
            setTotalNED(0);
        } else {
            setError('Failed to complete the exchange. Please try again.');
        }
    };

    // Define breadcrumbsLinks only after items are fetched
    const breadcrumbsLinks = [
        { label: 'Home', path: '/' },
        { label: 'Carteira', path: '/wallet' },
        { label: 'Comprar NED', path: '/buy' },
    ];

    return (
        <>
            <Helmet>
                <title>{t('Buy NED Tokens')}</title>
                <meta name='description' content={t('Exchange Euros for NED tokens')} />
            </Helmet>
            <Breadcrumbs links={breadcrumbsLinks} />
            <div className="px-4 mt-6">
                <h1 className="text-2xl font-bold mb-4">{t('Buy NED Tokens')}</h1>
                <form onSubmit={handleSubmit} className="bg-secondary border rounded-lg p-6 mb-6">
                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                            {t('Amount in EUR')}
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={handleAmountChange}
                            required
                            className="py-2 px-4 w-full rounded-md border"
                            placeholder="Enter amount in EUR"
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
                                    className="bg-primary text-white rounded-md px-4 py-2"
                                >
                                    {predefinedAmount} EUR
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">{t('Transaction Summary')}</h2>
                        <p>{t('Fee')}: {fee.toFixed(2)} EUR</p>
                        <p>{t('Total NED Tokens Received')}: {totalNED.toFixed(2)} NED</p>
                    </div>

                    <button
                        type="submit"
                        className="bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        { t('Exchange')}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Buy;