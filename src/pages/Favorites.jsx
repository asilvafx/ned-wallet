import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ItemCard from '../components/ItemCard';
import { fetchItems, fetchUserFavorites } from "../data/db";

const Favorites = () => {
    // Filter items based on user favorites
    const favoriteItems = fetchUserFavorites.map(favorite =>
        fetchItems.find(item => item.uid === favorite.item)
    ).filter(item => item !== undefined); // Remove any undefined items

    return (
        <>
            <Helmet>
                <title>My Favorites</title>
                <meta name="description" content="View your favorite items" />
            </Helmet>
            <Header />
            <main className="p-4">
                <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteItems.length > 0 ? (
                        favoriteItems.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))
                    ) : (
                        <p>No favorite items found.</p>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Favorites;