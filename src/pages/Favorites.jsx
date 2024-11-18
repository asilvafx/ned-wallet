import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ItemCard from '../components/ItemCard';
import { fetchItems, fetchUserFavorites } from "../data/db";
import Cookies from "js-cookie";
import NotLoggedIn from '../components/NotLoggedIn';
import {Link} from "react-router-dom";

const Favorites = () => {
    const isLoggedIn = Cookies.get('isLoggedIn'); // Check if the user is logged in
    const [items, setItems] = useState([]); // Correctly initialize the items state
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        const fetchFavoritesFromApi = async () => {
            if (!isLoggedIn) {
                setLoading(false); // If not logged in, stop loading
                return;
            }
            try {
                const favoritesData = await fetchUserFavorites(); // Fetch user favorites
                setItems(favoritesData); // Set the fetched favorites
            } catch (fetchError) {
                setError('Failed to fetch favorites.'); // Handle fetch error
            } finally {
                setLoading(false); // Stop loading after fetching
            }
        };

        fetchFavoritesFromApi(); // Call the fetch function
    }, [isLoggedIn]); // Run effect when isLoggedIn changes

    if (loading) {
        return <div>Loading...</div>; // Show loading state
    }

    if (!isLoggedIn) {
        return (
            <>
                <NotLoggedIn text="Por favor, inicia sessão para veres os teus artigos e serviços favoritos" />
            </>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>; // Show error message if any
    }

    return (
        <>
            <Helmet>
                <title>My Favorites</title>
                <meta name="description" content="View your favorite items" />
            </Helmet>
            <div className="p-4 mt-6">
                <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))
                    ) : (
                        <div className="text-start text-gray-500">
                            <p>Não há nada para mostrar. A tua lista de favoritos está vazia.</p>
                            <Link to="/" >
                                <button className="btn mt-4 py-2 px-4 rounded-md">
                                    Ir para a Página Inicial
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Favorites;