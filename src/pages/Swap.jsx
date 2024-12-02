import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
 import { tokenPrice, netPrice } from '../data/web3';
import Breadcrumbs from "../components/Breadcrumbs";
import Cookies from 'js-cookie';
import {fetchUserData } from '../data/db.js';

const Swap = () => {
    const { t } = useTranslation();
    const [walletAddress, setWalletAddress] = useState('');
    const [error, setError] = useState(true);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [fetchingUserData, setFetchingUserData] = useState(true);
    const [currentBalance, setCurrentBalance] = useState('0.000');
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
                    setCurrentBalance(data.last_balance || '0.000'); // Assuming balance is part of user data
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

    // Define breadcrumbsLinks
    const breadcrumbsLinks = [
        { label: 'Home', path: '/' },
        { label: 'Carteira', path: '/wallet' },
        { label: 'Trocar', path: '/swap' },
    ];

    if(loading) {
        return (
            <div>Loading..</div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{t('Trocar Crypto')}</title>
                <meta name='description' content={t('Swap your funds via crypto network')} />
            </Helmet>
            <Breadcrumbs links={breadcrumbsLinks} />

            {/* Hero Section */}
            <div className="px-4">
                <div className="bg-primary text-white py-8 px-4 rounded-lg">
                    <div className="container mx-auto text-center">
                        <h1 className="text-3xl font-bold mb-2 capitalize">{t('Troca a tua crypto')}</h1>
                        <p className="text-lg">{t('Troca fácilmente os teus ativos na tua carteira de cryptomoedas.')}</p>
                    </div>
                </div>
            </div>

            <div className="px-4 mt-6">
                {/* Swap Tokens Form */}
                <form className="bg-secondary border rounded-lg p-6 mb-6">
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    {fetchingUserData ? (
                        <div className="text-center py-4">Loading user data...</div>
                    ) : (
                        <div className="w-full relative">
                            // SWAP TOKENS FORM HERE, swap from NED to POL or vice-versa.
                        </div>
                    )}
                </form>
            </div>

        </>
    );
}

export default Swap;