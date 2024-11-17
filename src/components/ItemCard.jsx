import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa6";

const ItemCard = ({ item }) => {
    return (
        <Link
            to={`/item/${item.id}`}
            key={item.id}
            className="min-w-[250px] min-h-[300px] bg-secondary border rounded-lg shadow-md p-4 overflow-hidden transition-transform transform hover:scale-105"
        >
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
                <p className="text-sm text-gray-500">By {item.author}</p>
                <p className="text-sm text-gray-500 mt-1">{item.location}</p>
                <p className="text-lg font-semibold mt-1">{item.price}</p>

                {/* Badges for Digital and Service */}
                <div className="flex space-x-2 mt-2">

                    {item.service === 1 && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Serviço
                        </span>
                    )}
                    {item.digital === 1 && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Digital
                        </span>
                    )}
                </div>

            </div>
        </Link>
    );
};

export default ItemCard;