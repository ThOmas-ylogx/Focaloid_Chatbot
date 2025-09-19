import {
    faUser,
    faLock,
    faSpinner,
    faEye,
    faEyeSlash
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useAuthContext } from '../contexts/AuthContext'

const Login = () => {
    const { login, isAuthenticated } = useAuthContext()
    const navigate = useNavigate()
    const location = useLocation()

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const from = location.state?.from?.pathname || '/dashboard'

    // Redirect if already authenticated
    if (isAuthenticated()) {
        return <Navigate to={from} replace />
    }


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const validatePassword = (password) => {
        const symbols = /[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasNumbers = /\d/.test(password)
        const hasSymbols = symbols.test(password)

        const errors = []
        if (!hasUpperCase) errors.push('uppercase letter')
        if (!hasLowerCase) errors.push('lowercase letter')
        if (!hasNumbers) errors.push('number')
        if (!hasSymbols) errors.push('symbol')

        return {
            isValid: errors.length === 0,
            errors: errors
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
        setError('') // Clear error when user starts typing

        // Validate password in real-time
        if (name === 'password') {
            if (value.length === 0) {
                setPasswordError('')
            } else {
                const validation = validatePassword(value)
                if (!validation.isValid) {
                    setPasswordError(
                        `Password must contain at least one ${validation.errors.join(', ')}`
                    )
                } else {
                    setPasswordError('')
                }
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.username.trim() || !formData.password.trim()) {
            setError('Please fill in all fields')
            return
        }

        // Validate password before submission
        const passwordValidation = validatePassword(formData.password)
        if (!passwordValidation.isValid) {
            setPasswordError(
                `Password must contain at least one ${passwordValidation.errors.join(', ')}`
            )
            return
        }

        setIsLoading(true)
        setError('')
        setPasswordError('')

        try {
            const success = await login(formData.username, formData.password)

            if (success) {
                navigate(from, { replace: true })
            } else {
                setError('Invalid username or password')
            }
        } catch (err) {
            console.error(err)
            setError('Login failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>

            <div className="w-full max-w-6xl relative z-10 flex flex-col lg:flex-row gap-8 items-center justify-center">
                {/* Login Form Section */}
                <div className="w-full lg:w-1/2 max-w-md">
                    {/* Login Card */}
                    <div className="bg-gradient-surface rounded-xl shadow-2xl border border-gray-200 p-8 backdrop-blur-md relative overflow-hidden">
                        {/* Card gradient overlay */}
                        <div className="absolute"></div>

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="text-2xl text-white"
                                    />
                                </div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    {'Welcome Back'}
                                </h1>
                                <p className="text-gray-700">
                                    {'Sign in to your account'}
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                    <div className="mt-2 text-md text-gray-600">
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
                            </form>

                            {/* Footer */}
                            <div className="mt-6 text-center">
                                <p className="text-xs text-gray-600">
                                    {'AI - Secure Authentication'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
