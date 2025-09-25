import {
    faHome,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

const NotFound = () => {

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 relative overflow-hidden">

            {/* Animated gradient orbs */}
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="text-center max-w-md mx-auto relative z-10">
                {/* Error Icon */}
                <div className="w-24 h-24 bg-gradient-warning/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-red-400/30">
                    <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-4xl text-red-600"
                    />
                </div>

                {/* Error Code */}
                <h1 className="text-8xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    404
                </h1>

                {/* Error Message */}
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    {'Page Not Found'}
                </h2>

                <p className="text-gray-700 mb-8 leading-relaxed">
                    {'The page you are looking for doesn\'t exist or has been moved.'}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 bg-gradient-secondary hover:bg-gradient-primary text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                        <FontAwesomeIcon icon={faHome} />
                        {'Go Home'}
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 bg-gradient-surface hover:bg-gradient-accent text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25"
                    >
                        {'Go Back'}
                    </button>
                </div>

                {/* Additional Help */}
                <div className="mt-8 p-4 bg-gradient-glass rounded-lg border border-gray-200 backdrop-blur-sm">
                    <p className="text-sm text-gray-700">
                        {'Need help? Contact support or check our documentation.'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default NotFound
