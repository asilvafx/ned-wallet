import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import Cookies from 'js-cookie';
import { updateUserBalance } from '../data/db';
import Breadcrumbs from "../components/Breadcrumbs";

const Send = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const walletId = Cookies.get('uid');

    const handleSendTokens = async (e) => {
        e.preventDefault();
        setError('');

        // Validate input
        if (!recipientAddress || !amount) {
            setError('Please enter both recipient address and amount.');
            return;
        }

        // Call API to update user balance (this is a placeholder, implement according to your API)
        const result = await updateUserBalance(walletId, { recipientAddress, amount });

        if (result) {
            alert('Tokens sent successfully!');
            navigate('/'); // Redirect to home or wallet page
        } else {
            setError('Failed to send tokens. Please try again.');
        }
    };

    const handleScanSuccess = (data) => {
        if (data) {
            setRecipientAddress(data); // Set scanned QR code data as recipient address
            setShowScanner(false); // Close the scanner
        }
    };

    const handleScanError = (err) => {
        console.error(err);
    };

    // Define breadcrumbsLinks only after items are fetched
    const breadcrumbsLinks = [
        { label: 'Home', path: '/' },
        { label: 'Carteira', path: '/wallet' },
        { label: 'Send', path: '/send' },
    ];

    return (
        <>
            <Helmet>
                <title>{t('Send Tokens')}</title>
                <meta name='description' content={t('Send tokens to another wallet')} />
            </Helmet>
            <Breadcrumbs links={breadcrumbsLinks} />
            <div className="px-4 mt-6">
                <h1 className="text-2xl font-bold mb-4">{t('Send Tokens')}</h1>
                <form onSubmit={handleSendTokens} className="bg-secondary border rounded-lg p-6 mb-6">
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipientAddress">
                            {t('Recipient Address')}
                        </label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                id="recipientAddress"
                                value={recipientAddress}
                                onChange={(e) => setRecipientAddress(e.target.value)}
                                required
                                className="py-2 px-4 w-full rounded-md border"
                                placeholder="Enter wallet address"
                            />
                            <button
                                type="button"
                                onClick={() => setShowScanner(true)}
                                className="ml-2 bg-primary text-white rounded-md px-4 py-2"
                            >
                                {t('Scan QR')}
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                            {t('Amount')}
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="py-2 px-4 w-full rounded-md border"
                            placeholder="Enter amount to send"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {t('Send Tokens')}
                    </button>
                </form>
            </div>

            {showScanner && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <Scanner
                            scanDelay={300}
                            onError={handleScanError}
                            onScan={handleScanSuccess}
                            style={{ width: '300px' }}
                        />
                        <button
                            onClick={() => setShowScanner(false)}
                            className="mt-4 bg-red-500 text-white rounded-md px-4 py-2"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Send;