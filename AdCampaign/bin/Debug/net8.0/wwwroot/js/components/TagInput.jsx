// TagInput Component - React component for managing location tags
const { useState, useEffect, useRef } = React;

function TagInput({ 
    value = [], 
    onChange = () => {}, 
    placeholder = "Şehir ekleyin...",
    suggestions = [],
    className = ""
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
            const filtered = suggestions.filter(item => 
                item.toLowerCase().includes(inputValue.toLowerCase()) &&
                !tags.some(tag => tag.toLowerCase() === item.toLowerCase())
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
        }
        setActiveSuggestion(-1);
    }, [inputValue, tags, suggestions]);

    const addTag = (tag) => {
        if (tag && !tags.some(existingTag => existingTag.toLowerCase() === tag.toLowerCase())) {
            const newTags = [...tags, tag];
            setTags(newTags);
            onChange(newTags);
            setInputValue('');
            setShowSuggestions(false);
        }
    };

    const removeTag = (indexToRemove) => {
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        setTags(newTags);
        onChange(newTags);
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
        }
    };

    const handleSuggestionClick = (suggestion) => {
        addTag(suggestion);
        inputRef.current?.focus();
    };

    return (
        <div className={`relative ${className}`}>
            {/* Input Container */}
            <div className="min-h-[48px] p-3 border border-gray-300 rounded-input bg-white flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                {/* Tags */}
                {tags.map((tag, index) => (
                    <span 
                        key={index}
                        className="tag-pill px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2"
                    >
                        <span>{tag}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="w-4 h-4 flex items-center justify-center hover:bg-red-100 rounded-full text-red-500 hover:text-red-700 transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
                    placeholder={tags.length === 0 ? placeholder : ""}
                    className="flex-1 min-w-[120px] outline-none bg-transparent text-sm text-text placeholder-muted"
                />
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div 
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto"
                >
                    {filteredSuggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                index === activeSuggestion ? 'bg-primary/10 text-primary' : 'text-text'
                            }`}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Export for global use
window.TagInput = TagInput;