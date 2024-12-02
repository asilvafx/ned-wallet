import React from "react";
import {TbDotsVertical} from "react-icons/tb";
import {Link} from "react-router-dom";
import {FaSearch} from "react-icons/fa";
import {FaPlus} from "react-icons/fa6";
import {GoHeartFill, GoHomeFill} from "react-icons/go";
import {IoIosChatbubbles} from "react-icons/io";
import {RiUser4Fill} from "react-icons/ri";

const HeaderSkeleton = () => {

    return (
        <header className="pt-3 pb-2 px-4 md:fixed w-full top-0 left-0 right-0 bg-body border-b border-color">
            <div className="flex flex-nowrap justify-between items-center w-full">
                <div className="flex flex-nowrap items-center gap-4">
                    <button className="btn-secondary border text-sm p-2 flex lg:hidden rounded-lg">
                            <span className="w-5 h-5 flex items-center justify-center">
                                <TbDotsVertical className="text-lg" />
                            </span>
                    </button>
                 
                </div>

                <div className="flex items-center gap-2 ">
                    <div className="items-center gap-2 hidden md:flex">
                        <div className="items-center text-sm hidden lg:flex">
                            <form className="flex items-center border rounded-lg">
                                <input
                                    type="text"
                                    name="search" // Add name attribute to access the input value
                                    placeholder="O que estás à procura?"
                                    className="w-full h-full py-2 px-4 rounded-l-lg focus:outline-none text-xs"
                                />
                                <span>
                                <button
                                    type="button"
                                    className="bg-secondary border-l w-full px-2 py-2 flex items-center gap-2 rounded-r-lg transition duration-200"
                                >
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
                    <button className="px-4 py-2 bg-slate-700 rounded col-span-1 min-h-8 min-w-14"> </button>
                    <button className="px-4 py-2 bg-slate-700 rounded col-span-1 min-h-8 min-w-10"> </button>
                </div>
            </div>
            <div className="flex-nowrap justify-start items-center w-full px-2 pt-4 pb-2 hidden md:flex overflow-x-auto whitespace-nowrap">
                <span className="min-h-6 min-w-20 text-sm rounded-lg flex items-center gap-2 mr-4 p-2 bg-slate-700 ring-1 ring-gray-800 transition duration-200"></span>
                <span className="min-h-6 min-w-20 text-sm rounded-lg flex items-center gap-2 mr-4 p-2 bg-slate-700 ring-1 ring-gray-800 transition duration-200"></span>
                <span className="min-h-6 min-w-20 text-sm rounded-lg flex items-center gap-2 mr-4 p-2 bg-slate-700 ring-1 ring-gray-800 transition duration-200"></span>
                <span className="min-h-6 min-w-20 text-sm rounded-lg flex items-center gap-2 mr-4 p-2 bg-slate-700 ring-1 ring-gray-800 transition duration-200"></span>
                <span className="min-h-6 min-w-20 text-sm rounded-lg flex items-center gap-2 mr-4 p-2 bg-slate-700 ring-1 ring-gray-800 transition duration-200"></span>
                <span className="min-h-6 min-w-20 text-sm rounded-lg flex items-center gap-2 mr-4 p-2 bg-slate-700 ring-1 ring-gray-800 transition duration-200"></span>
                <span className="min-h-6 min-w-20 text-sm rounded-lg flex items-center gap-2 mr-4 p-2 bg-slate-700 ring-1 ring-gray-800 transition duration-200"></span>
            </div>
        </header>
    );
};

export default HeaderSkeleton;
