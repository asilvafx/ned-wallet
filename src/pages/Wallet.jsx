import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { GiWallet } from "react-icons/gi";
import Cookies from 'js-cookie';
import { IoQrCode, IoSend } from "react-icons/io5";
import { MdCurrencyExchange } from "react-icons/md";
import { fetchUserData } from '../data/db';
import { IoIosRefresh } from "react-icons/io";
import Breadcrumbs from "../components/Breadcrumbs";

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
                    console.log(userData);
                }
            } catch (fetchError) {
                setError('Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]); // Add navigate as a dependency

    // Define breadcrumbsLinks only after items are fetched
    const breadcrumbsLinks = [
        { label: 'Home', path: '/' },
        { label: 'Carteira', path: '/wallet' },
    ];

    if (loading) {
        return <div>Loading...</div>;
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
            <div className="px-4 mt-6">
                <h1 className="text-xl mb-4">Carteira</h1>
                <div className="bg-secondary border p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-2">
                    <span className="font-normal text-xs md:text-sm text-gray-600 flex flex-nowrap items-center gap-1">
                    <GiWallet className="text-gray-500" />
                    {userInfo?.wallet_pk && userInfo.wallet_pk.length > 10 ? `${userInfo.wallet_pk.slice(0, 5)}...${userInfo.wallet_pk.slice(-4)}` : userInfo.wallet_pk}
                    </span>
                     <Link to={`/wallet`} className="inline-flex flex-nowrap gap-1 items-center text-sm">
                         <IoIosRefresh /> Atualizar
                     </Link>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">18.4100 NED</h2>
                    <div className="flex items-center justify-between">
                        <span>Saldo Disponível</span>
                        <span className="text-primary">≃ 232.5 EUR</span>
                    </div>
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="rounded-lg h-16 border bg-color flex flex-col gap-2 items-center justify-center p-2 text-sm shadow-sm">
                            <MdCurrencyExchange className="text-2xl" />
                            <span className="font-semibold">Comprar NED</span>
                        </div>
                        <Link to="/receive" className="rounded-lg h-16 border bg-color flex flex-col gap-2 items-center justify-center p-2 text-sm shadow-sm">
                            <IoQrCode className="text-2xl" />
                            <span className="font-semibold">Receber</span>
                        </Link>
                        <Link to="/send" className="rounded-lg h-16 border bg-color flex flex-col gap-2 items-center justify-center p-2 text-sm shadow-sm">
                            <IoSend className="text-2xl" />
                            <span className="font-semibold">Enviar</span>
                        </Link>
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
                <div className="p-0 w-full">
                    <ul className="flex flex-col gap-4">
                        <li className="flex justify-between p-4 border bg-secondary rounded-md">
                            <span>Transaction 1</span>
                            <span>-0.500 NED</span>
                        </li>
                        <li className="flex justify-between p-4 border bg-secondary rounded-md">
                            <span>Transaction 2</span>
                            <span>-0.500 NED</span>
                        </li>
                        <li className="flex justify-between p-4 border bg-secondary rounded-md">
                            <span>Transaction 3</span>
                            <span>-0.500 NED</span>
                        </li>
                    </ul>
                </div>
            </div>

        </>
    );
};

export default Wallet;