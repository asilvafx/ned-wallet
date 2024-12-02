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
import { SITE_URL } from "../data/config";
import Offcanvas from './Offcanvas';
import Avatar from "./Avatar";
import HeaderSkeleton from "./skeleton/HeaderSkeleton";

const Header = () => {
    const isLoggedIn = Cookies.get('isLoggedIn');
    const walletId = Cookies.get('uid');
    const [userInfo, setUserInfo] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    const [showOffcanvas, setShowOffcanvas] = useState(false); // State to control offcanvas visibility
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchCategoriesData = async () => {
            try {
                const fetchedCategories = await fetchCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                setError('Failed to load categories.');
            }
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
        e.preventDefault(); // Prevent the default form submission
        if (searchQuery.trim()) {
            navigate(`/listings?query=${encodeURIComponent(searchQuery)}`); // Navigate to the search page with the query
            setSearchQuery(''); // Clear the search input after submitting
        }
    };

    if (loading) {
        return <HeaderSkeleton />;
    }

    return (
        <>
        <header className="pt-3 pb-2 px-4 md:fixed w-full top-0 left-0 right-0 bg-body border-b border-color">
            <div className="flex flex-nowrap justify-between items-center w-full">
                <div className="flex flex-nowrap items-center gap-4">
                    <button className="btn-secondary border text-sm p-2 flex lg:hidden rounded-lg"
                            onClick={() => setShowOffcanvas(true)}>
                            <span className="w-5 h-5 flex items-center justify-center">
                                <TbDotsVertical className="text-lg" />
                            </span>
                    </button>
                    <Link to="/" className="relative">
                        <img src={`${SITE_URL}/public/uploads/files/ned_full.png`} className="h-11 w-auto site-logo" alt="Logo" />
                    </Link>
                </div>

                <div className="flex items-center gap-2 ">
                    <div className="items-center gap-2 hidden md:flex">
                        <div className="items-center text-sm hidden lg:flex">
                            <form onSubmit={handleSearchSubmit} className="flex items-center border rounded-lg bg-secondary">
                                <input
                                    type="text"
                                    placeholder="O que estás à procura?"
                                    className="w-full h-full py-2 px-4 rounded-l-lg focus:outline-none text-xs bg-transparent"
                                    value={searchQuery} // Bind input value to state
                                    onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
                                />
                                <span>
                                        <button type="submit"
                                                className="bg-secondary border-l border-gray-300 w-full px-2 py-2 flex items-center gap-2 rounded-r-lg transition duration-200">
                                            <FaSearch className="text-xl p-1 text-color" />
                                        </button>
                                    </span>
                            </form>
                        </div>
                        <Link to="/create">
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
                            <button className="bg-secondary border text-color text-sm px-4 py-2 flex gap-2 items-center rounded-lg relative">
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        <IoIosChatbubbles className="text-lg" />
                                    </span>
                                <span className="absolute top-[-5px] right-[-3px] flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                    </span>
                            </button>
                        </Link>
                        <Link to="/profile">
                            <button className="bg-secondary border text-color text-sm px-4 py-2 flex gap-2 items-center rounded-lg relative">
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        <RiUser4Fill className="text-lg" />
                            </span>
                            <span className="absolute top-[-5px] right-[-3px] flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                    </span>
                        </button>
                    </Link>
                </div>
                {isLoggedIn && walletId ? ( // Check if user is logged in and walletId is not null
                    <>
                        <Link to="/wallet">
                            <button className="text-sm px-4 py-2 flex gap-2 items-center rounded-lg">
                                <Avatar id={walletId} size={16} round={true} density={1} />
                                {userInfo.last_balance !== undefined && !isNaN(userInfo.last_balance)
                                    ? parseFloat(userInfo.last_balance).toFixed(2)
                                    : "0.00"}
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
        <div className="flex-nowrap justify-start items-center w-full px-2 pt-4 pb-2 hidden md:flex overflow-x-auto whitespace-nowrap">
            {categories.map(category => (
                <Link to={`/listings?category=${category.name}`} key={category.id} className="text-sm rounded-lg flex items-center gap-2 mr-4 p-2 bg-secondary ring-1 ring-gray-800 transition duration-200">
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