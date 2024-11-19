import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa6";
import Avatar from './Avatar';

const ItemCard = ({ item }) => {
    return (
        <Link
            to={`/item/${item.uid}`}
            key={item.id}
            className="min-w-[250px] max-w-[250px] min-h-[300px] overflow-hidden transition-transform transform hover:scale-105"
        >
            <div className="w-full bg-secondary border p-4 rounded-lg shadow-md">

            <div className="relative">
                {/* Item Image */}
                <img src={item.cover} alt={item.name} className="w-full h-40 object-cover rounded-md mb-2" />

                {/* Category Badge */}
                <span className="absolute top-2 left-2 bg-color text-color text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                {item.category}
                </span>
                {/* Like Button */}
                <button className="absolute top-2 right-2 bg-alt rounded-full p-1">
                    <FaRegHeart className="text-alt text-lg" />
                </button>
            </div>

            <div className="flex flex-col h-full">
                {/* Item & Author Information */}
                <h3 className="text-lg font-medium mb-1">{item.name}</h3>
                <div className="flex flex-nowrap items-center gap-1">
                    <Avatar id={item.author} size={16} round={true} density={1} />
                    <p className="text-sm text-gray-500">{item?.author && item.author.length > 10 ? `${item.author.slice(0, 5)}...${item.author.slice(-4)}` : item.author}</p>
                </div>

                <p className="text-sm text-gray-500 mt-1">{item.city}, {item.country}</p>
                <p className="text-lg font-semibold mt-1">{item.price} NED</p>

                {/* Badges for Digital and Service */}
                <div className="flex space-x-2 mt-2">

                    {item.service === 1 && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Serviço
                        </span>
                    )}
                    {item.digital === 1 && (
                        <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                            Digital
                        </span>
                    )}
                </div>
            </div>
            </div>
        </Link>
    );
};

export default ItemCard;