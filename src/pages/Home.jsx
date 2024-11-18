import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import ItemSlider from '../components/ItemSlider';
import AutoplaySlider from '../components/AutoplaySlider';
import SearchBar from '../components/SearchBar';
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
                <div className="grid grid-cols-1 md:grid-cols-2 justify-center my-6">
                    <div className="relative bg-gray-900 text-white rounded-lg p-8 m-4 flex flex-col justify-between">
                        <div>
                            <h1 className="text-5xl font-bold mb-4">The Essential Smart Watch</h1>
                            <p className="text-lg">The perfect fusion of style and functionality, designed to seamlessly integrate into your daily life.</p>
                        </div>
                        <img src="https://placehold.co/400x400" alt="Smart Watch" className="mt-4 rounded-lg" />
                        <div className="absolute bottom-4 right-4 flex gap-2 items-center bg-color px-4 py-2 rounded border">
                            <span className="text-color">Ver mais</span>
                            <FaChevronRight className="text-primary" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="relative bg-lime-500 text-black rounded-lg p-8 m-4 flex flex-col justify-between">
                            <div>
                                <h1 className="text-5xl font-bold mb-4">The Essential Smart Watch</h1>
                                <p className="text-lg">The perfect fusion of style and functionality, designed to seamlessly integrate into your daily life.</p>
                            </div>
                            <img src="https://placehold.co/400x400" alt="Smart Watch" className="mt-4 rounded-lg" />
                            <div className="absolute bottom-4 right-4 flex gap-2 items-center bg-color px-4 py-2 rounded border">
                                <span className="text-color">Ver mais</span>
                                <FaChevronRight className="text-primary" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Services Slider Section */}
                <ItemSlider title={{ icon: '🛠️', title: 'Serviços Recomendados', text: 'Descubra uma variedade de serviços oferecidos por usuários locais. Conecte-se e aproveite a experiência de nossa comunidade.' }} items={items} />

                <ItemSlider viewAll={false} items={items} />

                {/* Autoplay Slider Section */}
                <AutoplaySlider banners={banners} />


            </div>

        </>
    );
}

export default Home;