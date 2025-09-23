import {
    faPaperPlane,
    faCopy,
    faPlusSquare
} from '@fortawesome/free-regular-svg-icons'
import { faUser, faRobot, faSpinner, faGlobe, faChevronDown, faChevronUp, faFileText } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect, useRef } from 'react'

function ChatInterface({
    messages,
    onSendMessage,
    onNewConversation,
    onChangeCountry,
    selectedCountry,
}) {

    const [inputValue, setInputValue] = useState('')
    const [isAiTyping, setIsAiTyping] = useState(false)
    const [copiedMessageId, setCopiedMessageId] = useState(null)
    const [expandedDocuments, setExpandedDocuments] = useState({})
    const chatHistoryRef = useRef(null)
    const textareaRef = useRef(null)

    useEffect(() => {
        if (chatHistoryRef.current) {
            const chatContainer = chatHistoryRef.current
            
            // Check if the last message is from AI and if it's long
            const lastMessage = messages[messages.length - 1]
            const isLongResponse = lastMessage && 
                lastMessage.sender === 'ai' && 
                lastMessage.message && 
                (lastMessage.message.length > 500 || lastMessage.message.split('\n').length > 10) // Long text or many lines
            
            if (isLongResponse) {
                // For long AI responses, scroll to show the beginning of the message
                setTimeout(() => {
                    const aiMessages = chatContainer.querySelectorAll('[data-sender="ai"]')
                    const lastAiMessage = aiMessages[aiMessages.length - 1]
                    if (lastAiMessage) {
                        lastAiMessage.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start',
                            inline: 'nearest'
                        })
                    }
                }, 100)
            } else {
                // For short messages or user messages, scroll to bottom
                chatContainer.scrollTop = chatContainer.scrollHeight
            }
        }
    }, [messages])

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height =
                Math.min(textareaRef.current.scrollHeight, 200) + 'px'
        }
    }, [inputValue])

    const handleCopyMessage = async (messageText, messageId) => {
        try {
            await navigator.clipboard.writeText(messageText)
            setCopiedMessageId(messageId)
            setTimeout(() => setCopiedMessageId(null), 2000)
        } catch (err) {
            console.error('Failed to copy message:', err)
        }
    }

    const toggleDocumentExpansion = (messageId, docIndex) => {
        const key = `${messageId}_${docIndex}`
        setExpandedDocuments(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const renderRetrievedDocuments = (documents, messageId) => {
        if (!documents || documents.length === 0) return null

        return (
            <div className="mt-3 border-t border-gray-200 pt-3">
                <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faFileText} className="text-gray-500 text-sm" />
                    <span className="text-sm font-medium text-gray-600">Retrieved Documents</span>
                    {documents.some(doc => doc.metadata?.Comment && doc.metadata.Comment !== 'nan') && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            Comments Available
                        </span>
                    )}
                </div>
                <div className="space-y-2">
                    {documents.map((doc, index) => {
                        const isExpanded = expandedDocuments[`${messageId}_${index}`]
                        const hasComment = doc.metadata?.Comment && doc.metadata.Comment !== 'nan'
                        
                        return (
                            <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 mb-2">{doc.content}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>Answer: <strong>{doc.metadata?.Answer}</strong></span>
                                            <span>Country: <strong>{doc.metadata?.Country}</strong></span>
                                        </div>
                                    </div>
                                    {hasComment && (
                                        <button
                                            onClick={() => toggleDocumentExpansion(messageId, index)}
                                            className="ml-2 p-1 text-blue-600 hover:text-blue-800 transition-colors bg-blue-100 rounded-full"
                                            title="Click to view comment"
                                        >
                                            <FontAwesomeIcon 
                                                icon={isExpanded ? faChevronUp : faChevronDown} 
                                                className="text-xs"
                                            />
                                        </button>
                                    )}
                                </div>
                                {hasComment && isExpanded && (
                                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                        <div className="flex items-start gap-2">
                                            <span className="text-xs font-medium text-blue-700">Comment:</span>
                                            <span className="text-xs text-blue-600">{doc.metadata.Comment}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleLocalSendMessage(e)
        }
    }

    const handleLocalSendMessage = async (e) => {
        e.preventDefault()
        if (!inputValue.trim() || isAiTyping) return

        const currentInput = inputValue
        setInputValue('')
        setIsAiTyping(true)

        try {
            await onSendMessage(currentInput)
        } catch (error) {
            console.error('Error sending message:', error)
        } finally {
            setIsAiTyping(false)
        }
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Country Display */}
            {selectedCountry && (
                <div className="px-6 py-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                        <h2>Insurance Q&A bot</h2>
                        <FontAwesomeIcon icon={faGlobe} className="text-gray-600" />
                        <span className="font-medium">Current Country:</span>
                        {/* <span className="text-lg">{selectedCountry.flag}</span> */}
                        <span className="font-semibold text-gray-900">{selectedCountry.name}</span>
                    </div>
                </div>
            )}

            {/* Chat Messages */}
            <div
                className="flex-1 overflow-y-auto secondary-scrollbar px-6"
                ref={chatHistoryRef}
            >
                {(messages || []).map((msg, index) => {
                    const isUser = msg.sender === 'user'
                    const textToDisplay = msg.message

                    return (
                        <div
                            data-sender={msg.sender}
                            key={msg.id + index}
                            className={`w-full py-4 ${isUser ? 'flex justify-end' : 'flex justify-start'}`}
                        >
                            <div
                                className={`flex gap-3 items-start max-w-[70%] ${isUser ? 'flex-row-reverse' : ''}`}
                            >
                                {/* Avatar */}
                                <div
                                    className={`w-8 h-8 border border-gray-500 rounded-full flex items-center justify-center flex-shrink-0 ${isUser
                                        ? 'bg-gradient-primary'
                                        : 'bg-gradient-secondary'
                                        }`}
                                >
                                    <FontAwesomeIcon
                                        icon={isUser ? faUser : faRobot}
                                        className="text-sm text-black"
                                    />
                                </div>

                                {/* Message Bubble */}
                                <div
                                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                                >
                                    {/* Sender Name */}
                                    <div className="mb-1">
                                        <span className="text-sm font-medium text-gray-600">
                                            {isUser ? 'You' : 'AI Assistant'}
                                        </span>
                                    </div>

                                    {/* Message Bubble */}
                                    <div
                                        className={`relative px-4 py-3 rounded-2xl max-w-full ${isUser
                                            ? 'bg-green-100 text-black rounded-tr-md'
                                            : 'bg-gradient-surface rounded-tl-md border border-gray-300'
                                            }`}
                                    >
                                        {/* Message Text */}
                                        <div
                                            className={`text-md leading-relaxed ${isUser
                                                ? 'text-right'
                                                : 'text-left'
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">
                                                {textToDisplay}
                                            </p>
                                        </div>

                                        {/* Retrieved Documents for AI messages */}
                                        {!isUser && msg.retrieved_documents && renderRetrievedDocuments(msg.retrieved_documents, msg.id)}

                                        {/* Message Actions */}
                                        <div
                                            className={`flex items-center gap-1 mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {/* Copy Button */}
                                            <button
                                                onClick={() =>
                                                    handleCopyMessage(
                                                        textToDisplay,
                                                        msg.id
                                                    )
                                                }
                                                className={`flex items-center gap-1 px-2 py-1 text-[0.7rem] rounded-lg transition-all duration-300 ${isUser
                                                    ? 'bg-white/50 hover:bg-white/100 text-white'
                                                    : 'bg-gray-300/50 hover:bg-gray-400/50 text-gray-700 hover:text-gray-800'
                                                    }`}
                                                title={'Copy message'}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faCopy}
                                                    className={
                                                        copiedMessageId ===
                                                            msg.id
                                                            ? 'text-green-600'
                                                            : ''
                                                    }
                                                />
                                                <span>
                                                    {copiedMessageId === msg.id
                                                        ? 'Copied!'

                                                        : 'Copy'
                                                    }
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Typing Indicator */}
                {isAiTyping && (
                    <div className="w-full py-4 flex justify-start">
                        <div className="flex gap-3 items-start max-w-[70%]">
                            <div className="w-8 h-8 rounded-full bg-gradient-secondary text-white flex items-center justify-center flex-shrink-0">
                                <FontAwesomeIcon
                                    icon={faRobot}
                                    className="text-sm"
                                />
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="mb-1">
                                    <span className="text-xs font-medium text-gray-600">
                                        {'AI Assistant'}
                                    </span>
                                </div>
                                <div className="relative px-4 py-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-bl-md border border-gray-300">
                                    <div className="flex items-center gap-2 text-sm">
                                        <FontAwesomeIcon
                                            icon={faSpinner}
                                            className="animate-spin text-blue-600"
                                        />
                                        <span className="italic">
                                            {'Typing...'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="relative overflow-hidden">

                <div className="max-w-full flex gap-4 px-6 py-4 relative z-10 items-start justify-center">

                    {/* New Conversation Button */}
                    <div className="flex justify-center mt-1">
                        <button
                            onClick={onNewConversation}
                            className="flex items-center gap-2 p-3 text-sm bg-gradient-glass hover:bg-gradient-primary text-gray-700 hover:text-white rounded-full transition-all duration-300 backdrop-blur-sm"
                            title={'New conversation'}
                        >
                            <FontAwesomeIcon className='text-xl' icon={faPlusSquare} />
                        </button>
                    </div>

                    {/* Change Country Button */}
                    <div className="flex justify-center mt-1">
                        <button
                            onClick={onChangeCountry}
                            className="flex items-center gap-2 p-3 text-sm bg-gradient-glass hover:bg-gradient-primary text-gray-700 hover:text-white rounded-full transition-all duration-300 backdrop-blur-sm"
                            title={'Change country'}
                        >
                            <FontAwesomeIcon className='text-xl' icon={faGlobe} />
                        </button>
                    </div>

                    {/* Message Input */}
                    <form
                        onSubmit={handleLocalSendMessage}
                        className="relative w-full max-w-4xl"
                    >
                        <div
                            className={`flex items-end gap-3 bg-gradient-surface border border-gray-300 rounded-full p-3 focus-within:border-blue-400 focus-within:shadow-lg focus-within:shadow-blue-500/25 transition-all duration-300 backdrop-blur-sm px-8 py-2`}
                        >
                            <textarea
                                ref={textareaRef}
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                placeholder={'Chat'}
                                disabled={isAiTyping}
                                className={`flex-1 bg-transparent text-gray-800 placeholder-gray-500 resize-none focus:outline-none max-h-[200px] min-h-[30px] leading-6`}
                                rows="1"
                            />
                            <button
                                type="submit"
                                disabled={isAiTyping || !inputValue.trim()}
                                className="flex-shrink-0 w-8 h-8 bg-gray-200 hover:bg-gray-100 disabled:bg-gradient-surface disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105"
                            >
                                <FontAwesomeIcon
                                    icon={isAiTyping ? faSpinner : faPaperPlane}
                                    className={isAiTyping ? 'animate-spin' : ''}
                                />
                            </button>
                        </div>

                        {/* Input Helper Text */}
                        <div className="flex justify-center mt-2">
                            <p className="text-xs text-gray-600">
                                {'Press Enter to send, Shift+Enter for new line'}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChatInterface
