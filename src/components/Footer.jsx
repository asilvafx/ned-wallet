
import React from "react";
import { Link } from 'react-router-dom';
import { GoHomeFill, GoHeartFill } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import { IoIosChatbubbles } from "react-icons/io";
import { RiUser4Fill } from "react-icons/ri";

const Footer = () => {

    return (
        <>
            <div className="footer-divider min-h-28">

            </div>

            <footer className="fixed md:hidden bottom-0 left-0 right-0 bg-color px-4 pt-1 pb-3 flex justify-around items-center shadow-md">
                <Link to="/" className="text-center p-2 border-b border-primary">
                    <GoHomeFill className="text-xl" />
                </Link>
                <Link to="/favorites" className="text-center p-2">
                    <GoHeartFill className="text-xl" />
                </Link>
                <Link to="/sell" className="text-center p-2">
                    <div className="bg-primary text-color p-3 rounded-full">
                        <FaPlus className="text-2xl" />
                    </div>
                </Link>
                <Link to="/chat" className="text-center p-2">
                    <IoIosChatbubbles className="text-xl" />
                </Link>
                <Link to="/profile" className="text-center p-2">
                    <RiUser4Fill  className="text-xl" />
                </Link>
            </footer>
        </>
    );
}

export default Footer;