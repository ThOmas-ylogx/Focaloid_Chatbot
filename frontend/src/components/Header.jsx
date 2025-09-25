import {
    faUser,
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
                <div className='shadow-2xl p-2 bg-gray-500 rounded-lg' >
                    <img src="https://www.focaloid.com/wp-content/uploads/2025/04/Focaloid_logo_inverted-1.svg" alt="logo" className="max-w-35" />
                </div>

                <div className="flex items-center flex-wrap gap-4">

                    {user?.username && <div className="relative">
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
                                {user?.username}
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
                    </div>}

                </div>
            </div>
        </header>
    )
}

export default Header
