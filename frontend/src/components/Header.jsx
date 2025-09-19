import {
    faUser,
    faHome,
    faChevronDown,
    faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthContext } from '../contexts/AuthContext';

function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuthContext()
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef(null)

    const handleLogout = () => {
        logout()
        navigate('/login')
        setShowDropdown(false)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <header className="px-6 md:px-10 py-4 border-b border-gray-300 flex-shrink-0 z-[50] relative">


            <div className="mx-auto flex items-center justify-between relative z-10">
                <button onClick={() => navigate('/dashboard')}>
                    <h1 className="text-3xl text-display">
                        Focaloid POC
                    </h1>
                </button>
                <div className="flex items-center flex-wrap gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        title="Home"
                        className="text-white w-12 h-10 rounded-lg bg-gradient-glass hover:bg-gradient-primary transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                    >
                        <FontAwesomeIcon icon={faHome} className="text-lg" />
                    </button>

                    {/* <button className="!cursor-not-allowed text-white w-12 h-10 rounded-lg bg-gradient-glass hover:bg-gradient-primary transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                        <FontAwesomeIcon icon={faCog} className="text-lg" />
                    </button> */}


                    <div className="relative">
                        <button
                            className="flex items-center gap-2 bg-gradient-glass px-3 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-400">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-black text-xs"
                                />
                            </div>
                            <span className="text-black text-md font-semibold hidden sm:block truncate max-w-[100px]">
                                {user?.username || 'User'}
                            </span>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className={`text-black text-xs transition-transform duration-300`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-gradient-surface border border-gray-200 rounded-lg shadow-2xl z-[51] backdrop-blur-md">
                                <div className="py-1">
                                    {/* User Info */}
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <div className="flex justify-center items-center gap-2">
                                            <FontAwesomeIcon
                                                icon={faUser}
                                                className="text-black text-xs"
                                            />
                                            <p className="text-md text-gray-800 font-medium">
                                                {user?.username}
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-600">
                                            {'Logged in'}
                                        </p>
                                    </div>

                                    {/* Logout Button */}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-md flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} />
                                        {'Logout'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </header>
    )
}

export default Header
