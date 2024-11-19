import React, { useEffect, useState } from 'react';
import { fetchItems, fetchCategories } from '../data/db'; // Import your functions to fetch items and categories
import ItemCard from '../components/ItemCard'; // Import your ItemCard component
import ItemCardSkeleton from '../components/skeleton/ItemCardSkeleton'; // Import the skeleton component
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters
import localData from '../json/locals.json'; // Import the local JSON data
import Select from 'react-select';

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
        if (categoryId) {
            const selectedCategory = categories.find(category => category.slug === categoryId);
            if (selectedCategory) {
                setFilters(prevFilters => ({ ...prevFilters, category: selectedCategory.name }));
            } else {
                setFilters(prevFilters => ({ ...prevFilters, category: '' })); // Reset if not valid
            }
        }
    }, [categoryId, categories]);

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
        <div className="px-4 py-6">
            <h1 className="text-2xl font-bold mb-4 capitalize">{t('Todos os anúncios')}</h1>

            {/* Search Section */}
            <div className="mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={t('Pesquisar produtos/serviços...')}
                    className="border rounded px-4 py-2 w-full"
                />
            </div>

            {/* Filter Section */}
            <div className="mb-4 flex flex-col md:flex-row md:gap-4">
                <Select
                    id="category"
                    value={filters.category ? { value: filters.category, label: filters.category } : null}
                    onChange={handleFilterChange('category')}
                    options={categories.map(category => ({ value: category.name, label: category.name }))}
                    className="bg-secondary border rounded-lg w-full h-full p-0"
                    classNamePrefix="select"
                    placeholder={t('Todas as categorias')}
                />
                <Select
                    id="location"
                    value={filters.location ? { value: filters.location, label: filters.location } : null}
                    onChange={handleFilterChange('location')}
                    options={locations.map(location => ({ value: location, label: location }))}
                    className="bg-secondary border rounded-lg w-full h-full p-0"
                    classNamePrefix="select"
                    placeholder={t('Todo país')}
                />

                <Select
                    id="priceRange"
                    value={filters.priceRange ? { value: filters.priceRange, label: `Até ${filters.priceRange} NED` } : null}
                    onChange={handleFilterChange('priceRange')}
                    options={[
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
    );
};

export default Listings;