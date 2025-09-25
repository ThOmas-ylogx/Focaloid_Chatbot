import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useAuthContext } from '../contexts/AuthContext'

export const useLogin = () => {
    const { login, isAuthenticated } = useAuthContext()
    const navigate = useNavigate()
    const location = useLocation()

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        country: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const from = location.state?.from?.pathname || '/chat'

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

        if (!formData.username.trim() || !formData.password.trim() || !formData.country) {
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
            const success = await login(formData.username, formData.password, formData.country)

            if (success) {
                navigate('/chat', {
                    replace: true,
                    state: {
                        selectedCountry: formData.country
                    }
                })
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

    return {
        // State
        formData,
        isLoading,
        error,
        passwordError,
        showPassword,
        from,
        isAuthenticated: isAuthenticated(),

        // Actions
        setFormData,
        setError,
        handleInputChange,
        handleSubmit,
        togglePasswordVisibility,
        validatePassword
    }
}
