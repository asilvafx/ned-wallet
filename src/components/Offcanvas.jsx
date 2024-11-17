import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from "../data/db";

const Offcanvas = ({ show, onClose }) => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchCategoriesData = async () => {
            try {
                const fetchedCategories = await fetchCategories();
                if (Array.isArray(fetchedCategories)) {
                    setCategories(fetchedCategories);
                } else {
                    throw new Error("Fetched data is not an array");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                setError("Failed to load categories."); // Set error message
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };
        fetchCategoriesData();
    }, []);

    if (!show) return null; // Don't render if not visible

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute left-0 top-0 h-full w-68 bg-color rounded-r-lg px-4 pb-4 shadow-lg overflow-y-auto">
                <div className="w-full relative sticky bg-color top-0 left-0 right-0 pt-3 px-2">
                    <button
                        onClick={onClose}
                        className="py-1 px-3 text-md rounded-md bg-alt border absolute top-4 right-2 flex items-center justify-center"
                    >
                        <span>✖</span>
                    </button> {/* Close button */}
                    <h2 className="text-xl font-bold mb-4 py-2 text-primary">NED<span className="text-color">.PT</span></h2>
                </div>

                <h3 className="text-lg font-semibold mb-2 text-gray-500">Categorias</h3>

                {loading ? (
                    <div>Loading categories...</div> // Loading state
                ) : error ? (
                    <div className="text-red-500">{error}</div> // Error message
                ) : categories.length === 0 ? (
                    <div>No categories available.</div> // No categories message
                ) : (
                    <ul className="w-full flex flex-col gap-1 space-y-2">
                        {categories.map(category => (
                            <li key={category.id} className="btn bg-secondary border rounded-lg w-full py-2 px-4">
                                <Link to={`/${category.slug}`} className="text-color hover:text-primary flex justify-between items-center">
                                    <span>{category.name}</span>
                                    <span>→</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                <h3 className="text-lg font-semibold mt-4 text-gray-500 mb-2">Legal Information</h3>
                <div className="flex flex-col gap-1">
                    <Link to="/terms" className="text-sm text-primary hover:underline">Terms of Service</Link>
                    <Link to="/privacy" className="text-sm text-primary hover:underline">Privacy Policy</Link>
                </div>
            </div>
        </div>
    );
};

export default Offcanvas;