import React from 'react';
import { Link } from 'react-router-dom';
import { GoHomeFill } from "react-icons/go";
import { IoChevronForward } from "react-icons/io5";

const Breadcrumbs = ({ links }) => {
    return (
        <nav className="flex p-4 mt-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <Link to="/">
                    <GoHomeFill className="text-gray-700 hover:text-primary" />
                </Link>
                {links.map((link, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            {index > 0 && <IoChevronForward />}
                            <Link to={link.path} className={`ml-1 text-sm font-medium ${index === links.length - 1 ? 'text-gray-500' : 'text-gray-700 hover:text-primary'}`}>
                                {link.label}
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;