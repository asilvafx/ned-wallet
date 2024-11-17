import React from 'react';
import { Link } from 'react-router-dom';
import ItemCard from './ItemCard';

const ItemSlider = ({ title = {}, items, url = "/", viewAll = true }) => {
    return (
        <div>
            <div className="flex flex-col gap-2 mb-5 pt-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold capitalize flex flex-nowrap items-center gap-2">
                        <span>{title.icon}</span>
                        <span>{title.title}</span>
                    </h2>
                    {viewAll && (
                        <Link to={url} className="hover:text-primary">
                            <span>Ver todos →</span>
                        </Link>
                    )}
                </div>
                {title.text && (
                    <p className="text-start text-gray-500">
                        {title.text}
                    </p>
                )}
            </div>

            <div className="overflow-x-auto pb-4 mb-6">
                <div className="flex space-x-4">
                    {items.map(item => (
                        <ItemCard key={item.id} item={item} /> // Use ItemCard component
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ItemSlider;