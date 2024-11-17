import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; // Import React Select

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const navigate = useNavigate();

    const cities = [
        { value: '', label: 'Todo o país' },
        { value: 'city1', label: 'Cidade 1' },
        { value: 'city2', label: 'Cidade 2' },
        { value: 'city3', label: 'Cidade 3' },
    ];

    const types = [
        { value: '', label: 'Mostrar tudo' },
        { value: 'products', label: 'Produtos' },
        { value: 'services', label: 'Serviços' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams({
            query: searchQuery,
            city: selectedCity ? selectedCity.value : '',
            type: selectedType ? selectedType.value : '',
        }).toString();
        navigate(`/search?${queryParams}`);
    };

    return (
        <div className="mb-6">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex-1 relative mb-4 md:mb-0">
                    <input
                        type="text"
                        placeholder="O que estás à procura?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <FaSearch className="text-gray-400" />
                    </span>
                </div>

                <div className="flex-1 mb-4 md:mb-0">
                    <Select
                        id="city"
                        value={selectedCity}
                        onChange={setSelectedCity}
                        options={cities}
                        className="bg-secondary border rounded-lg w-full h-full p-0"
                        classNamePrefix="select"
                        placeholder="Todo o país"
                    />
                </div>

                <div className="flex-1 mb-4 md:mb-0">
                    <Select
                        id="type"
                        value={selectedType}
                        onChange={setSelectedType}
                        options={types}
                        className="bg-secondary border rounded-lg w-full h-full p-0"
                        classNamePrefix="select"
                        placeholder="Mostrar tudo"
                    />
                </div>

                <div className="flex p-0 md:p-1">
                    <button type="submit" className="w-full px-4 py-2 bg-primary text-color flex items-center gap-2 rounded transition duration-200">
                        <FaSearch className="text-lg" />
                        <span className="md:hidden">Pesquisar</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchBar;