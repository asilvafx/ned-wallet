import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { withdrawFunds, fetchUserData } from '../data/db'; // Import the necessary functions
import Breadcrumbs from "../components/Breadcrumbs";
import Cookies from 'js-cookie';

const Withdraw = () => {
    const {t} = useTranslation();
    const [walletAddress, setWalletAddress] = useState('');
    const [points, setPoints] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [fetchingUserData, setFetchingUserData] = useState(true);
    const [currentBalance, setCurrentBalance] = useState('0.00');

    const isLoggedIn = Cookies.get('isLoggedIn');
    const walletId = Cookies.get('uid');

    useEffect(() => {
        if (!isLoggedIn || !walletId) {
            toast.error('You must be logged in to access this page.');
            return;
        }

        const fetchUserDataAsync = async () => {
            try {
                const data = await fetchUserData(walletId);
                if (data) {
                    setUserInfo(data);
                    setCurrentBalance(data.balance || '0.00'); // Assuming balance is part of user data
                } else {
                    setError('User  data not found.');
                }
            } catch (error) {
                console.error(error);
                setError('Failed to fetch user data.');
            } finally {
                setFetchingUserData(false);
            }
        };

        fetchUserDataAsync();
    }, [isLoggedIn, walletId]);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate input
        if (!walletAddress || !points) {
            setError('Please enter both wallet address and points to withdraw.');
            setLoading(false);
            return;
        }

        try {
            const result = await withdrawFunds(walletAddress, points);
            if (result) {
                toast.success('Withdrawal successful!');
                setWalletAddress('');
                setPoints('');
            } else {
                setError('Failed to withdraw funds. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred while processing your request.');
        } finally {
            setLoading(false);
        }
    };

    // Define breadcrumbsLinks
    const breadcrumbsLinks = [
        {label: 'Home', path: '/'},
        {label: 'Withdraw', path: '/withdraw'},
    ];

    return (
        <>
            <Helmet>
                <title>{t('Withdraw Funds')}</title>
                <meta name='description' content={t('Withdraw your funds via crypto network')}/>
            </Helmet>
            <Breadcrumbs links={breadcrumbsLinks}/>

            {/* Hero Section */}
            <div className="px-4">
                <div className="bg-primary text-white py-8 px-4 rounded">
                    <div className="container mx-auto text-center">
                        <h1 className="text-3xl font-bold mb-2">{t('Withdraw Your Funds')}</h1>
                        <p className="text-lg">{t('Easily withdraw your NED points to your crypto wallet.')}</p>
                    </div>
                </div>
            </div>

            <div className="px-4 mt-6">
                {fetchingUserData ? (
                    <div className="text-center py-4">Loading user data...</div>
                    ) : (
                    <div className="bg-secondary border rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">{t('Current NED Balance:')}</h2>
                            <span className="text-xl font-bold">{currentBalance} NED</span>
                        </div>
                    </div>
                    )}
                <h1 className="text-2xl font-bold mb-4">{t('Withdraw Funds')}</h1>
                <form onSubmit={handleWithdraw} className="bg-secondary border rounded-lg p-6 mb-6">
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="walletAddress">
                            {t('Recipient Wallet Address')}
                        </label>
                        <input
                            type="text"
                            id="walletAddress"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            required
                            className="py-2 px-4 w-full rounded-md border"
                            placeholder={t('Enter recipient wallet address')}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="points">
                            {t('Points to Withdraw')}
                        </label>
                        <input
                            type="number"
                            id="points"
                            value={points}
                            onChange={(e) => setPoints(e.target.value)}
                            required
                            className="py-2 px-4 w-full rounded-md border"
                            placeholder={t('Enter amount of points to withdraw')}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? t('Processing...') : t('Withdraw')}
                    </button>
                </form>
            </div>
        </>
    );
}

export default Withdraw;
