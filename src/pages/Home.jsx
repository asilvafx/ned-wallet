import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import ItemSlider from '../components/ItemSlider';
import AutoplaySlider from '../components/AutoplaySlider';
import SearchBar from '../components/SearchBar';
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
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchAllItems = async () => {
            const fetchedItems = await fetchItems();
            setItems(fetchedItems);
        };

        fetchAllItems();

        const fetchData = async () => {
            const fetchedCategories = await fetchCategories();
            setCategories(fetchedCategories);
        };

        fetchData();

        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Helmet>
                <title>{ t('seo_title')}</title>
                <meta name='description' content={t('seo_description')} />
            </Helmet>

            <div className="px-4 mt-6">
                {/* Search Bar Section */}
                <SearchBar />

                {/* New Arrivals Slider Section */}
                <ItemSlider title={{ icon: '🌟', title: 'Os Mais Recentes', text: 'Descubra uma variedade de serviços oferecidos por usuários locais. Conecte-se e aproveite a experiência de nossa comunidade.' }} items={items} />

                {/* Featured Products Slider Section */}
                <ItemSlider title={{ icon: '🛍️', title: 'Em Destaque', text: 'Descubra uma variedade de serviços oferecidos por usuários locais. Conecte-se e aproveite a experiência de nossa comunidade.' }} items={items} />


                {/* Categories Section */}
                <h2 className="text-xl font-semibold mt-8 mb-6 capitalize">Explorar por categoria..</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {categories.map(category => (
                        <div key={category.id} className="flex flex-col items-center bg-secondary rounded-full p-4">
                            <span className="text-3xl">{category.emoji}</span>
                            <span className="mt-2 text-center">{category.name}</span>
                        </div>
                    ))}
                </div>

                {/* Hero Section */}
                <div className="mt-8 mb-6 bg-secondary border p-6 rounded-lg shadow-md flex flex-col items-center relative overflow-hidden">

                    <div className="flex flex-col text-center items-center">
                        <h2 className="text-2xl font-bold mb-2">Explore Os Nossos Serviços</h2>
                        <p className="text-center text-gray-500">
                            Descubra uma variedade de serviços oferecidos por usuários locais.
                            Conecte-se e aproveite a experiência de nossa comunidade.
                        </p>
                    </div>

                </div>

                {/* Featured Services Slider Section */}
                <ItemSlider title={{ icon: '🛠️', title: 'Serviços Recomendados' }} items={items} />
                <ItemSlider viewAll={false} items={items} />

                {/* Autoplay Slider Section */}
                <AutoplaySlider banners={banners} />


            </div>

        </>
    );
}

export default Home;