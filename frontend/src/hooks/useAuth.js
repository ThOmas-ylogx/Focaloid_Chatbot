import { useState, useEffect } from 'react'

export const useAuth = () => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in on app load
        const token = localStorage.getItem('authToken')
        const username = localStorage.getItem('username')

        if (token && username) {
            setUser({ username, token })
        }
        setIsLoading(false)
    }, [])

    const login = (username, password) => {
        return new Promise((resolve) => {
            // Simulate API call delay
            setTimeout(() => {
                // Simple validation - in real app, this would be an API call
                if (username.trim() && password.trim()) {
                    const token = `fe-jwt-token-${Date.now()}`

                    // Store in localStorage
                    localStorage.setItem('authToken', token)
                    localStorage.setItem('username', username)

                    // Update state
                    setUser({ username, token })
                    resolve(true)
                } else {
                    resolve(false)
                }
            }, 500) // Simulate network delay
        })
    }

    const logout = () => {
        // Clear localStorage
        localStorage.removeItem('authToken')
        localStorage.removeItem('username')

        // Clear state
        setUser(null)
    }

    const isAuthenticated = () => {
        return !!user?.token
    }

    return {
        user,
        isLoading,
        login,
        logout,
        isAuthenticated
    }
}
