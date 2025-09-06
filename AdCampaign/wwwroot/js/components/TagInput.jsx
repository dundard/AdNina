// TagInput Component - React component for managing location tags
const { useState, useEffect, useRef } = React;

function TagInput({ 
    value = [], 
    onChange = () => {}, 
    placeholder = "Şehir ekleyin...",
    suggestions = [],
    className = "",
    maxTags = 20,
    showCount = false,
    allowCustom = true
}) {
    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState(value);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        setTags(value);
    }, [value]);

    useEffect(() => {
        if (inputValue.trim()) {
            const searchTerm = inputValue.toLowerCase();
            
            // Enhanced filtering with better matching
            const filtered = suggestions.filter(item => {
                const itemLower = item.toLowerCase();
                const isNotAlreadyAdded = !tags.some(tag => tag.toLowerCase() === itemLower);
                
                // Match start of string, start of words, or contains
                const matchesStart = itemLower.startsWith(searchTerm);
                const matchesWordStart = itemLower.split(' ').some(word => word.startsWith(searchTerm));
                const contains = itemLower.includes(searchTerm);
                
                return isNotAlreadyAdded && (matchesStart || matchesWordStart || contains);
            });
            
            // Sort by relevance: exact match, starts with, word starts with, contains
            const sorted = filtered.sort((a, b) => {
                const aLower = a.toLowerCase();
                const bLower = b.toLowerCase();
                
                if (aLower === searchTerm) return -1;
                if (bLower === searchTerm) return 1;
                if (aLower.startsWith(searchTerm) && !bLower.startsWith(searchTerm)) return -1;
                if (bLower.startsWith(searchTerm) && !aLower.startsWith(searchTerm)) return 1;
                
                return a.localeCompare(b);
            });
            
            setFilteredSuggestions(sorted.slice(0, 10)); // Limit to 10 suggestions
            setShowSuggestions(sorted.length > 0);
        } else {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
        }
        setActiveSuggestion(-1);
    }, [inputValue, tags, suggestions]);

    const addTag = (tag) => {
        if (tag && tags.length < maxTags && !tags.some(existingTag => existingTag.toLowerCase() === tag.toLowerCase())) {
            const newTags = [...tags, tag];
            setTags(newTags);
            onChange(newTags);
            setInputValue('');
            setShowSuggestions(false);
            
            // Show feedback
            if (window.showToast) {
                window.showToast(`"${tag}" eklendi`, 'success', 1500);
            }
        } else if (tags.length >= maxTags) {
            if (window.showToast) {
                window.showToast(`Maksimum ${maxTags} konum ekleyebilirsiniz`, 'warning', 2000);
            }
        }
    };

    const removeTag = (indexToRemove) => {
        const removedTag = tags[indexToRemove];
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        setTags(newTags);
        onChange(newTags);
        
        // Show feedback
        if (window.showToast) {
            window.showToast(`"${removedTag}" kaldırıldı`, 'info', 1500);
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (activeSuggestion >= 0 && filteredSuggestions[activeSuggestion]) {
                addTag(filteredSuggestions[activeSuggestion]);
            } else if (inputValue.trim()) {
                addTag(inputValue.trim());
            }
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags.length - 1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestion(prev => 
                prev < filteredSuggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setActiveSuggestion(-1);
        } else if (e.key === 'Tab' && showSuggestions && activeSuggestion >= 0) {
            e.preventDefault();
            addTag(filteredSuggestions[activeSuggestion]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        addTag(suggestion);
        inputRef.current?.focus();
    };

    return (
        <div className={`relative ${className}`}>
            {/* Tag Count Display */}
            {showCount && (
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted">
                        Seçilen konumlar
                    </span>
                    <span className={`text-xs font-medium ${
                        tags.length >= maxTags ? 'text-red-500' : 
                        tags.length >= maxTags * 0.8 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                        {tags.length} / {maxTags}
                    </span>
                </div>
            )}
            
            {/* Input Container */}
            <div className={`min-h-[48px] p-3 border-2 rounded-input bg-white flex flex-wrap items-center gap-2 transition-all ${
                showSuggestions ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'
            } hover:border-gray-400 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20`}>
                {/* Tags */}
                {tags.map((tag, index) => (
                    <span 
                        key={index}
                        className="tag-pill px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 animate-fadeIn"
                        style={{
                            animationDelay: `${index * 50}ms`
                        }}
                    >
                        <span>{tag}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="w-4 h-4 flex items-center justify-center hover:bg-red-100 rounded-full text-red-500 hover:text-red-700 transition-colors group"
                            title={`"${tag}" kaldır`}
                        >
                            <svg className="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </span>
                ))}
                
                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    onFocus={() => {
                        setShowSuggestions(filteredSuggestions.length > 0);
                        if (tags.length >= maxTags) {
                            if (window.showToast) {
                                window.showToast(`Maksimum ${maxTags} konum ekleyebilirsiniz`, 'warning', 2000);
                            }
                        }
                    }}
                    disabled={tags.length >= maxTags}
                    placeholder={tags.length === 0 ? placeholder : tags.length >= maxTags ? "Maksimum konum sayısına ulaşıldı" : ""}
                    className={`flex-1 min-w-[120px] outline-none bg-transparent text-sm transition-all ${
                        tags.length >= maxTags ? 'text-muted cursor-not-allowed' : 'text-text'
                    } placeholder-muted`}
                />
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div 
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto animate-fadeIn"
                >
                    <div className="p-2">
                        <div className="text-xs text-muted mb-2 px-2">
                            {filteredSuggestions.length} sonuç bulundu
                        </div>
                        {filteredSuggestions.map((suggestion, index) => {
                            // Check if it's a city with country format
                            const isCountryCity = suggestion.includes(', ');
                            const parts = isCountryCity ? suggestion.split(', ') : [suggestion];
                            
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className={`w-full px-3 py-2 text-left text-sm rounded-md transition-all duration-150 flex items-center justify-between group ${
                                        index === activeSuggestion ? 'bg-primary text-white' : 'hover:bg-gray-50 text-text'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        {isCountryCity ? (
                                            <>
                                                <svg className="w-4 h-4 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                </svg>
                                                <div>
                                                    <span className="font-medium">{parts[0]}</span>
                                                    <span className="text-xs opacity-70 ml-1">({parts[1]})</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 text-green-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <span className="font-medium">{suggestion}</span>
                                            </>
                                        )}
                                    </div>
                                    <svg className={`w-3 h-3 transition-transform ${
                                        index === activeSuggestion ? 'translate-x-0' : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// Export for global use
window.TagInput = TagInput;