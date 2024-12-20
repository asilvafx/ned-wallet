import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import {API_URL, API_KEY, SITE_URL} from '../data/config';
import { fetchItems, fetchUserData } from '../data/db';
import NotLoggedIn from '../components/NotLoggedIn';
import ItemCard from "../components/ItemCard";
import Breadcrumbs from "../components/Breadcrumbs";

const Profile = () => {
    const isLoggedIn = Cookies.get('isLoggedIn');
    const walletId = Cookies.get('uid');
    const [items, setItems] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '', // Optional: Handle password if needed
    });

    useEffect(() => {

        const fetchAllItems = async () => {

            try {
            const fetchedItems = await fetchItems();
            setItems(fetchedItems);
            } catch (fetchError) {
                setError('Failed to fetch items.');
            }
        };

        fetchAllItems();

        const fetchData = async () => {
            if (!walletId) {
                setLoading(false);
                return;
            }
            try {
                const userData = await fetchUserData(walletId);
                if (userData) {
                    setUserInfo(userData);
                    setFormData({
                        username: userData.username || '',
                        email: userData.email || '',
                        password: '', // Do not pre-fill password for security reasons
                    });
                } else {
                    setError('User  data not found.');
                }
            } catch (fetchError) {
                setError('Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [walletId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${API_URL}/accounts/world_id/${walletId}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                },
            });

            if (response.status === 200) {
                const updatedUserInfo = { ...userInfo, ...formData };
                setUserInfo(updatedUserInfo);
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile. Please try again.');
        }
    };

    // Define breadcrumbsLinks only after items are fetched
    const breadcrumbsLinks = [
        { label: 'Home', path: '/' },
        { label: 'Perfil', path: '/profile' },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
        return (
            <>
            <NotLoggedIn text="Por favor, inicia sessão para veres o teu perfil" />
            </>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <>
            <Helmet>
                <title>O Meu Perfil</title>
                <meta name='description' content='User  profile page' />
            </Helmet>
            <Breadcrumbs links={breadcrumbsLinks} />
            <div className="px-4">
                <div className="bg-secondary border rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold capitalize">O Meu Perfil</h1>
                        <span className="relative">
                        <button
                        onClick={() => setEditing(true)}
                        className="bg-primary text-white py-2 px-4 rounded-md"
                        >
                        Editar Perfil
                        </button>
                        </span>
                    </div>
                    <div className="flex items-center mb-4">
                        <img
                            src={userInfo.profileImage || SITE_URL + '/public/uploads/files/placeholder.png' } // Use a placeholder if no image
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-2 border-gray-300 mr-4 p-1"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{userInfo.username ?? 'NA'}</h2>
                            {userInfo.email ? (
                                <p className="text-gray-600">{userInfo.email}</p>
                            ) : (
                                <Link to="/profile/edit" className="text-blue-500 underline">
                                    Adicionar endereço de email
                                </Link>
                            )}

                        </div>
                    </div>

                </div>

                <div className="bg-secondary border rounded-lg p-6">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <h2 className="text-xl font-bold capitalize flex items-center">
                            <span className="flashing-bullet mr-2"></span>
                            Anúncios Activos
                        </h2>
                        <Link to="/profile" className="text-sm text-gray-500 hover:text-primary">
                            Ver todos →
                        </Link>
                    </div>

                    {/* User listings, replace with actual data */}
                    <div className="grid grid-cols-4 gap-2">
                        {items.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;