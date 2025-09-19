import { useState, useRef, useEffect } from 'react';
import { countries, searchCountries } from '../data/countries';

function CountryDropdown({ 
    selectedCountry, 
    onCountrySelect, 
    placeholder = "Select a country...",
    className = "",
    disabled = false 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCountries, setFilteredCountries] = useState(countries);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Filter countries based on search query
    useEffect(() => {
        setFilteredCountries(searchCountries(searchQuery));
    }, [searchQuery]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleToggle = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
        setSearchQuery('');
    };

    const handleCountrySelect = (country) => {
        onCountrySelect(country);
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                className={`
                    w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    hover:border-gray-400 transition-colors duration-200
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
                `}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {selectedCountry ? (
                            <>
                                <span className="text-lg">{selectedCountry.flag}</span>
                                <span className="text-gray-900 font-medium">
                                    {selectedCountry.name}
                                </span>
                            </>
                        ) : (
                            <span className="text-gray-500">{placeholder}</span>
                        )}
                    </div>
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200">
                        <div className="relative">
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Search countries..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Countries List */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => handleCountrySelect(country)}
                                    className={`
                                        w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
                                        transition-colors duration-150 flex items-center space-x-3
                                        ${selectedCountry?.code === country.code ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}
                                    `}
                                >
                                    <span className="text-lg">{country.flag}</span>
                                    <span className="font-medium">{country.name}</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">
                                No countries found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CountryDropdown;
