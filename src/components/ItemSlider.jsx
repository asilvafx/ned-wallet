import React from 'react';
import { Link } from 'react-router-dom';
import ItemCard from './ItemCard';

const ItemSlider = ({ title = {}, items, url = "/", viewAll = true }) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold capitalize flex flex-nowrap items-center gap-2">
                    <span>{title.icon}</span>
                    <span>{title.text}</span>
                </h2>
                {viewAll && (
                    <Link to={url} className="hover:text-primary">
                        <span>Ver todos →</span>
                    </Link>
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