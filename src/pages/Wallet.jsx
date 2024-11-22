import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { GiWallet } from "react-icons/gi";
import { IoQrCode, IoSend } from "react-icons/io5";
import { MdCurrencyExchange } from "react-icons/md";
import { IoIosRefresh } from "react-icons/io";
import Cookies from 'js-cookie';
import Breadcrumbs from "../components/Breadcrumbs";
import WalletSkeleton from '../components/skeleton/WalletSkeleton';
import { fetchUserData } from '../data/db';
import { WEB3_TOKEN_SYMBOL, SITE_FIAT_CURRENCY_CODE } from '../data/config';
import {tokenPrice, getBalance} from "../data/web3";

const Wallet = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userBalance, setUserBalance] = useState("0.00");
    const [userBalanceFiat, setUserBalanceFiat] = useState("0.00");

    const isLoggedIn = Cookies.get('isLoggedIn');
    const walletId = Cookies.get('uid');

    if (!isLoggedIn || !walletId) {
        navigate('/connect');
    }

    useEffect(() => {

        const fetchUserInfo = async () => {
            try {
                const userData = await fetchUserData(walletId);
                if (userData) {
                    const fetchedBalance = await getBalance(userData.wallet_pk);
                    const currentTokenPrice = await tokenPrice();
                    const priceInEUR = (fetchedBalance * currentTokenPrice).toFixed(2); // Conversion from NED to EUR
                    setUserInfo(userData);
                    setUserBalance(fetchedBalance);
                    setUserBalanceFiat(priceInEUR);
                } else {
                    setError('User  data not found.');
                }
            } catch (fetchError) {
                setError('Failed to fetch user data.');
            } finally {

            }
        };

        fetchUserInfo();


    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Check if userInfo and userBalance are not null
            if (userInfo && userBalance) {
                setLoading(false);
                clearInterval(intervalId); // Stop the interval
            }
        }, 1000); // Check every 1 second

        // Cleanup function to clear the interval on component unmount
        return () => clearInterval(intervalId);
    }, [userInfo, userBalance]); // Add dependencies to the effect


    // Define breadcrumbsLinks only after items are fetched
    const breadcrumbsLinks = [
        { label: 'Home', path: '/' },
        { label: 'Carteira', path: '/wallet' },
    ];

    if (loading) {
        return <WalletSkeleton />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <Helmet>
                <title>{t('Carteira')}</title>
                <meta name='description' content={t('Manage your wallet')} />
            </Helmet>
            <Breadcrumbs links={breadcrumbsLinks} />
            <div className="px-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Carteira</h1>
                    <button className="bg-transparent text-color inline-flex flex-nowrap gap-1 items-center text-sm">
                        <IoIosRefresh /> Atualizar
                    </button>
                </div>
                <div className="bg-secondary border p-4 rounded-lg mb-4">
                    <span className="font-normal text-xs md:text-sm text-gray-600 flex flex-nowrap items-center gap-1 mb-2">
                    <GiWallet className="text-gray-500" />
                    {userInfo?.wallet_pk && userInfo.wallet_pk.length > 10 ? `${userInfo.wallet_pk.slice(0, 5)}...${userInfo.wallet_pk.slice(-4)}` : userInfo.wallet_pk}
                    </span>
                    <h2 className="text-3xl font-bold mb-2">{parseFloat(userBalance).toFixed(2)} {WEB3_TOKEN_SYMBOL}</h2>
                    <div className="flex items-center justify-between">
                        <span>Saldo Disponível</span>
                        <span className="text-primary">≃ {userBalanceFiat} {SITE_FIAT_CURRENCY_CODE}</span>
                    </div>
                    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <Link to="/buy" className="rounded-lg h-16 border bg-color flex flex-col gap-2 items-center justify-center p-2 text-sm shadow-sm">
                            <MdCurrencyExchange className="text-2xl" />
                            <span className="font-semibold">Comprar {WEB3_TOKEN_SYMBOL}</span>
                        </Link>
                        <Link to="/receive" className="rounded-lg h-16 border bg-color flex flex-col gap-2 items-center justify-center p-2 text-sm shadow-sm">
                            <IoQrCode className="text-2xl" />
                            <span className="font-semibold">Receber</span>
                        </Link>
                        <Link to="/send" className="rounded-lg h-16 border bg-color flex flex-col gap-2 items-center justify-center p-2 text-sm shadow-sm">
                            <IoSend className="text-2xl" />
                            <span className="font-semibold">Enviar</span>
                        </Link>
                        <Link to="/withdraw" className="rounded-lg h-16 border bg-color flex flex-col gap-2 items-center justify-center p-2 text-sm shadow-sm">
                            <IoSend className="text-2xl" />
                            <span className="font-semibold">Levantar</span>
                        </Link>
                    </div>
                </div>

            </div>

            {/* User Latest Transactions Section */}
            <div className="px-4 mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Latest Transactions</h1>
                    <Link to="/wallet" className="hover:text-primary">
                        <span>Ver todos →</span>
                    </Link>
                </div>
                <div className="p-0 w-full">
                    <ul className="flex flex-col gap-2">
                        <li className="flex justify-between p-4 border bg-secondary rounded-md">
                            <span>Transaction 1</span>
                            <span>-0.500 {WEB3_TOKEN_SYMBOL}</span>
                        </li>
                        <li className="flex justify-between p-4 border bg-secondary rounded-md">
                            <span>Transaction 2</span>
                            <span>-0.500 {WEB3_TOKEN_SYMBOL}</span>
                        </li>
                        <li className="flex justify-between p-4 border bg-secondary rounded-md">
                            <span>Transaction 3</span>
                            <span>-0.500 {WEB3_TOKEN_SYMBOL}</span>
                        </li>
                    </ul>
                </div>
            </div>

        </>
    );
};

export default Wallet;