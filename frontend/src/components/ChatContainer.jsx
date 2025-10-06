
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';

import ChatInterface from './ChatInterface'
import CountrySelectionModal from './CountrySelectionModal'
import { CHAT_API_URL } from '../utils/api';

const initialMessage = {
    id: 1,
    message: 'Hello! How can I assist you with questions today?',
    sender: 'ai',
    sources: null
}
function ChatContainer() {
    const location = useLocation();

    const { selectedCountry: initialCountry } = location.state || {};

    const [selectedCountry, setSelectedCountry] = useState(initialCountry);
    const [messages, setMessages] = useState(() => [
        initialMessage
    ])
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Automatically open modal if no country is selected
    useEffect(() => {
        if (!selectedCountry) {
            setIsModalOpen(true);
        }
    }, [selectedCountry]);

    const handleSendMessage = async (messageText) => {
        if (!selectedCountry) {
            setIsModalOpen(true);
            return;
        }

        const payload = {
            message: messageText
        }

        setMessages((prev) => [...prev, { ...payload, sender: 'user' }])
        try {

            const response = await axios.post(CHAT_API_URL, {
                question: messageText,
                country: selectedCountry.name
            }
            )

            const { answer, source_metadata } = response.data
            let aiMessage = {
                id: `ai_${Date.now()}`,
                message: answer === 'nan' ? 'Sorry, I am unable to answer based on the information that I can access' : answer,
                sender: 'ai',
                source_metadata: source_metadata
            }

            setMessages((prev) => [...prev, aiMessage])
        } catch (error) {
            let aiMessage = {
                id: `ai_${Date.now()}`,
                message: 'Sorry, I am unable to provide an answer to that question.',
                sender: 'ai',
            }
            setMessages((prev) => [...prev, aiMessage])
            throw error
        }
    }

    const handleNewConversation = () => {
        setMessages([initialMessage])
    }

    const handleChangeCountry = () => {
        setIsModalOpen(true);
    }

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    return (
        <div className="flex-1 flex flex-row overflow-hidden relative bg-blue-100">

            <div className="flex-1 flex flex-col relative z-10">
                <ChatInterface
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onNewConversation={handleNewConversation}
                    onChangeCountry={handleChangeCountry}
                    selectedCountry={selectedCountry}
                />

                {/* Country Selection Modal */}
                <CountrySelectionModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onCountrySelect={handleCountrySelect}
                    currentCountry={selectedCountry}
                />
            </div>
        </div>
    )
}

export default ChatContainer
