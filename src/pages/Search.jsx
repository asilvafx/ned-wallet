import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Search = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const query = new URLSearchParams(useLocation().search);
    const searchQuery = query.get('query');
    const city = query.get('city');
    const type = query.get('type');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Replace with your actual API endpoint
                const response = await fetch(`https://api.example.com/search?query=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(city)}&type=${encodeURIComponent(type)}`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setItems(data.items); // Adjust based on your API response structure
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery || city || type) {
            fetchData();
        }
    }, [searchQuery, city, type]);

    return (
        <div>
            <Helmet>
                <title>Resultados da Pesquisa</title>
                <meta name="description" content={`Resultados para "${searchQuery}" em ${city || 'todas as cidades'} ${type ? `(${type})` : ''}`} />
            </Helmet>

            <Header />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Resultados da Pesquisa</h1>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {items.length > 0 ? (
                    <ul className="space-y-4">
                        {items.map((item) => (
                            <li key={item.id} className="p-4 border rounded-lg shadow">
                                <h2 className="text-xl font-semibold">{item.title}</h2>
                                <p>{item.description}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading && <p>Nenhum resultado encontrado.</p>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Search;