
import { faUser, faLock, faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

import CountryDropdown from './CountryDropdown';
import { useLogin } from '../hooks/useLogin';

function LandingPage() {
    const {
        formData,
        isLoading,
        error,
        setError,
        passwordError,
        showPassword,
        setFormData,
        handleInputChange,
        handleSubmit,
        togglePasswordVisibility,
        isAuthenticated
    } = useLogin()

    const navigate = useNavigate();

    const handleCountrySelect = (country) => {
        setError('');
        setFormData({ ...formData, country: country });
    };



    return (
        <div className="flex-1 flex flex-col items-center text-center relative overflow-hidden bg-[#031D3C]">
            <div className="relative z-10 max-w-md w-full px-6 mt-20">
                <div className="bg-white rounded-xl border border-gray-400 p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome to Insurance Q&A bot
                    </h1>

                    {/* Form */}
                    {isAuthenticated ? <button className="w-full mt-6 border border-gray-500 hover:bg-gradient-primary font-semibold py-4 rounded-lg disabled:bg-gradient-surface disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/25 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                        onClick={() => navigate('/chat')}>
                        {'Continue Chat'}
                    </button> : <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-left text-sm font-medium text-gray-700 mb-2"
                            >
                                {'Username'}
                            </label>
                            <div className="relative">
                                <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="text-gray-500"
                                    />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 bg-gradient-glass border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm`}
                                    placeholder={'Enter your username'}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-left text-sm font-medium text-gray-700 mb-2"
                            >
                                {'Password'}
                            </label>
                            <div className="relative">
                                <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="text-gray-500"
                                    />
                                </div>
                                <input
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    id="password"
                                    name="password"
                                    autoComplete="off"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 bg-gradient-glass border ${passwordError
                                        ? 'border-red-400'
                                        : 'border-gray-300'
                                        } rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm`}
                                    placeholder={'Enter your password'}
                                    disabled={isLoading}
                                />
                                {/* Eye Toggle Button */}
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute z-10 inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                    disabled={isLoading}
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            showPassword
                                                ? faEyeSlash
                                                : faEye
                                        }
                                        className="text-sm"
                                    />
                                </button>
                            </div>
                            {/* Password Requirements */}
                            <div className="mt-2 text-sm text-gray-600">
                                <p>
                                    {'Must contain: A-Z, a-z, 0-9, and symbols'}
                                </p>
                            </div>
                            {/* Password Error */}
                            {passwordError && (
                                <div className="mt-2 p-2 bg-gradient-warning/20 border border-red-400/50 rounded-lg backdrop-blur-sm">
                                    <p className="text-red-700 text-md">
                                        {passwordError}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>

                            <label
                                htmlFor="country"
                                className="block text-left text-sm font-medium text-gray-700 mb-2"
                            >
                                Please select a country to get started
                            </label>
                            <CountryDropdown
                                selectedCountry={formData.country}
                                onCountrySelect={handleCountrySelect}
                                placeholder="Choose your country..."
                                className="mb-6 mt-2"
                            />

                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-gradient-warning/20 border border-red-400/50 rounded-lg backdrop-blur-sm">
                                <p className="text-red-700 text-md text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full border border-gray-500 hover:bg-gradient-primary font-semibold py-4 rounded-lg disabled:bg-gradient-surface disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/25 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <FontAwesomeIcon
                                        icon={faSpinner}
                                        className="animate-spin"
                                    />
                                    <span>
                                        {'Signing in...'}
                                    </span>
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>}

                </div>
            </div>
        </div>
    )
}

export default LandingPage
