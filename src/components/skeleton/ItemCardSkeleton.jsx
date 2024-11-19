import React from 'react';

const ItemCardSkeleton = () => {
    return (
        <div className="min-w-[250px] max-w-[250px] min-h-[300px] flex flex-col items-start bg-card border rounded-lg p-4 w-48 animate-pulse">
            <div className="h-32 w-full bg-gray-400 rounded-md mb-4"></div>
            <div className="h-4 w-3/4 bg-gray-400 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-400 rounded mb-2"></div>
            <div className="h-4 w-2/4 bg-gray-400 rounded mb-4"></div>
            <div className="h-4 w-1/4 bg-gray-400 rounded"></div>
        </div>
    );
};

export default ItemCardSkeleton;