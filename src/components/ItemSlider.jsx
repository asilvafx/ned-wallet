import React from 'react';
import { Link } from 'react-router-dom';
import ItemCard from './ItemCard';
import ItemCardSkeleton from './skeleton/ItemCardSkeleton'; // Import the skeleton component

const ItemSlider = ({
                        title = {},
                        items = [],
                        url = "/",
                        viewAll = true,
                        loading = false
                    }) => {
    const { icon, title: titleText, text } = title; // Destructure title object

    return (
        <div>
            {(titleText || text) && (
                <div className="flex flex-col gap-2 mb-5 pt-2">
                    <div className="flex items-center justify-between">
                        {titleText && (
                            <h2 className="text-xl font-semibold capitalize flex flex-nowrap items-center gap-2">
                                <span>{icon}</span>
                                <span>{titleText}</span>
                            </h2>
                        )}
                        {viewAll && (
                            <Link to={url} className="hover:text-primary">
                                <span>Ver todos →</span>
                            </Link>
                        )}
                    </div>
                    {text && (
                        <p className="text-start text-gray-500">
                            {text}
                        </p>
                    )}
                </div>
            )}

            <div className="overflow-x-auto pb-4 mb-6">
                <div className="flex space-x-4">
                    {loading ? (
                        // Show skeletons while loading
                        Array.from({ length: 3 }).map((_, index) => (
                            <ItemCardSkeleton key={index} />
                        ))
                    ) : (
                        // Show actual items
                        items.length > 0 ? (
                            items.map(item => (
                                <ItemCard key={item.id} item={item} />
                            ))
                        ) : (
                            <p className="text-gray-500">No items available.</p> // Handle no items case
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItemSlider;