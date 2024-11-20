import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";
import { fetchItemData, fetchUserData, fetchRelatedItems, likeItem, unlikeItem } from "../data/db";
import Breadcrumbs from '../components/Breadcrumbs';
import ItemCard from "../components/ItemCard";
import ItemViewSkeleton from '../components/skeleton/ItemViewSkeleton';
import { FaRegHeart } from "react-icons/fa6";
import Avatar from "../components/Avatar";
import Modal from '../components/Modal';

const ItemView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [item, setItem] = useState(null);
    const [author, setAuthor] = useState(null);
    const [relatedItems, setRelatedItems] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

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

                if (fetchedItem) {
                    const fetchedAuthor = await fetchUserData(fetchedItem.author);
                    setAuthor(fetchedAuthor);
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

    // Function to go to the next image
    const nextImage = () => {
        const totalImages = item.gallery.length + (item.cover ? 1 : 0); // Include cover image if exists
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
    };

    // Function to go to the previous image
    const prevImage = () => {
        const totalImages = item.gallery.length + (item.cover ? 1 : 0); // Include cover image if exists
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
    };

    // Function to select an image from thumbnails
    const selectImage = (index) => {
        setCurrentImageIndex(index);
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const proceedToCheckout = () => {
        console.log('Selected Option:', selectedOption);
        console.log('Item Data:', item);
        closeModal();
    };

    if (loading) {
        return <ItemViewSkeleton />; // Show skeleton while loading
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
                        value={searchQuery}
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
        { label: item?.category || "NA", path: `/listings?category=${item?.category || ''}` },
        { label: item?.name || "NA", path: `/listing/${id}` },
    ];

    const totalImages = item.gallery.length > 0 ? item.gallery.length : 0; // Count gallery images
    const imagesToDisplay = totalImages > 0 ? [item.cover, ...item.gallery] : [item.cover]; // Include cover image

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
                        className={`inline-flex gap-2 items-center px-4 py-2 rounded ${isLiked ? 'bg-red-500 text-white' : ''}`}
                    >
                        <FaRegHeart />
                        {isLiked ? 'Remover' : 'Guardar'}
                    </button>
                </div>

                {/* Gallery Slider Section */}
                <div className="relative w-full h-64"> {/* Container for the slider */}
                    <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white rounded-full p-2">❮</button>
                    <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
                        <div className="flex items-center justify-center h-full"> {/* Center the image */}
                            <img src={imagesToDisplay[currentImageIndex]} alt={`Gallery image ${currentImageIndex + 1}`} className="w-full h-full object-cover rounded-md" />
                        </div>
                    </div>
                    <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white rounded-full p-2">❯</button>
                </div>

                {/* Thumbnails Section */}
                <div className="flex space-x-2 mt-2">
                    {imagesToDisplay.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className={`w-16 h-16 object-cover rounded cursor-pointer ${currentImageIndex === index ? 'border-2 border-blue-500 ' : ''}`}
                            onClick={() => selectImage(index)}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-nowrap items-center gap-2">
                            <p className="text-2xl font-semibold">{item.price} NED</p>
                            <span className="text-gray-500 text-md">
                                ≃ 0.00 EUR
                            </span>
                        </div>
                        <p className="text-lg">{item.description}</p>
                        {item.tags && Array.isArray(item.tags) && item.tags.length > 0 ? (
                            <div className="grid grid-cols-4 gap-2">
                                {item.tags.map((tag, index) => (
                                    <span key={index} className="bg-gray-200 px-2 py-1 rounded">{tag}</span>
                                ))}
                            </div>
                        ) : null}
                        <p className="text-gray-600 inline-flex gap-1 items-center">{item.city}, {item.country}</p>

                        {/* Badges for service and digital items */}
                        <div className="mt-2 flex flex-wrap gap-2 items-center mb-4">
                            {(item.service && item.service) > 0 && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">Serviço</span>}
                            {(item.digital && item.digital) > 0 && <span className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm">Digital</span>}
                        </div>

                        <div className="hidden md:flex">
                            <button onClick={openModal} className="btn-buy text-lg uppercase px-4 py-3 rounded-md btn-primary w-full">
                                Comprar Agora
                            </button>
                        </div>
                    </div>
                    <div className="sticky">
                        <div className="w-full md:w-[75%] md:ms-auto bg-secondary p-4 border rounded-lg sticky">
                            {/* Additional author information */}
                            <div className="flex flex-wrap gap-2 justify-between items-center">
                                <span className="text-xl text-gray-500">Anunciante</span>
                                <Link to="/" className="text-sm">
                                    Mostrar Perfil
                                </Link>
                            </div>
                            <div className="flex flex-nowrap items-center gap-2 mt-4 mb-2 p-1">
                                <Avatar id={item.author} size={16} round={true} density={1} />
                                <p className="text-primary">{item?.author && item.author.length > 10 ? `${item.author.slice(0, 5)}...${item.author.slice(-4)}` : item.author}</p>
                            </div>
                            <div className="flex flex-col gap-1 mt-2 mb-6">
                                <p className="text-gray-500">
                                    <span className="text-color ms-1">
                                        {author.displayName ?? 'Anónimo'}
                                    </span>
                                </p>
                                <p className="text-gray-500">
                                    <span className="text-color ms-1">
                                        {author.city ?? 'NA'},  {author.country ?? 'NA'}
                                    </span>
                                </p>
                            </div>
                            <button className="btn-message px-4 py-2 rounded-lg w-full capitalize">
                                Enviar Mensagem
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex md:hidden bottom-fixed">
                    <button onClick={openModal} className="btn-buy text-2xl uppercase px-4 pt-4 pb-6 rounded-t-md btn-primary w-full">
                        Comprar Agora
                    </button>
                </div>

                {/* Related Items Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-500">Ver Também</h2>

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
            {/* Modal for Purchase Options */}
            {modalOpen && (
                <Modal onClose={closeModal}>
                    <div className="flex justify-between items-center">
                        <h2 className=" text-2xl font-bold mb-6">Escolha uma Opção</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                        {['Meet in person', 'Mail Delivery', 'Pick-up'].map((option) => (
                            <div
                                key={option}
                                className={`border p-4 rounded cursor-pointer ${selectedOption === option ? 'border-primary' : ''}`}
                                onClick={() => handleOptionSelect(option)}
                            >
                                <h3 className="text-lg">{option}</h3>
                            </div>
                        ))}
                    </div>
                    <button onClick={proceedToCheckout} className="btn-primary mt-6 px-4 py-3 rounded w-full text-lg">
                        Continuar
                    </button>
                </Modal>
            )}
        </>
    );
}

export default ItemView;