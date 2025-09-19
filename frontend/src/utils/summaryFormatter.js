/**
 * Utility functions for formatting legal document summaries
 */

/**
 * Formats a summary string into a more readable structure
 * @param {string} summary - The raw summary string
 * @returns {string} - Formatted summary with proper line breaks and structure
 */
export function formatSummary(summary) {
    if (!summary) return '';

    // Split by common patterns and clean up
    let formatted = summary
        // Add line breaks after title
        .replace(/\*\*([^*]+)\*\*([^*])/g, '**$1**\n\n$2')
        // Add line breaks before bullet points
        .replace(/- \*\*([^*]+)\*\*/g, '\n- **$1**')
        // Add line breaks before numbered lists
        .replace(/(\d+)\. /g, '\n$1. ')
        // Add line breaks before "Such exclusions require:" type phrases
        .replace(/(Such [^:]+:)/g, '\n\n$1')
        // Add line breaks before "This Article establishes" type phrases
        .replace(/(This Article [^.]*\.)/g, '\n\n$1')
        // Clean up multiple line breaks
        .replace(/\n{3,}/g, '\n\n')
        // Trim whitespace
        .trim();

    return formatted;
}

/**
 * Formats a summary for display in components (with HTML line breaks)
 * @param {string} summary - The raw summary string
 * @returns {string} - Summary formatted for React components
 */
export function formatSummaryForDisplay(summary) {
    return formatSummary(summary)
        .replace(/\n/g, '<br />')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/**
 * Creates a structured summary object with title, overview, and key points
 * @param {string} summary - The raw summary string
 * @returns {object} - Structured summary object
 */
export function parseStructuredSummary(summary) {
    if (!summary) return { title: '', overview: '', keyPoints: [] };

    const formatted = formatSummary(summary);
    const lines = formatted.split('\n').filter(line => line.trim());

    let title = '';
    let overview = '';
    const keyPoints = [];

    // Extract title (first line with **)
    const titleMatch = formatted.match(/\*\*([^*]+)\*\*/);
    if (titleMatch) {
        title = titleMatch[1];
    }

    // Extract overview (text after title, before first bullet point)
    const overviewMatch = formatted.match(/\*\*[^*]+\*\*\n\n([^-\n]+)/);
    if (overviewMatch) {
        overview = overviewMatch[1].trim();
    }

    // Extract key points (lines starting with - or numbers)
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ') || /^\d+\./.test(trimmed)) {
            keyPoints.push(trimmed);
        }
    });

    return {
        title,
        overview,
        keyPoints
    };
}
