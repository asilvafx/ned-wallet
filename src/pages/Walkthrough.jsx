import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { fetchCategories } from '../data/db'; // Import the fetchCategories function

const Walkthrough = ({ onComplete }) => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [currentCategories, setCurrentCategories] = useState([]);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state

    const textSlides = [
        "Find your products & Services",
        "Buy and sell with NED",
        "Join our community today!"
    ];

    useEffect(() => {
        const loadCategories = async () => {
            const fetchedCategories = await fetchCategories();
            setCategories(fetchedCategories);
            setLoading(false); // Set loading to false after categories are fetched
        };

        loadCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            setCurrentCategories(categories.slice(0, 9));
            const interval = setInterval(() => {
                const startIndex = Math.floor(Math.random() * (categories.length - 9));
                setCurrentCategories(categories.slice(startIndex, startIndex + 9));
            }, 3000); // Change categories every 3 seconds

            return () => clearInterval(interval);
        }
    }, [categories]);

    useEffect(() => {
        const textInterval = setInterval(() => {
            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textSlides.length);
        }, 5000); // Change text every 5 seconds

        return () => clearInterval(textInterval);
    }, []);

    return (
        <>
            <Helmet>
                <title>{t('seo_title')}</title>
                <meta name='description' content={t('seo_description')} />
            </Helmet>
            <style>
                {`
                    @keyframes float-1 {
                        0% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                        100% { transform: translateY(0); }
                    }
                    .float-animation-1 { animation: float-1 3s ease-in-out infinite; }
                `}
            </style>
            <div className="bg-color flex items-center justify-center min-h-screen">
                <div className="text-center mt-8 px-4">
                    {loading ? ( // Show loading animation while fetching categories
                        <div className="loader"> {/* Add your loader component or animation here */}
                            <p>Loading categories...</p>
                            <div className="spinner"></div> {/* Example spinner, style it as needed */}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {currentCategories.map((item) => (
                                    <div key={item.id} className={`intro-bubble bg-secondary rounded-full p-4 shadow-md float-animation-1 relative overflow-hidden sm:h-32 sm:w-32 flex flex-col items-center justify-center`}>
                                        <span className="text-4xl">{item.emoji}</span>
                                        <p className="mt-2 text-sm font-semibold rounded text-shadow">
                                            {item.name}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <h1 className="text-2xl font-bold mb-2 capitalize">
                                {textSlides[currentTextIndex]}
                            </h1>

                            <p className="text-gray-500 mb-4">
                                Buy and sell with NED
                            </p>
                            <button className="px-6 py-2 rounded-full mb-8" onClick={onComplete}>
                                Get Started
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Walkthrough;