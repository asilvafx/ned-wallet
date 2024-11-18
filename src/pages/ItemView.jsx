import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";
import { fetchItemData, fetchRelatedItems, likeItem, unlikeItem } from "../data/db"; // Import your like and unlike functions
import Breadcrumbs from '../components/Breadcrumbs';
import ItemCard from "../components/ItemCard";
import { FaRegHeart } from "react-icons/fa6";
import Avatar from "../components/Avatar";

const ItemView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [item, setItem] = useState(null);
    const [relatedItems, setRelatedItems] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLiked, setIsLiked] = useState(false); // State to track if the item is liked

    useEffect(() => {
        if (!id) {
            navigate('/'); // Redirect to home if id is not set
            return;
        }

        const fetchRelatedData = async () => {
            try {
                const fetchedRelatedItems = await fetchRelatedItems(id);
                if (fetchedRelatedItems) {
                    setRelatedItems(fetchedRelatedItems);
                }
            } catch (fetchError) {
                setError('Failed to fetch related items.');
            }
        };

        const fetchItem = async () => {
            try {
                const fetchedItem = await fetchItemData(id);
                if (!fetchedItem) {
                    setError('Produto/Serviço não encontrado.');
                } else {
                    // Ensure gallery is an array
                    if (typeof fetchedItem.gallery === 'string') {
                        fetchedItem.gallery = JSON.parse(fetchedItem.gallery); // Parse if it's a JSON string
                    }
                    if (!Array.isArray(fetchedItem.gallery)) {
                        fetchedItem.gallery = []; // Default to empty array if it's not
                    }
                    setItem(fetchedItem);
                    setIsLiked(fetchedItem.isLiked); // Assuming your fetched item has an isLiked property
                }
            } catch (fetchError) {
                setError('Failed to fetch the item.');
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedData();
        fetchItem();
    }, [id, navigate]);

    const handleLike = async () => {
        try {
            await likeItem(id); // Call the like function
            setIsLiked(true); // Update the state
        } catch (error) {
            console.error('Failed to like the item:', error);
        }
    };

    const handleUnlike = async () => {
        try {
            await unlikeItem(id); // Call the unlike function
            setIsLiked(false); // Update the state
        } catch (error) {
            console.error('Failed to unlike the item:', error);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`); // Redirect to search page with query
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div className="p-4 mt-6 text-center">
                <h2 className="text-lg font-semibold">{error}</h2>
                <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 rounded">
                    ← Voltar ao início
                </button>
                <form onSubmit={handleSearchSubmit} className="mt-10">
                    <input
                        type="text"
                        value ={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Pesquisar..."
                        className="border rounded px-4 py-2"
                    />
                    <button type="submit" className="ml-2 btn-primary px-4 py-2 rounded">
                        Buscar
                    </button>
                </form>
            </div>
        );
    }

    // Define breadcrumbsLinks only after item is fetched
    const breadcrumbsLinks = [
        { label: 'Home', path: '/' },
        { label: 'Anúncios', path: '/listings' },
        { label: item?.category || "NA", path: `/listings/${item?.category || ''}` },
        { label: item?.name || "NA", path: `/listing/${id}` },
    ];

    return (
        <>
            <Helmet>
                <title>{t('seo_title')}</title>
                <meta name='description' content={t('seo_description')} />
            </Helmet>
            <Breadcrumbs links={breadcrumbsLinks} />
            <div className="px-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">{item.name}</h1>
                    <button
                        onClick={isLiked ? handleUnlike : handleLike}
                        className={`inline-flex gap-2 items-center px-4 py-2 rounded ${isLiked ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
                    >
                        <FaRegHeart />
                        {isLiked ? 'Unlike' : 'Like'}
                    </button>
                </div>

                {/* Slider for gallery images */}
                {item.gallery.length > 0 ? (
                    <div className="relative w-full h-64"> {/* Container for the slider */}
                        {item.gallery.map((url, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out`} // Use absolute positioning for overlapping
                            >
                                <div className="flex items-center justify-center h-full"> {/* Center the image */}
                                    <img src={url} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <img src={item.cover} alt={item.name} className="w-full h-64 object-cover rounded-md mb-4" />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-nowrap items-center gap-2">
                            <p className="text-lg font-semibold">{item.price} NED</p>
                            <span className="text-gray-500 text-sm">
                                ≃ 0.00 EUR
                            </span>
                        </div>
                        <p>{item.description}</p>
                        {item.tags && Array.isArray(item.tags) && item.tags.length > 0 ? (
                            <div className="grid grid-cols-4 gap-2">
                                {item.tags.map((tag, index) => (
                                    <span key={index} className="bg-gray-200 px-2 py-1 rounded">{tag}</span>
                                ))}
                            </div>
                        ) : null}
                        <p className="text-sm text-gray-600 inline-flex gap-1 items-center">Localização: {item.location}</p>
                        <p className="text-sm text-gray-600">Categoria: {item.category}</p>

                        {/* Badges for service and digital items */}
                        <div className="mt-2 flex flex-wrap gap-2 items-center">
                            {(item.service && item.service) > 0 && <span className="bg-green-100 text-green-800 px-2 py-0 rounded-md text-xs">Serviço</span>}
                            {(item.digital && item.digital) > 0 && <span className="bg-blue-500 text-white px-2 py-0 rounded-md text-xs">Digital</span>}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="w-full md:w-[75%] md:ms-auto bg-secondary p-4 border rounded-lg">
                            {/* Additional author information */}
                            <span className="text-xl">Anunciante</span>
                            <div className="flex flex-nowrap items-center gap-1 mt-4 mb-2">
                                <Avatar id={item.author} size={16} round={true} density={1} />
                                <p className="text-sm text-gray-500">{item?.author && item.author.length > 10 ? `${item.author.slice(0, 5)}...${item.author.slice(-4)}` : item.author}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 items-center">
                    <button className="btn-buy px-4 py-2 rounded btn-primary">
                        Comprar Agora
                    </button>
                    <button className="btn-message px-4 py-2 rounded">
                        Enviar Mensagem
                    </button>
                </div>

                {/* Related Items Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Ver Também</h2>

                    {relatedItems && relatedItems.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2">
                            {relatedItems.map((relatedItem, index) => (
                                <ItemCard key={index} item={relatedItem} />
                            ))}
                        </div>
                    ) : (
                        <span>Não foram encontrados nenhuns anúncios</span>
                    )}
                </div>
            </div>
        </>
    );
}

export default ItemView;