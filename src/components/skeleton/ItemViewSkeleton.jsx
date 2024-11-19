import React from 'react';

const ItemViewSkeleton = () => {
    return (
        <div className="px-4">
            <div className="flex justify-between items-center mb-4">
                <div className="w-1/2 h-8 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-8 bg-gray-300 rounded"></div>
            </div>

            {/* Skeleton for gallery images */}
            <div className="relative w-full h-64 bg-gray-300 rounded mb-4"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-nowrap items-center gap-2">
                        <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
                        <span className="w-1/4 h-4 bg-gray-300 rounded"></span>
                    </div>
                    <div className="h-20 bg-gray-300 rounded"></div>
                    <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="h-6 bg-gray-300 rounded"></div>
                        ))}
                    </div>
                    <div className="h-6 bg-gray-300 rounded"></div>
                    <div className="h-6 bg-gray-300 rounded"></div>
                </div>
                <div className="relative">
                    <div className="w-full md:w-[75%] md:ms-auto bg-secondary p-4 border rounded-lg">
                        <div className="h-6 bg-gray-300 rounded"></div>
                        <div className="flex flex-nowrap items-center gap-1 mt-4 mb-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 items-center">
                <div className="w-1/4 h-10 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-10 bg-gray-300 rounded"></div>
            </div>

            {/* Related Items Section */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Ver Também</h2>
                <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-40 bg-gray-300 rounded"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ItemViewSkeleton;