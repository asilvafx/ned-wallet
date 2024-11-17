import React, { useState, useEffect } from "react";
import { IoIosWallet } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { FaPowerOff } from "react-icons/fa6";
import { GoHomeFill, GoHeartFill } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import { IoIosChatbubbles } from "react-icons/io";
import { RiUser4Fill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import Cookies from 'js-cookie';
import { TbDotsVertical } from "react-icons/tb";
import { fetchUserData, fetchCategories } from "../data/db";
import Offcanvas from './Offcanvas';
import {SiteUrl} from "../data/api";


const Header = () => {
    const isLoggedIn = Cookies.get('isLoggedIn');
    const walletId = Cookies.get('uid');
    const [userInfo, setUserInfo] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false); // State to control offcanvas visibility
    const navigate = useNavigate(); // Initialize useNavigate

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
    }, [walletId]);

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        const searchQuery = e.target.elements.search.value; // Get the search query
        if (searchQuery) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // Redirect to search page
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <>
            <header className="pt-4 px-4 md:fixed w-full top-0 left-0 right-0 bg-body">
                <div className="flex flex-nowrap justify-between items-center w-full">
                    <div className="flex flex-nowrap items-center gap-4">
                        <button className="btn-secondary border text-sm p-2 flex lg:hidden rounded-lg"
                                onClick={() => setShowOffcanvas(true)}>
                            <span className="w-5 h-5 flex items-center justify-center">
                                <TbDotsVertical className="text-lg" />
                            </span>
                        </button>
                        <Link to="/" className="relative">
                        <img src={`${SiteUrl}/public/uploads/files/ned_full.png`} className="h-11 w-auto filter invert"></img>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 ">
                        <div className="items-center gap-2 hidden md:flex">
                            <div className="items-center text-sm hidden lg:flex">
                                <form className="flex items-center border rounded-lg">
                                <input type="text" placeholder="O que estás à procura?"
                                       className="w-full h-full py-2 px-4 rounded-l-lg focus:outline-none text-xs">
                                </input>
                                    <span>
                                        <button type="submit"
                                                className="bg-secondary border-l w-full px-2 py-2 flex items-center gap-2 rounded-r-lg transition duration-200">
                                        <FaSearch className="text-xl p-1 text-color" />
                                        </button>
                                    </span>
                                </form>
                            </div>
                            <Link to="/sell">
                                <button className="bg-secondary border text-color text-sm px-4 py-2 flex gap-2 items-center rounded-lg">
                                    <span className="w-auto h-5 flex gap-2 flex-nowrap items-center justify-center">
                                        <FaPlus className="text-primary" />
                                        <span className="uppercase font-normal text-primary">Novo Anúncio</span>
                                    </span>
                                </button>
                            </Link>
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
                                    <IoIosWallet /> Carteira
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex-nowrap justify-start items-center w-full px-2 py-4 hidden md:flex overflow-x-auto whitespace-nowrap">
                    {categories.map(category => (
                        <Link to={`/${category.emoji}`} key={category.id} className="text-sm rounded-lg flex items-center gap-2 mr-4 p-2 bg-secondary ring-1 ring-gray-800 transition duration-200">

                            <span className="text-center text-md">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </header>
            <div className="header-divider min-h-32 hidden md:block"></div>
            <Offcanvas show={showOffcanvas} onClose={() => setShowOffcanvas(false)} />

        </>
    );
}

export default Header;