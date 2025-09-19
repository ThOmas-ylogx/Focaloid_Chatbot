
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CountryDropdown from './CountryDropdown';

function LandingPage() {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const navigate = useNavigate();

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
    };

    const handleContinue = () => {
        if (selectedCountry) {
            navigate('/chat', { 
                state: { 
                    selectedCountry: selectedCountry 
                } 
            });
        } else {
            alert('Please select a country first');
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center text-center relative overflow-hidden">
            <div className="relative z-10 max-w-md w-full px-6 mt-20">
                <div className="bg-white rounded-xl border border-gray-400 p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome to Focaloid
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Please select a country to get started
                    </p>
                    
                    <CountryDropdown
                        selectedCountry={selectedCountry}
                        onCountrySelect={handleCountrySelect}
                        placeholder="Choose your country..."
                        className="mb-6"
                    />

                    {selectedCountry && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <span className="font-medium">Selected:</span> {selectedCountry.flag} {selectedCountry.name}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleContinue}
                        disabled={!selectedCountry}
                        className={`w-full mt-6 font-medium py-3 px-4 rounded-lg transition-colors duration-200 border border-gray-400 ${
                            selectedCountry
                                ? 'bg-white hover:bg-gray-100 text-gray-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {selectedCountry ? 'Continue to Chat' : 'Please select a country first'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
