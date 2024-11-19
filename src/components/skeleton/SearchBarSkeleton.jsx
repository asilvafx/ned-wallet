import React from 'react';

const SearchBarSkeleton = () => {
    return (
        <div className="mb-6 animate-pulse">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <div className="flex-1 relative mb-4 md:mb-0">
                    <div className="w-full p-2 border rounded-lg bg-gray-300 h-8"></div>
                </div>
                <div className="flex md:min-w-[250px] relative mb-4 md:mb-0">
                    <div className="w-full p-2 border rounded-lg bg-gray-300 h-8"></div>
                </div>
                <div className="flex md:min-w-[250px] relative mb-4 md:mb-0">
                    <div className="w-full p-2 border rounded-lg bg-gray-300 h-8"></div>
                </div>
                <div className="flex p-0 md:p-1">
                    <div className="w-full px-4 py-0 bg-primary text-color flex items-center gap-2 rounded-lg transition duration-200">
                        <div className="h-8 w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBarSkeleton;