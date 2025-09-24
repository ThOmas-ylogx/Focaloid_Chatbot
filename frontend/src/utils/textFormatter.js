/**
 * Text formatting utilities for dynamic AI responses
 * Handles various text formats and converts them to properly formatted display
 */

/**
 * Formats text with various formatting patterns
 * @param {string} text - Raw text to format
 * @returns {string} - Formatted text
 */
export const formatText = (text) => {
    if (!text || typeof text !== 'string') {
        return text || '';
    }

    let formattedText = text;

    // 1. Handle markdown-style formatting
    formattedText = formatMarkdown(formattedText);

    // 2. Handle numbered lists
    formattedText = formatNumberedLists(formattedText);

    // 3. Handle bullet points
    formattedText = formatBulletPoints(formattedText);

    // 4. Handle line breaks and paragraphs
    formattedText = formatLineBreaks(formattedText);

    // 5. Handle bold text patterns
    formattedText = formatBoldText(formattedText);

    // 6. Handle italic text patterns
    formattedText = formatItalicText(formattedText);

    // 7. Handle code blocks
    formattedText = formatCodeBlocks(formattedText);

    // 8. Handle URLs
    formattedText = formatUrls(formattedText);

    // 9. Clean up extra whitespace
    formattedText = cleanupWhitespace(formattedText);

    return formattedText;
};

/**
 * Converts markdown-style formatting to HTML
 */
const formatMarkdown = (text) => {
    // Bold text: **text** or __text__
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic text: *text* or _text_
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');

    // Code: `code`
    text = text.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>');

    return text;
};

/**
 * Formats numbered lists (1., 2., etc.)
 */
const formatNumberedLists = (text) => {
    // Handle numbered lists with periods
    text = text.replace(/^(\d+\.\s+.*)$/gm, '<div class="ml-4 mb-1">$1</div>');
    
    // Handle numbered lists with parentheses
    text = text.replace(/^(\d+\)\s+.*)$/gm, '<div class="ml-4 mb-1">$1</div>');
    
    return text;
};

/**
 * Formats bullet points (-, *, •)
 */
const formatBulletPoints = (text) => {
    // Handle various bullet point styles
    text = text.replace(/^[-*•]\s+(.*)$/gm, '<div class="ml-4 mb-1">• $1</div>');
    
    return text;
};

/**
 * Formats line breaks and paragraphs
 */
const formatLineBreaks = (text) => {
    // Convert double line breaks to paragraph breaks
    text = text.replace(/\n\n+/g, '</p><p class="mb-3">');
    
    // Wrap in paragraph tags
    text = `<p class="mb-3">${text}</p>`;
    
    // Convert single line breaks to <br>
    text = text.replace(/\n/g, '<br>');
    
    return text;
};

/**
 * Formats bold text patterns (various formats)
 */
const formatBoldText = (text) => {
    // Handle patterns like "**text**", "TEXT:", "TEXT -", etc.
    text = text.replace(/^([A-Z][A-Z\s]+):\s*(.*)$/gm, '<div class="mb-2"><strong class="text-gray-800">$1:</strong> $2</div>');
    text = text.replace(/^([A-Z][A-Z\s]+)\s*-\s*(.*)$/gm, '<div class="mb-2"><strong class="text-gray-800">$1:</strong> $2</div>');
    
    return text;
};

/**
 * Formats italic text patterns
 */
const formatItalicText = (text) => {
    // Handle quoted text
    text = text.replace(/"([^"]+)"/g, '<em class="text-gray-600">"$1"</em>');
    
    return text;
};

/**
 * Formats code blocks
 */
const formatCodeBlocks = (text) => {
    // Handle multi-line code blocks
    text = text.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto my-2"><code>$1</code></pre>');
    
    return text;
};

/**
 * Formats URLs
 */
const formatUrls = (text) => {
    // Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    text = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>');
    
    return text;
};

/**
 * Cleans up extra whitespace
 */
const cleanupWhitespace = (text) => {
    // Remove excessive whitespace
    text = text.replace(/\s+/g, ' ');
    text = text.replace(/>\s+</g, '><');
    
    return text.trim();
};

/**
 * Detects if text contains structured content
 */
export const detectStructuredContent = (text) => {
    if (!text) return false;
    
    const patterns = [
        /^\d+\.\s+/m,           // Numbered lists
        /^[-*•]\s+/m,           // Bullet points
        /^\*\*.*\*\*$/m,        // Bold text
        /^[A-Z][A-Z\s]+:\s*/m,  // Headers with colons
        /```[\s\S]*```/m,       // Code blocks
    ];
    
    return patterns.some(pattern => pattern.test(text));
};

/**
 * Formats text for display with proper HTML structure
 */
export const formatTextForDisplay = (text) => {
    if (!text) return '';
    
    const isStructured = detectStructuredContent(text);
    
    if (isStructured) {
        return formatText(text);
    }
    
    // For simple text, just handle line breaks
    return text.replace(/\n/g, '<br>');
};

/**
 * Truncates text with ellipsis
 */
export const truncateText = (text, maxLength = 200) => {
    if (!text || text.length <= maxLength) {
        return text;
    }
    
    return text.substring(0, maxLength) + '...';
};

/**
 * Highlights search terms in text
 */
export const highlightSearchTerms = (text, searchTerms) => {
    if (!text || !searchTerms || searchTerms.length === 0) {
        return text;
    }
    
    let highlightedText = text;
    
    searchTerms.forEach(term => {
        if (term && term.trim()) {
            const regex = new RegExp(`(${term.trim()})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
        }
    });
    
    return highlightedText;
};
