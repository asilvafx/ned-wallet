import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {Helmet} from "react-helmet-async";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ItemView = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const item = {
        1: { title: 'Item 1', author: 'Author 1', price: '0.50 NED', imageUrl: 'https://via.placeholder.com/150', description: 'Description for Item 1' },
        2: { title: 'Item 2', author: 'Author 2', price: '1.00 NED', imageUrl: 'https://via.placeholder.com/150', description: 'Description for Item 2' },
        3: { title: 'Item 3', author: 'Author 3', price: '1.50 NED', imageUrl: 'https://via.placeholder.com/150', description: 'Description for Item 3' },
        4: { title: 'Item 4', author: 'Author 4', price: '2.00 NED', imageUrl: 'https://via.placeholder.com/150', description: 'Description for Item 4' },
    }[id];

    if (!item) {
        return <div>Item not found</div>;
    }

    return (
        <>
        <Helmet>
            <title>{t('seo_title')}</title>
            <meta name='description' content={t('seo_description')} />
        </Helmet>

        <Header />
        <div className="p-4">
            <h1 className="text-2xl font-bold">{item.title}</h1>
            <img src={item.imageUrl} alt={item.title} className="w-full h-64 object-cover rounded-md" />
            <p className="mt-2 text-lg font-semibold">{item.price}</p>
            <p className="mt-2">{item.description}</p>
            <p className="mt-2 text-sm text-gray-600">By {item.author}</p>
        </div>

        <Footer />
        </>
    );
}

export default ItemView;