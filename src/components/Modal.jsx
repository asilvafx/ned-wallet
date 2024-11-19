import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ onClose, children }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-color rounded-lg shadow-lg p-6 max-w-lg w-full relative m-4">
                <button
                    onClick={onClose}
                    className="px-3 py-1 rounded-lg text-xl btn-danger absolute top-4 right-4"
                >
                    &times; {/* Close icon */}
                </button>
                {children}
            </div>
        </div>
    );
};

Modal.propTypes = {
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default Modal;