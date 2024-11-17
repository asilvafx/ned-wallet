import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ItemSlider from '../components/ItemSlider';
import AutoplaySlider from '../components/AutoplaySlider';
import SearchBar from '../components/SearchBar';
import { fetchCategories } from "../data/db";

const featuredItems = [
    {
        id: 1,
        uid: 'uid-1',
        name: 'Item 1',
        author: '0x000...000010',
        price: '0.50 NED',
        description: 'Description for Item 1',
        category: 'Category 1',
        tags: ['tag1', 'tag2'],
        location: 'Location 1',
        gallery: [
            'https://via.placeholder.com/150',
            'https://via.placeholder.com/150/0000FF',
            'https://via.placeholder.com/150/008000'
        ],
        cover: 'https://via.placeholder.com/150',
        stock: -1, // Unlimited stock
        status: 1, // 1 for available
        digital: 0, // 0 for false (not a digital product)
        service: 0, // 0 for false (not a service)
    },
    {
        id: 2,
        uid: 'uid-2',
        name: 'Item 2',
        author: '0x000...000010',
        price: '1.00 NED',
        description: 'Description for Item 2',
        category: 'Category 2',
        tags: ['tag3', 'tag4'],
        location: 'Location 2',
        gallery: [
            'https://via.placeholder.com/150',
            'https://via.placeholder.com/150/FF0000',
            'https://via.placeholder.com/150/FFFF00'
        ],
        cover: 'https://via.placeholder.com/150',
        stock: 5, // Limited stock
        status: 1, // 1 for available
        digital: 1, // 1 for true (is a digital product)
        service: 0, // 0 for false (not a service)
    },
    {
        id: 3,
        uid: 'uid-3',
        name: 'Item 3',
        author: '0x000...000010',
        price: '1.50 NED',
        description: 'Description for Item 3',
        category: 'Category 3',
        tags: ['tag5', 'tag6'],
        location: 'Location 3',
        gallery: [
            'https://via.placeholder.com/150',
            'https://via.placeholder.com/150/00FF00',
            'https://via.placeholder.com/150/000000'
        ],
        cover: 'https://via.placeholder.com/150',
        stock: 0, // Out of stock
        status: 0, // 0 for not available
        digital: 0, // 0 for false (not a digital product)
        service: 1, // 1 for true (is a service)
    },
    {
        id: 4,
        uid: 'uid-4',
        name: 'Item 4',
        author: '0x000...000010',
        price: '2.00 NED',
        description: 'Description for Item 4',
        category: 'Category 4',
        tags: ['tag7', 'tag8'],
        location: 'Location 4',
        gallery: [
            'https://via.placeholder.com/150',
            'https://via.placeholder.com/150/800080',
            'https://via.placeholder.com/150/FFA500'
        ],
        cover: 'https://via.placeholder.com/150',
        stock: -1, // Unlimited stock
        status: 1, // 1 for available
        digital: 1, // 1 for true (is a digital product)
        service: 1, // 0 for false (not a service)
    },
];

const banners = [
    { id: 1, title: 'Banner 1', text: 'Banner 1 Description', color: 'red' },
    { id: 2, title: 'Banner 2', text: 'Banner 2 Description', color: 'blue' },
    { id: 3, title: 'Banner 3', text: 'Banner 3 Description' },
];

const Home = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
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

            <Header />

            <div className="px-4 mt-8">
                {/* Search Bar Section */}
                <SearchBar />

                {/* New Arrivals Slider Section */}
                <ItemSlider title={{ icon: '🌟', text: 'Os Mais Recentes' }} items={featuredItems} />

                {/* Featured Products Slider Section */}
                <ItemSlider title={{ icon: '🛍️', text: 'Em Destaque' }} items={featuredItems} />


                {/* Categories Section */}
                <h2 className="text-xl font-semibold mt-8 mb-4 capitalize">Explorar por categoria..</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {categories.map(category => (
                        <div key={category.id} className="flex flex-col items-center bg-secondary rounded-full p-4">
                            <span className="text-3xl">{category.emoji}</span>
                            <span className="mt-2 text-center">{category.name}</span>
                        </div>
                    ))}
                </div>

                {/* Hero Section */}
                <div className="mt-8 mb-6 bg-secondary border p-6 rounded-lg shadow-md flex flex-col items-center">
                    <img
                        src="https://via.placeholder.com/600x200"
                        alt="Hero Banner"
                        className="w-full h-auto rounded-lg mb-4"
                    />
                    <h2 className="text-2xl font-bold mb-2">Explore Os Nossos Serviços</h2>
                    <p className="text-center text-gray-700">
                        Descubra uma variedade de serviços oferecidos por usuários locais.
                        Conecte-se e aproveite a experiência de nossa comunidade.
                    </p>
                </div>

                {/* Featured Services Slider Section */}
                <ItemSlider title={{ icon: '🛠️', text: 'Serviços Recomendados' }} items={featuredItems} />
                <ItemSlider viewAll={false} items={featuredItems} />

                {/* Autoplay Slider Section */}
                <AutoplaySlider banners={banners} />


            </div>

            <Footer />
        </>
    );
}

export default Home;