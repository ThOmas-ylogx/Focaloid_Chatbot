import { useState, useEffect } from 'react';

import CountryDropdown from './CountryDropdown';

function CountrySelectionModal({ 
    isOpen, 
    onClose, 
    onCountrySelect, 
    currentCountry 
}) {
    const [selectedCountry, setSelectedCountry] = useState(currentCountry);

    // Update selectedCountry when currentCountry changes
    useEffect(() => {
        setSelectedCountry(currentCountry);
    }, [currentCountry]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
    };

    const handleConfirm = () => {
        if (selectedCountry) {
            onCountrySelect(selectedCountry);
            onClose();
        }
    };

    const handleCancel = () => {
        setSelectedCountry(currentCountry); // Reset to original
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <button 
                className="absolute inset-0 backdrop-blur-[0.5px]"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] ">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Change Country
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <p className="text-gray-600 mb-6">
                        Select a new country to change your current location settings.
                    </p>

                    <CountryDropdown
                        selectedCountry={selectedCountry}
                        onCountrySelect={handleCountrySelect}
                        placeholder="Choose a country..."
                        className="mb-6"
                    />

                    {selectedCountry && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <span className="font-medium">Selected:</span> {selectedCountry.flag} {selectedCountry.name}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 rounded-lg transition-colors duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedCountry}
                            className={`px-4 py-2 rounded-lg transition-colors duration-200 border border-gray-400 ${
                                selectedCountry
                                    ? 'bg-white border border-gray-300 rounded-lg'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CountrySelectionModal;
