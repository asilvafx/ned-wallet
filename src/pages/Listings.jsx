import React, { useEffect, useState } from 'react';
import { fetchItems, fetchCategories } from '../data/db';
import ItemCard from '../components/ItemCard';
import ItemCardSkeleton from '../components/skeleton/ItemCardSkeleton';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import localData from '../json/locals.json';
import Select from 'react-select';
import {Helmet} from "react-helmet-async";

const Listings = () => {
    const { t } = useTranslation();
    const { categoryId } = useParams(); // Get categoryId from URL parameters
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        priceRange: '',
        location: '',
        serviceType: '', // New filter for service type
    });
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);

    const query = new URLSearchParams(useLocation().search);

    // Extract search parameters from the URL
    const initialSearchQuery = decodeURIComponent(query.get('query') || '');
    const initialCity = decodeURIComponent(query.get('city') || '');
    const initialType = decodeURIComponent(query.get('type') || '');
    const initialCategory = decodeURIComponent(query.get('category') || '');

    useEffect(() => {
        const fetchItemsData = async () => {
            try {
                const fetchedItems = await fetchItems();
                setItems(fetchedItems);
            } catch (fetchError) {
                setError('Failed to fetch items.');
            } finally {
                setLoading(false);
            }
        };

        const fetchCategoriesData = async () => {
            const fetchedCategories = await fetchCategories();
            setCategories(fetchedCategories);
        };

        fetchItemsData();
        fetchCategoriesData();
        setLocations(localData.cities); // Load locations from local JSON
    }, []);

    useEffect(() => {
        // Set initial search query and filters from URL parameters
        setSearchQuery(initialSearchQuery);
        setFilters(prevFilters => ({
            ...prevFilters,
            location: initialCity,
            category: initialCategory,
            serviceType: initialType,
        }));

        if (categoryId) {
            const selectedCategory = categories.find(category => category.slug === categoryId);
            if (selectedCategory) {
                setFilters(prevFilters => ({ ...prevFilters, category: selectedCategory.name }));
            } else {
                setFilters(prevFilters => ({ ...prevFilters, category: '' })); // Reset if not valid
            }
        }
    }, [categoryId, categories, initialSearchQuery, initialCity, initialCategory, initialType]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (name) => (selectedOption) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: selectedOption ? selectedOption.value : '',
        }));
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filters.category ? item.category === filters.category : true;
        const matchesLocation = filters.location ? item.city === filters.location : true;
        const matchesPriceRange = filters.priceRange ? item.price <= filters.priceRange : true;
        const matchesServiceType = filters.serviceType ? (filters.serviceType === 'products' ? item.service === 0 : item.service > 0) : true;

        return matchesSearch && matchesCategory && matchesLocation && matchesPriceRange && matchesServiceType;
    });

    // Define breadcrumbsLinks only after items are fetched
    const breadcrumbsLinks = [
        { label: 'Home', path: '/' },
        { label: 'Anúncios', path: '/listings' },
    ];

    if (loading) {
        return (
            <div className="px-4 py-6">
                <h1 className="text-2xl font-bold mb-4 capitalize">{t('Todos os anúncios')}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <ItemCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <>
        <Helmet>
            <title>{t('seo_title')}</title>
            <meta name='description' content={t('seo_description')} />
        </Helmet>
        <Breadcrumbs links={breadcrumbsLinks} />
        <div className="px-4 py-6">
            <h1 className="text-2xl font-bold mb-4 capitalize">{t('Todos os anúncios')}</h1>

            {/* Search Section */}
            <div className="mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={t('Pesquisar produtos/serviços...')}
                    className="border rounded px-4 py-2 w-full bg-secondary"
                />
            </div>

            {/* Filter Section */}
            <div className="mb-4 flex flex-col md:flex-row gap-4">
                <Select
                    id="category"
                    value={filters.category ? { value: filters.category, label: filters.category } : null}
                    onChange={handleFilterChange('category')}
                    options={[
                        { value: "", label: "Mostrar tudo" }, // Default option
                        ...categories.map(category => ({ value: category.name, label: category.name })) // Spread the categories
                    ]}
                    className="bg-secondary border rounded-lg w-full h-full p-0"
                    classNamePrefix="select"
                    placeholder={t('Todas as categorias')}
                />
                <Select
                    id="location"
                    value={filters.location ? { value: filters.location, label: filters.location } : null}
                    onChange={handleFilterChange('location')}
                    options={[
                        { value: "", label: "Mostrar tudo" }, // Default option
                        ...locations.map(location => ({ value: location.name, label: location.name })) // Spread the locations
                    ]}
                    className="bg-secondary border rounded-lg w-full h-full p-0"
                    classNamePrefix="select"
                    placeholder={t('Todo país')}
                />

                <Select
                    id="priceRange"
                    value={filters.priceRange ? { value: filters.priceRange, label: `Até ${filters.priceRange} NED` } : null}
                    onChange={handleFilterChange('priceRange')}
                    options={[
                        { value: '', label: t('Mostrar tudo') },
                        { value: '50', label: 'Até 50 NED' },
                        { value: '100', label: 'Até 100 NED' },
                        { value: '200', label: 'Até 200 NED' },
                    ]}
                    className="bg-secondary border rounded-lg w-full h-full p-0"
                    classNamePrefix="select"
                    placeholder={t('Todos preços')}
                />

                <Select
                    id="serviceType"
                    value={filters.serviceType ? { value: filters.serviceType, label: filters.serviceType === 'products' ? t('Produtos') : t('Serviços') } : null}
                    onChange={handleFilterChange('serviceType')}
                    options={[
                        { value: '', label: t('Mostrar tudo') },
                        { value: 'products', label: t('Produtos') },
                        { value: 'services', label: t('Serviços') },
                    ]}
                    className="bg-secondary border rounded-lg w-full h-full p-0"
                    classNamePrefix="select"
                    placeholder={t('Todos tipos')}
                />
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <ItemCard key={item.id} item={item} />
                    ))
                ) : (
                    <div className="col-span-full text-center">{t('No items found.')}</div>
                )}
            </div>
        </div>
        </>
    );
};

export default Listings;