import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { fetchUserData } from '../data/db';
import { QRCodeSVG } from 'qrcode.react';
import Breadcrumbs from "../components/Breadcrumbs";

const Receive = () => {
    const { t } = useTranslation();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const walletId = Cookies.get('uid');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchUserData(walletId);
                if (data) {
                    setUserInfo(data);
                } else {
                    setError('User  data not found.');
                }
            } catch (fetchError) {
                setError('Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [walletId]);

    // Define breadcrumbsLinks only after items are fetched
    const breadcrumbsLinks = [
        { label: 'Home', path: '/' },
        { label: 'Carteira', path: '/wallet' },
        { label: 'Receber', path: '/receive' },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <>
            <Helmet>
                <title>{t('Receive Funds')}</title>
                <meta name='description' content={t('Receive funds to your wallet')} />
            </Helmet>
            <Breadcrumbs links={breadcrumbsLinks} />
            <div className="px-4 mt-6">
                <h1 className="text-2xl font-bold mb-4">{t('Receive Funds')}</h1>
                <div className="bg-secondary border rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">{t('Your Wallet Address')}</h2>
                    <p className="text-gray-600">{userInfo.wallet_pk}</p>
                    <div className="mt-4">
                        <QRCodeSVG value={userInfo.wallet_pk} size={256} /> {/* QR Code for wallet address */}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{t('Scan the QR code to receive funds')}</p>
                </div>
            </div>
        </>
    );
};

export default Receive;