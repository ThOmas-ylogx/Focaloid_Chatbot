import { useState, useMemo } from 'react'

import { data } from '../data/data'

// Custom hook for managing legal documents data
export const useFilesData = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedYear, setSelectedYear] = useState('')
    const [selectedLanguage, setSelectedLanguage] = useState('')

    // Get unique categories
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(data.map((item) => item.category))]
        return uniqueCategories.sort()
    }, [])

    // Get unique years
    const years = useMemo(() => {
        const uniqueYears = [...new Set(data.map((item) => item.document_year))]
        return uniqueYears.sort((a, b) => b - a) // Sort descending (newest first)
    }, [])

    // Get unique languages
    const languages = useMemo(() => {
        const uniqueLanguages = [...new Set(data.map((item) => item.language))]
        return uniqueLanguages.sort()
    }, [])

    // Filter data based on search term and filters
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchesSearch =
                searchTerm === '' ||
                item.document_title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.full_text.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesCategory =
                selectedCategory === '' || item.category === selectedCategory
            const matchesYear =
                selectedYear === '' || item.document_year === selectedYear
            const matchesLanguage =
                selectedLanguage === '' || item.language === selectedLanguage

            return (
                matchesSearch &&
                matchesCategory &&
                matchesYear &&
                matchesLanguage
            )
        })
    }, [searchTerm, selectedCategory, selectedYear, selectedLanguage])

    // Find document by ID
    const findDocumentById = (id) => {
        return data.find((item) => item.id === id)
    }

    // Find documents by category
    const findDocumentsByCategory = (category) => {
        return data.filter((item) => item.category === category)
    }

    // Find documents by year
    const findDocumentsByYear = (year) => {
        return data.filter((item) => item.document_year === year)
    }

    // Find documents by language
    const findDocumentsByLanguage = (language) => {
        return data.filter((item) => item.language === language)
    }

    // Get document statistics
    const getStatistics = () => {
        return {
            totalDocuments: data.length,
            totalCategories: categories.length,
            totalYears: years.length,
            totalLanguages: languages.length,
            filteredCount: filteredData.length
        }
    }

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('')
        setSelectedCategory('')
        setSelectedYear('')
        setSelectedLanguage('')
    }

    return {
        // Data
        allData: data,
        filteredData,
        categories,
        years,
        languages,

        // Search and filter state
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedYear,
        setSelectedYear,
        selectedLanguage,
        setSelectedLanguage,

        // Utility functions
        findDocumentById,
        findDocumentsByCategory,
        findDocumentsByYear,
        findDocumentsByLanguage,
        getStatistics,
        clearFilters
    }
}
