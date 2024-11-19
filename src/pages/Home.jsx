import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import ItemSlider from '../components/ItemSlider';
import AutoplaySlider from '../components/AutoplaySlider';
import SearchBar from '../components/SearchBar';
import SearchBarSkeleton from '../components/skeleton/SearchBarSkeleton';
import { FaChevronRight } from "react-icons/fa6";
import { fetchItems, fetchCategories } from "../data/db";

const banners = [
    { id: 1, title: 'Banner 1', text: 'Banner 1 Description', color: 'red' },
    { id: 2, title: 'Banner 2', text: 'Banner 2 Description', color: 'blue' },
    { id: 3, title: 'Banner 3', text: 'Banner 3 Description' },
];

const Home = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(true); // Loading state for items
    const [loadingCategories, setLoadingCategories] = useState(true); // Loading state for categories
    const [loadingSearchBar, setLoadingSearchBar] = useState(true); // Loading state for search bar
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchAllItems = async () => {
            try {
                const fetchedItems = await fetchItems();
                setItems(fetchedItems);
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setLoadingItems(false); // Set loading to false after fetching
            }
        };

        const fetchData = async () => {
            try {
                const fetchedCategories = await fetchCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoadingCategories(false); // Set loading to false after fetching
            }
        };

        fetchAllItems();
        fetchData();

        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
        }, 3000);

        // Set loadingSearchBar to false after 3 seconds
        const searchBarTimeout = setTimeout(() => {
            setLoadingSearchBar(false);
        }, 1000);

        return () => {
            clearInterval(interval);
            clearTimeout(searchBarTimeout); // Clean up the timeout
        };
    }, []);

    return (
        <>
            <Helmet>
                <title>{t('seo_title')}</title>
                <meta name='description' content={t('seo_description')} />
            </Helmet>

            <div className="px-4 mt-6">
                {/* Search Bar Section */}
                {loadingSearchBar ? (
                    <SearchBarSkeleton />
                ) : (
                    <SearchBar />
                )}

                {/* New Arrivals Slider Section */}
                {loadingItems ? (
                    <ItemSlider title={{ icon: '🛍️', title: 'Os Mais Recentes', text: 'Descubra uma variedade de serviços oferecidos por usuários locais. Conecte-se e aproveite a experiência de nossa comunidade.' }} loading={true} />
                ) : (
                    <ItemSlider title={{ icon: '🌟', title: 'Os Mais Recentes', text: 'Descubra uma variedade de serviços oferecidos por usuários locais. Conecte-se e aproveite a experiência de nossa comunidade.' }} items={items}  />
                )}

                {/* Featured Products Slider Section */}
                {loadingItems ? (
                    <ItemSlider title={{ icon: '🛍️', title: 'Em Destaque', text: 'Descubra uma variedade de serviços oferecidos por usuários locais. Conecte-se e aproveite a experiência de nossa comunidade.' }} loading={true} />
                ) : (
                    <ItemSlider title={{ icon: '🛍️', title: 'Em Destaque ', text: 'Descubra uma variedade de serviços oferecidos por usuários locais. Conecte-se e aproveite a experiência de nossa comunidade.' }} items={items} />
                )}

                {/* Categories Section */}
                <h2 className="text-xl font-semibold mt-8 mb-6 capitalize">Explorar por categoria..</h2>
                {loadingCategories ? (
                    <span>Loading</span>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                        {categories.map(category => (
                            <div key={category.id} className="flex flex-col items-center bg-secondary rounded-full p-4">
                                <span className="text-3xl">{category.emoji}</span>
                                <span className="mt-2 text-center">{category.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Hero Section */}

                {/* Featured Services Slider Section */}
                {loadingItems ? (
                    <ItemSlider title={{ icon: '🛠️', title: 'Serviços Recomendados', text: 'Descubra uma variedade de serviços oferecidos por usuários locais. Conecte-se e aproveite a experiência de nossa comunidade.' }} loading={true} />
                ) : (
                    <ItemSlider title={{ icon: '🛠️', title: 'Serviços Recomendados', text: 'Descubra uma variedade de serviços oferecidos por usuários locais. Conecte-se e aproveite a experiência de nossa comunidade.' }} items={items} />
                )}

                <ItemSlider viewAll={false} items={items} />

                {/* Autoplay Slider Section */}
                <AutoplaySlider banners={banners} />
            </div>
        </>
    );
}

export default Home;