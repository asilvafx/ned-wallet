import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { BaseUrl, Key } from '../data/api';
import { useDropzone } from 'react-dropzone';
import { WithContext as ReactTags } from 'react-tag-input';
import Select from 'react-select';
import Breadcrumbs from "../components/Breadcrumbs";
import Cookies from 'js-cookie';
import { fetchCategories } from '../data/db';
import locals from '../json/locals.json';
import NotLoggedIn from "../components/NotLoggedIn";
import { FiUploadCloud } from "react-icons/fi";
import { FaChevronLeft } from "react-icons/fa6";
import { MdOutlineHistory } from "react-icons/md";

const Create = () => {
    const navigate = useNavigate();

    // Check if the user is logged in
    const isLoggedIn = Cookies.get('isLoggedIn');
    const walletId = Cookies.get('uid');

    // If the user is not logged in, show a message and a button to connect
    if (!isLoggedIn || !walletId) {
        return (
            <>
                <NotLoggedIn text="Por favor, inicia sessão para criar um anúncio" />
            </>
        );
    }

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        priceEUR: '',
        description: '',
        category: '',
        tags: [],
        location: { city: '', country: 'Portugal' }, // Default country is Portugal
        gallery: [],
        cover: '',
        stock: -1, // Default to unlimited stock
        digital: 0, // Default to not a digital product
        service: 0, // Default to not a service
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // Step state for multi-step form
    const [categories, setCategories] = useState([]);
    const [charCountName, setCharCountName] = useState(0); // For character count in name
    const [charCountDesc, setCharCountDesc] = useState(0); // For character count in description
    const [selectedCountry, setSelectedCountry] = useState(null);

    const NED_currentPrice = "0.54002110"; // Current price for conversion

    useEffect(() => {
        const loadCategories = async () => {
            const fetchedCategories = await fetchCategories();
            setCategories(fetchedCategories);
        };

        loadCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Automatically convert price from NED to EUR
        if (name === 'price') {
            const priceInNED = parseFloat(value);
            if (!isNaN(priceInNED)) {
                const priceInEUR = (priceInNED * NED_currentPrice).toFixed(2); // Conversion from NED to EUR
                setFormData((prevData) => ({
                    ...prevData,
                    price: value, // Set the value from the input
                    priceEUR: priceInEUR || "0.00", // Update the EUR price
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    price: "", // Update NED price
                    priceEUR: "", // Set the value from the input
                }));
            }
        }

        // Automatically convert price from EUR to NED
        if (name === 'priceEUR') {
            const priceInEUR = parseFloat(value);
            if (!isNaN(priceInEUR)) {
                const priceInNED = (priceInEUR / NED_currentPrice).toFixed(4); // Conversion from EUR to NED
                setFormData((prevData) => ({
                    ...prevData,
                    price: priceInNED || "0.0000", // Update NED price
                    priceEUR: value, // Set the value from the input
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    price: "", // Update NED price
                    priceEUR: "", // Set the value from the input
                }));
            }
        }

        // Update character count for name
        if (name === 'name') {
            setCharCountName(value.length);
        }

        // Update character count for description
        if (name === 'description') {
            setCharCountDesc(value.length);
        }
    };

    const handleTagsChange = (tags) => {
        setFormData((prevData) => ({
            ...prevData,
            tags,
        }));
    };

    const onDrop = (acceptedFiles) => {
        const imageFiles = acceptedFiles.map(file => URL.createObjectURL(file));
        setFormData((prevData) => ({
            ...prevData,
            gallery: [...prevData.gallery, ...imageFiles],
        }));
    };

    const removeImage = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            gallery: prevData.gallery.filter((_, i) => i !== index),
        }));
    };

    const setCoverImage = (image) => {
        setFormData((prevData) => ({
            ...prevData,
            cover: image,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${BaseUrl}/items`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Key}`,
                },
            });

            if (response.status === 201) {
                alert('Produto ou serviço criado com sucesso!');
                navigate('/'); // Redirect to home page after creation
            }
        } catch (error) {
            console.error('Erro ao criar o item:', error);
            setError('Falha ao criar o item. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': [], // Allow JPEG images
            'image/png': [],   // Allow PNG images
            'image/gif': [],   // Allow GIF images
            'image/webp': [],  // Allow WEBP images
        },
        onDrop,
    });

    // Define breadcrumbsLinks
    const breadcrumbsLinks = [
        { label: 'Home', path: '/' },
        { label: 'Criar anúncio', path: '/create' },
    ];

    const changeStep = (newStep) => {
        setStep(newStep);
        window.scrollTo(0, 0); // Scroll to the top of the page
    };


    return (
        <>
            <Helmet>
                <title>Criar Novo Anúncio</title>
                <meta name="description" content="Página para criar um novo produto ou serviço no NED" />
            </Helmet>
            <Breadcrumbs links={breadcrumbsLinks} />
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold capitalize">O Que Estás a Vender?</h1>
                    <Link to="/profile" className="text-sm capitalize inline-flex items-center gap-1 text-gray-500 hover:text-primary">
                        <MdOutlineHistory />
                        <span>Os Meus Anúncios</span>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="mb-4">
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {step === 1 && (
                        <div className="grid grid-cols-2 gap-4 items-center pt-4">
                            <div className="bg-secondary border shadow-md rounded-lg p-6 flex flex-col">
                                <button type="button" onClick={() => { setFormData({ ...formData, service: 0 }); changeStep(2); }} className="py-2 px-4 rounded-md">Produto</button>
                            </div>
                            <div className="bg-secondary border shadow-md rounded-lg p-6 flex flex-col">
                                <button type="button" onClick={() => { setFormData({ ...formData, service: 1 }); changeStep(2); }} className="py-2 px-4 rounded-md">Serviço</button>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nome do {formData.service === 1 ? 'Serviço' : 'Produto'}</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} maxLength={150} required className="py-2 px-4 w-full rounded-md border mb-1" />
                            <p className="text-gray-500 text-sm">{charCountName}/150</p>
                            {charCountName >= 150 && <p className="text-red-500 text-sm">Limite de caracteres atingido.</p>}
                        </div>
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Preço (em NED)</label>
                                <div className="relative">
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.0000" required className="py-2 px-4 w-full rounded-md border" />
                                    <span className="text-gray-500 absolute top-2 right-2">$NED</span>
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priceEUR">Preço (em EUR)</label>
                                <div className="relative">
                                    <input type="number" name="priceEUR" value={formData.priceEUR} onChange={handleChange} placeholder="0.00" required className="py-2 px-5 w-full rounded-md border" />
                                    <span className="text-gray-500 absolute top-2 right-2">€</span>
                                    <span className="text-gray-500 top-2 left-2 absolute">≃</span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Descrição</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} maxLength={500} required className="py-2 px-4 w-full rounded-md border"></textarea>
                        <p className="text-gray-500 text-sm">{charCountDesc}/500</p>
                        {charCountDesc >= 500 && <p className="text-red-500 text-sm">Limite de caracteres atingido.</p>}
                        </div>
                        <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Categoria</label>
                        <Select
                        id="category"
                        value={categories.find(category => category.value === formData.category)}
                        onChange={(selectedOption) => setFormData({ ...formData, category: selectedOption.value })}
                        options={categories.map(category => ({ value: category.name, label: category.name }))}
                        className="p-0 w-full rounded-md border bg-card"
                        classNamePrefix="select"
                        placeholder="Selecionar Categoria"
                        />
                        </div>
                        <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">Localização</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            id="country"
                            value={locals.countries.find(country => country === formData.location.country)}
                            onChange={(selectedOption) => {
                                setFormData({
                                    ...formData,
                                    location: {
                                        ...formData.location,
                                        country: selectedOption.value,
                                        city: '' // Reset city when country changes
                                    }
                                });
                                setSelectedCountry(selectedOption.value); // Set selected country
                            }}
                            options={locals.countries.map(country => ({ value: country.name, label: country.name }))}
                            className="p-0 w-full rounded-md border bg-card"
                            classNamePrefix="select"
                            placeholder="Selecionar País"
                        />
                        <Select
                            id="city"
                            value={locals.cities.find(city => city === formData.location.city)}
                            onChange={(selectedOption) => setFormData({
                                ...formData,
                                location: {
                                    ...formData.location,
                                    city: selectedOption.value
                                }
                            })}
                            options={locals.cities.filter(city => city.country_id === (selectedCountry === 'Portugal' ? 1 : 0)).map(city => ({ value: city.name, label: city.name }))} // Filter cities based on selected country
                            className="p-0 w-full rounded-md border bg-card"
                            classNamePrefix="select"
                            placeholder="Selecionar Cidade"
                            isDisabled={!selectedCountry} // Disable city select if no country is selected
                        />
                        </div>
                        </div>
                        <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">Tags (separadas por enter)</label>
                        <ReactTags
                        tags={formData.tags}
                        handleDelete={(i) => handleTagsChange(formData.tags.filter((tag, index) => index !== i))}
                        handleAddition={(tag) => handleTagsChange([...formData.tags, tag])}
                        placeholder="Adicione tags"
                        autoFocus={false} // Remove autofocus from the tags input
                        />
                        </div>
                        <div {...getRootProps()} className="mb-4 border-dashed border-2 border-gray-400 p-4 text-center">
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center gap-4">
                            <FiUploadCloud className="text-5xl" />
                            <p>Arraste e solte algumas imagens aqui, ou clique para selecionar imagens</p>
                        </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                        {formData.gallery.map((image, index) => (
                            <div key={index} className="relative">
                                <img src={image} alt={`Upload ${index}`} className="w-full h-32 object-cover rounded" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                >
                                    X
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCoverImage(image)}
                                    className={`absolute bottom-0 left-0 bg-blue-500 text-white rounded-full p-1 ${formData.cover === image ? 'opacity-100' : 'opacity-50'}`}
                                >
                                    {formData.cover === image ? 'Capa' : 'Definir como Capa'}
                                </button>
                            </div>
                        ))}
                        </div>
                        <div className="flex items-center justify-between gap-2 md:gap-4">
                        <button
                        type="button"
                        onClick={() => changeStep(1)}
                        className="inline-flex gap-1 items-center py-2 px-4 rounded-md capitalize"
                        >
                        <FaChevronLeft />
                        <span>Voltar</span>
                        </button>
                        <button
                        type="submit"
                        className={`btn-primary w-full font-bold py-2 px-4 rounded-md capitalize ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                        >
                        {loading ? 'A Carregar...' : 'Rever Anúncio'}
                        </button>
                        </div>
                        </>
                        )}
                </form>
            </div>
        </>
    );
};

export default Create;