import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Cookies from 'js-cookie';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BaseUrl, Key } from '../data/api';
import { fetchUserData } from '../data/db';

const Profile = () => {
    const walletId = Cookies.get('uid');
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '', // Optional: Handle password if needed
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(!walletId){ return; }
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
    }, []);

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
            const walletId = Cookies.get('uid');
            const response = await axios.put(`${BaseUrl}/accounts/world_id/${walletId}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Key}`, // Replace with your actual API key
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <Helmet>
                <title>Profile</title>
                <meta name='description' content='User  profile page' />
            </Helmet>
            <Header />
            <div className="px-4 mt-8">
                <h1 className="text-xl mb-4">Profile</h1>
                <form onSubmit={handleSubmit} className="bg-secondary border rounded-lg p-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    {/* Optional <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    {/* Add other fields as necessary */}
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-md"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default Profile;