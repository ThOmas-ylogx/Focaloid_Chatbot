
import axios from 'axios'
import { useState } from 'react'
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

    const handleSendMessage = async (messageText) => {

        const payload = {
            message: messageText
        }

        setMessages((prev) => [...prev, { ...payload, sender: 'user' }])
        try {
            // Use dummy response for now
            const dummyResponse = {
                "query": messageText,
                "retrieved_documents": [
                    {
                        "content": "Does any compulsory/optional Pool or State Reinsurance Scheme apply in your COUNTRY?",
                        "metadata": {
                            "Comment": "nan",
                            "Answer": "No",
                            "hash": "70c60a728d598654b66e7220a985d42d",
                            "Country": selectedCountry?.name || "Nigeria"
                        }
                    },
                    {
                        "content": "Can you issue policy certificates (proof of insurance) pending the issuance of the policy?",
                        "metadata": {
                            "Country": selectedCountry?.name || "Nigeria",
                            "Comment": "nan",
                            "Answer": "Yes",
                            "hash": "2db38cae282d9754b51e468cc624d640"
                        }
                    },
                    {
                        "content": "(Marine Cargo) Is there any compulsory local insurance based on the incoterms?",
                        "metadata": {
                            "Answer": "Yes",
                            "Comment": "nan",
                            "hash": "9e4af4a9eb46ce8d994d27436ae55e90",
                            "Country": selectedCountry?.name || "Nigeria"
                        }
                    }
                ],
                "answer": "To file a car insurance claim in Nigeria, follow these steps:\n\n1. **Notify Your Insurer**: Contact your insurance company as soon as the accident occurs. Most insurers have a dedicated claims hotline. It's crucial to do this within the specified time frame mentioned in your policy.\n\n2. **Gather Documentation**: Collect all necessary documents, which may include:\n   - A copy of your insurance policy\n   - The policy certificate\n   - A police report (if applicable)\n   - Photographs of the accident scene and vehicle damage\n   - Details of other parties involved, including their insurance information\n\n3. **Complete the Claim Form**: Obtain and fill out the claim form from your insurance provider. Be thorough and accurate in providing the required information.\n\n4. **Submit Your Claim**: Send the completed claim form along with the gathered documentation to your insurer. Some companies may allow you to submit claims online, while others may require you to visit an office.\n\n5. **Investigation and Assessment**: After submitting your claim, the insurance company will assess the submitted documents. They may send an adjuster to evaluate the damages and losses.\n\n6. **Claim Approval**: Once your claim is evaluated, your insurer will communicate the decision. If approved, they will provide you with the details regarding the payout.\n\n7. **Payment**: If the claim is approved, the insurance company will initiate the payment process, which may be paid directly to you or to the repair shop, depending on your policy's terms.\n\n8. **Follow Up**: If there are any delays or issues, stay in contact with your insurer for updates on the status of your claim.\n\nIt's essential to review your specific insurance policy for details related to claims procedures, timelines, and any other requirements your insurer may have."
            }

            const response = await axios.post(CHAT_API_URL, {
                question: messageText,
                country: selectedCountry.name
            }
            )
            const { answer, retrieved_documents } = dummyResponse
            let aiMessage = {
                id: `ai_${Date.now()}`,
                message: answer,
                sender: 'ai',
                retrieved_documents: retrieved_documents
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
        <div className="flex-1 flex flex-row overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>

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
