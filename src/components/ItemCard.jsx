import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
    return (
        <Link
            to={`/item/${item.id}`}
            key={item.id}
            className="min-w-[250px] min-h-[300px] bg-secondary border rounded-lg shadow-md p-4 overflow-hidden transition-transform transform hover:scale-105"
        >
            <img src={item.cover} alt={item.name} className="w-full h-40 object-cover rounded-md mb-2" />
            <div className="flex flex-col h-full">
                <h3 className="text-lg font-medium mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600">By {item.author}</p>
                <p className="text-lg font-semibold mt-1">{item.price}</p>

                {/* Badges for Digital and Service */}
                <div className="flex space-x-2 mt-2">
                    {item.digital === 1 && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                            Digital
                        </span>
                    )}
                    {item.service === 1 && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                            Service
                        </span>
                    )}
                </div>

                {/* Location and Category */}
                <p className="text-sm text-gray-500 mt-1">{item.location}</p>
                <p className="text-sm text-gray-500">{item.category}</p>

                {/* Tags */}
                <div className="flex flex-wrap mt-2">
                    {item.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-200 text-gray-700 text-xs font-medium mr-1 mb-1 px-2.5 py-0.5 rounded">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default ItemCard;