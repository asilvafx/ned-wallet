import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { GiWallet } from "react-icons/gi";
import Cookies from 'js-cookie';
import { IoQrCode, IoSend } from "react-icons/io5";
import { MdCurrencyExchange } from "react-icons/md";
import { fetchUserData } from '../data/db';

const Wallet = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isLoggedIn = Cookies.get('isLoggedIn');
                const walletId = Cookies.get('uid');

                if (!isLoggedIn || !walletId) {
                    navigate('/connect');
                } else {
                    const userData = await fetchUserData(walletId);
                    if (userData) {
                        setUserInfo(userData); // Only set userInfo if userData is available
                    } else {
                        setError('User  data not found.');
                    }
                }
            } catch (fetchError) {
                setError('Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]); // Add navigate as a dependency

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <Helmet>
                <title>{t('My Wallet')}</title>
                <meta name='description' content={t('Manage your wallet')} />
            </Helmet>

            <div className="px-4 mt-6">
                <h1 className="text-xl mb-4">My Wallet</h1>
                <div className="bg-secondary border rounded-lg p-4 gap-2 w-full flex flex-col justify-center items-center text-center">
                    <div className="w-full relative mb-8">
                        <span className="font-normal text-xs md:text-sm text-gray-600 flex flex-nowrap items-center gap-1 mt-2 absolute left-0 top-0">
                            <GiWallet />
                            {userInfo?.wallet_pk && userInfo.wallet_pk.length > 10 ? `${userInfo.wallet_pk.slice(0, 5)}...${userInfo.wallet_pk.slice(-4)}` : userInfo.wallet_pk}
                        </span>
                    </div>
                    <span className="text-lg md:text-xl font-semibold">{userInfo?.last_balance ? parseFloat(userInfo.last_balance).toFixed(4) : "0.0000"} NED</span>
                    <span className="text-sm font-normal mb-4 text-primary">≃ 0.00 EUR</span>

                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="rounded-lg h-16 border bg-color flex flex-col gap-2 items-center justify-center p-2 text-sm shadow-sm">
                            <MdCurrencyExchange className="text-2xl" />
                            <span className="font-semibold">Comprar NED</span>
                        </div>
                        <div className="rounded-lg h-16 border bg-color flex flex-col gap-2 items-center justify-center p-2 text-sm shadow-sm">
                            <IoQrCode className="text-2xl" />
                            <span className="font-semibold">Receber</span>
                        </div>
                        <div className="rounded-lg h-16 border bg-color flex flex-col gap-2 items-center justify-center p-2 text-sm shadow-sm">
                            <IoSend className="text-2xl" />
                            <span className="font-semibold">Enviar</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Latest Transactions Section */}
            <div className="px-4 mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl">Latest Transactions</h1>
                    <Link to="/wallet" className="hover:text-primary">
                        <span>Ver todos →</span>
                    </Link>
                </div>
                <div className="bg-secondary border rounded-lg p-4 w-full">
                    <ul>
                        <li className="flex justify-between py-2 border-b">
                            <span>Transaction 1</span>
                            <span>-0.500 NED</span>
                        </li>
                        <li className="flex justify-between py-2 border-b">
                            <span>Transaction 2</span>
                            <span>-1.000 NED</span>
                        </li>
                        <li className="flex justify-between py-2 border-b">
                            <span>Transaction 3</span>
                            <span>+2.000 NED</span>
                        </li>
                    </ul>
                </div>
            </div>

        </>
    );
};

export default Wallet;