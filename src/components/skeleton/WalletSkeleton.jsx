// src/components/WalletSkeleton.jsx
import React from 'react';

const WalletSkeleton = () => {
    return (
        <div className="px-4">
            <div className="flex items-center justify-between mb-4">
                <div className="w-1/2 h-8 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-8 bg-gray-300 rounded"></div>
            </div>
            <div className="bg-secondary border p-4 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
                    <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
                </div>
                <div className="w-1/2 h-10 bg-gray-300 rounded mb-2"></div>
                <div className="flex items-center justify-between">
                    <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
                    <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
                </div>
                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="rounded-lg h-16 border bg-gray-300 flex items-center justify-center">
                            <div className="w-1/2 h-4 bg-gray-400 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WalletSkeleton;