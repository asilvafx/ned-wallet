import React, { useState, useEffect } from 'react';

// Function to generate a random color
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const AutoplaySlider = ({ banners }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [banners.length]);

    return (
        <div className="mt-10 relative">
            <div className="overflow-hidden rounded-lg shadow-md relative h-60 w-full"> {/* Make sure the parent is relative */}
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`} // Use absolute positioning for overlapping
                        style={{ backgroundColor: banner.color || getRandomColor() }} // Set background color
                    >
                        <div className="flex items-center justify-center h-full"> {/* Center the text */}
                            <div className="text-center text-white p-4">
                                <h2 className="text-2xl font-bold">{banner.title}</h2>
                                <p className="text-lg">{banner.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 mx-1 rounded-full transition duration-300 ${index === currentSlide ? 'bg-primary' : 'bg-at'}`}
                        onClick={() => setCurrentSlide(index)} // Allow manual navigation
                    />
                ))}
            </div>
        </div>
    );
};

export default AutoplaySlider;