import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { withdrawFunds, fetchUserData } from '../data/db'; // Import the necessary functions
import { tokenPrice, netPrice } from '../data/web3'; // Import token price function
import Breadcrumbs from "../components/Breadcrumbs";
import Cookies from 'js-cookie';

const Withdraw = () => {
    const { t } = useTranslation();
    const [walletAddress, setWalletAddress] = useState('');
    const [points, setPoints] = useState(''); // Points in NED
    const [pointsEUR, setPointsEUR] = useState(''); // Points in EUR
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [fetchingUserData, setFetchingUserData] = useState(true);
    const [currentBalance, setCurrentBalance] = useState('0.00');
    const [currentTokenPrice, setCurrentTokenPrice] = useState(0); // State for current token price
    const [networkPrice, setNetworkPrice] = useState(0); // State for current token price
    const [finalPrice, setFinalPrice] = useState(0); // State for current token price

    const isLoggedIn = Cookies.get('isLoggedIn');
    const walletId = Cookies.get('uid');

    useEffect(() => {
        const loadTokenPrice = async () => {
            try {
                const fetchTokenPrice = await tokenPrice();
                setCurrentTokenPrice(fetchTokenPrice);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        loadTokenPrice();

        const loadNetPrice = async () => {
            try {
                const fetchNetPrice = await netPrice('euro-coin', 'usd');
                setNetworkPrice(fetchNetPrice);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        loadNetPrice();

    }, []);

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
                    setCurrentBalance(data.last_balance || '0.0000'); // Assuming balance is part of user data
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

    // Function to handle NED input change
    const handleNEDChange = (e) => {
        const value = e.target.value;
        setPoints(value);
        setPointsEUR((value * currentTokenPrice).toFixed(2)); // Convert to EUR
        const final_price = parseFloat(networkPrice*(value * currentTokenPrice)).toFixed(2);
        setFinalPrice(final_price);
    };

    // Function to handle EUR input change
    const handleEURChange = (e) => {
        const value = e.target.value;
        setPointsEUR(value);
        setPoints((value / currentTokenPrice).toFixed(2)); // Convert to NED
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setError('');
        setProcessing(true);

        // Validate input
        if (!walletAddress || !points) {
            setError('Please enter both wallet address and points to withdraw.');
            setProcessing(false);
            return;
        }

        try {
            const result = await withdrawFunds(walletAddress, points);
            if (result) {
                toast.success('Withdrawal successful!');
                setWalletAddress('');
                setPoints('');
                setPointsEUR('');
            } else {
                setError('Failed to withdraw funds. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred while processing your request.');
        } finally {
            setProcessing(false);
        }
    };

    // Define breadcrumbsLinks
    const breadcrumbsLinks = [
        { label: 'Home', path: '/' },
        { label: 'Carteira', path: '/wallet' },
        { label: 'Levantar', path: '/withdraw' },
    ];

    if(loading) {
        return (
            <div>Loading..</div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{t('Withdraw Funds')}</title>
                <meta name='description' content={t('Withdraw your funds via crypto network')} />
            </Helmet>
            <Breadcrumbs links={breadcrumbsLinks} />

            {/* Hero Section */}
            <div className="px-4">
                <div className="bg-primary text-white py-8 px-4 rounded">
                    <div className="container mx-auto text-center">
                        <h1 className="text-3xl font-bold mb-2 capitalize">{t('Troca os teus NED')}</h1>
                        <p className="text-lg">{t('Recebe fácilmente os teus fundos na tua carteira de cryptomoedas.')}</p>
                    </div>
                </div>
            </div>

            <div className="px-4 mt-6">
                {fetchingUserData ? (
                    <div className="text-center py-4">Loading user data...</div>
                    ) : (
                    <div className="bg-secondary border rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">{t('Saldo Disponível:')}</h2>
                    <span className="text-xl font-bold">{currentBalance} NED</span>
                    </div>
                    </div>
                    )}
                <h1 className="text-2xl font-bold mb-4">{t('Levantar Crypto')}</h1>
                <form onSubmit={handleWithdraw} className="bg-secondary border rounded-lg p-6 mb-6">
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="walletAddress">
                            {t('Destinatário')}
                        </label>
                        <input
                            type="text"
                            id="walletAddress"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            required
                            className="py-2 px-4 w-full rounded-md border"
                            placeholder={t('0x0000001..')}
                        />
                    </div>
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amountNED">Quantidade (em NED)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="amountNED"
                                    value={points}
                                    onChange={handleNEDChange}
                                    placeholder="0.0000"
                                    required
                                    className="py-2 px-4 w-full rounded-md border"
                                />
                                <span className="text-gray-500 absolute top-2 right-2">$NED</span>
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amountEUR">Quantidade (em EUR)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="amountEUR"
                                    value={pointsEUR}
                                    onChange={handleEURChange}
                                    placeholder="0.00"
                                    required
                                    className="py-2 px-5 w-full rounded-md border"
                                />
                                <span className="text-gray-500 absolute top-2 right-2">€</span>
                                <span className="text-gray-500 top-2 left-2 absolute">≃</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-4 my-4">
                        <span className="block text-gray-700 text-sm font-bold">Irás receber</span>
                        <span className="text-xl">≃ {finalPrice} USDT</span>
                        <button
                            type="submit"
                            className={`bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={processing}
                        >
                            {processing ? t('A Processar...') : t('Retirar')}
                        </button>
                    </div>


                </form>
            </div>
        </>
    );
}

export default Withdraw;