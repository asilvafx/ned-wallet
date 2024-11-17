import React, { useState, useEffect } from "react";
import { IoIosWallet } from "react-icons/io";
import { Link } from 'react-router-dom';
import { IoMdApps } from "react-icons/io";
import { FaPowerOff } from "react-icons/fa6";
import { GoHomeFill, GoHeartFill } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import { IoIosChatbubbles } from "react-icons/io";
import { RiUser4Fill } from "react-icons/ri";
import Cookies from 'js-cookie';
import { fetchUserData, fetchCategories } from "../data/db";

const Header = () => {
    const isLoggedIn = Cookies.get('isLoggedIn');
    const walletId = Cookies.get('uid');

    const [userInfo, setUserInfo] = useState({ }); // Initialize with default value
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {

        const fetchCategoriesData = async () => {
            const fetchedCategories = await fetchCategories();
            setCategories(fetchedCategories);
        };

        fetchCategoriesData();

        const fetchData = async () => {
            try {
                if (!walletId) { return; }
                const userData = await fetchUserData(walletId);
                if (userData) {
                    setUserInfo(userData);
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
    }, [walletId]); // Add walletId as a dependency

    if (loading) {
        return <div>Loading...</div>; // Optional loading state
    }

    return (
        <>
            <header className="p-4 md:fixed w-full top-0 left-0 right-0 bg-body">
                <div className="flex flex-nowrap justify-between items-center w-full">
                    <button className="text-sm p-2 flex rounded-lg">
                        <span className="w-5 h-5 flex items-center justify-center">
                            <IoMdApps className="text-lg" />
                        </span>
                    </button>
                    <div className="flex items-center gap-2 ">
                        <div className="items-center gap-2 me-4 hidden md:flex">
                             <Link to="/">
                                <button className="bg-secondary border text-color text-sm px-4 py-2 flex gap-2 items-center rounded-lg">
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        <GoHomeFill className="text-lg" />
                                    </span>
                                </button>
                             </Link>
                            <Link to="/favorites">
                                <button className="bg-secondary border text-color text-sm px-4 py-2 flex gap-2 items-center rounded-lg">
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        <GoHeartFill className="text-lg" />
                                    </span>
                                </button>
                             </Link>
                            <Link to="/sell">
                                <button className="bg-secondary border text-color text-sm px-4 py-2 flex gap-2 items-center rounded-lg">
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        <FaPlus className="text-lg" />
                                    </span>
                                </button>
                             </Link>
                            <Link to="/chat">
                                <button className="bg-secondary border text-color text-sm px-4 py-2 flex gap-2 items-center rounded-lg">
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        <IoIosChatbubbles className="text-lg" />
                                    </span>
                                </button>
                             </Link>
                            <Link to="/profile">
                                <button className="bg-secondary border text-color text-sm px-4 py-2 flex gap-2 items-center rounded-lg">
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        <RiUser4Fill className="text-lg" />
                                    </span>
                                </button>
                             </Link>
                        </div>
                        {isLoggedIn && walletId ? ( // Check if user is logged in and walletId is not null
                            <>
                                <Link to="/wallet">
                                    <button className="text-sm px-4 py-2 flex gap-2 items-center rounded-lg">
                                        <span className="bg-primary text-alt p-1 flex items-center justify-center w-5 h-5 text-xs rounded-full">U</span>
                                        {userInfo.last_balance !== undefined && !isNaN(userInfo.last_balance)
                                            ? parseFloat(userInfo.last_balance).toFixed(4)
                                            : "0.0000"}
                                    </button>
                                </Link>
                                <Link to="/logout">
                                    <button className="btn-danger text-sm px-4 py-2 flex gap-2 items-center rounded-lg">
                                        <span className="w-5 h-5 flex items-center justify-center">
                                            <FaPowerOff className="text-lg" />
                                        </span>
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <Link to="/connect">
                                <button className="text-sm px-4 py-2 rounded-lg flex items-center gap-1">
                                    <IoIosWallet /> Connect Wallet
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex-nowrap justify-start items-center w-full my-2 p-2 hidden md:flex overflow-x-auto whitespace-nowrap">
                    {categories.map(category => (
                        <Link to={`/${category.emoji}`} key={category.id} className="text-sm rounded-lg flex items-center gap-2 mr-4 p-2 bg-secondary ring-1 ring-gray-800 transition duration-200">
                            <span className="text-md">{category.emoji}</span>
                            <span className="text-center text-md">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </header>
            <div class="header-divider min-h-32 hidden md:block"></div>
        </>
    );
}

export default Header;