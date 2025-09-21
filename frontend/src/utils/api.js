// --- CONFIGURATION ---
export const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL

// --- API & DYNAMIC TRANSLATION UTILITIES ---
export const callBatchTranslationAPI = async (texts, targetLanguage) => {
    if (!texts || texts.length === 0 || texts.every((t) => !t)) {
        return []
    }
    const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY
    if (!apiKey) {
        console.error('Google Translate API key is not set.')
        return texts.map((t) => `[Translation Disabled] ${t}`)
    }

    try {
        const response = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    q: texts,
                    target: targetLanguage,
                    format: 'text'
                })
            }
        )

        const data = await response.json()
        if (!response.ok)
            throw new Error(data.error?.message || 'Translation failed')
        return data.data.translations.map(
            (translation) => translation.translatedText
        )
    } catch (error) {
        console.error('Translation API error:', error)
        throw error
    }
}

export async function translateChatHistory(messages, targetLanguage) {
    const sourceLang = targetLanguage === 'ar' ? 'en' : 'ar'
    const sourceKey = `text_${sourceLang}`
    const targetKey = `text_${targetLanguage}`

    const textToTranslate = []
    const indicesToTranslate = []

    if (!Array.isArray(messages)) return []

    messages.forEach((msg, idx) => {
        if (msg && msg[sourceKey] && !msg[targetKey]) {
            textToTranslate.push(msg[sourceKey])
            indicesToTranslate.push(idx)
        }
    })

    if (textToTranslate.length === 0) return messages

    try {
        const translatedTexts = await callBatchTranslationAPI(
            textToTranslate,
            targetLanguage
        )
        const translatedMessages = [...messages]
        indicesToTranslate.forEach((idx, i) => {
            translatedMessages[idx] = {
                ...translatedMessages[idx],
                [targetKey]: translatedTexts[i]
            }
        })
        return translatedMessages
    } catch (error) {
        console.error('Translation error:', error)
        return messages
    }
}
