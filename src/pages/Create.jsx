import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { BaseUrl, Key } from '../data/api';
import { useDropzone } from 'react-dropzone';
import { WithContext as ReactTags } from 'react-tag-input';

const Create = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        tags: [],
        location: { city: '', country: '' },
        gallery: [],
        cover: '',
        stock: -1, // Default to unlimited stock
        digital: 0, // Default to not a digital product
        service: 0, // Default to not a service
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleTagsChange = (tags) => {
        setFormData((prevData) => ({
            ...prevData,
            tags,
        }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            location: {
                ...prevData.location,
                [name]: value,
            },
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
        accept: 'image/*',
        onDrop,
    });

    return (
        <>
            <Helmet>
                <title>Criar Novo Produto ou Serviço</title>
                <meta name="description" content="Página para criar um novo produto ou serviço no NED" />
            </Helmet>
            <div className="container mx-auto p-4 mt-6">
                <h1 className="text-2xl font-bold mb-4 capitalize">O Que Está a Vender?</h1>
                <form onSubmit={handleSubmit} className="bg-secondary border shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb -2" htmlFor="name">
                            Nome
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            maxLength={150}
                            required
                            className="py-2 px-4 w-full rounded-md border"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                            Preço (em NED)
                        </label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="py-2 px-4 w-full rounded-md border"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Descrição
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            maxLength={500}
                            required
                            className="py-2 px-4 w-full rounded-md border"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                            Categoria
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="py-2 px-4 w-full rounded-md border"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                            Tags (separadas por enter)
                        </label>
                        <ReactTags 
                            tags={formData.tags}
                            handleDelete={(i) => handleTagsChange(formData.tags.filter((tag, index) => index !== i))}
                            handleAddition={(tag) => handleTagsChange([...formData.tags, tag])}
                            placeholder="Adicione tags"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                            Localização
                        </label>
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                name="city"
                                value={formData.location.city}
                                onChange={handleLocationChange}
                                placeholder="Cidade"
                                required
                                className="py-2 px-4 w-full rounded-md border"
                            />
                            <input
                                type="text"
                                name="country"
                                value={formData.location.country}
                                onChange={handleLocationChange}
                                placeholder="País"
                                required
                                className="py-2 px-4 w-full rounded-md border"
                            />
                        </div>
                    </div>

                    <div {...getRootProps()} className="mb-4 border-dashed border-2 border-gray-400 p-4 text-center">
                        <input {...getInputProps()} />
                        <p>Arraste e solte algumas imagens aqui, ou clique para selecionar imagens</p>
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

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cover">
                            Imagem de Capa (URL)
                        </label>
                        <input
                            type="text"
                            name="cover"
                            value={formData.cover}
                            onChange={ handleChange}
                            className="py-2 px-4 w-full rounded-md border"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                            Stock (digite -1 para ilimitado)
                        </label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="py-2 px-4 w-full rounded-md border"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="digital">
                            Este é um produto digital?
                        </label>
                        <select
                            name="digital"
                            value={formData.digital}
                            onChange={handleChange}
                            className="py-2 px-4 w-full rounded-md border"
                        >
                            <option value="0">Não</option>
                            <option value="1">Sim</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="service">
                            Este é um serviço?
                        </label>
                        <select
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            className="py-2 px-4 w-full rounded-md border"
                        >
                            <option value="0">Não</option>
                            <option value="1">Sim</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className={`bg-primary w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'A Publicar...' : 'Publicar'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Create;