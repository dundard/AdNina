// BudgetSlider Component - React component for budget management
const { useState, useEffect, useRef } = React;

function BudgetSlider({ 
    value = 30, 
    min = 10, 
    max = 200, 
    onChange = () => {},
    showCurrency = true,
    className = ""
}) {
    const [budget, setBudget] = useState(value);
    const [isDragging, setIsDragging] = useState(false);
    const autoNumericRef = useRef(null);
    const sliderRef = useRef(null);
    
    // Budget scale labels
    const scales = [
        { min: 10, max: 20, label: 'Limited', description: 'Sınırlı erişim', position: 15 },
        { min: 21, max: 50, label: 'Basic Reach', description: 'Temel erişim', position: 35 },
        { min: 51, max: 200, label: '2x+ Results', description: '2x+ sonuç', position: 75 }
    ];

    useEffect(() => {
        setBudget(value);
        
        // Initialize AutoNumeric if not already initialized
        if (showCurrency && autoNumericRef.current && !autoNumericRef.current.autoNumeric) {
            try {
                autoNumericRef.current.autoNumeric = new AutoNumeric(autoNumericRef.current, value, {
                    currencySymbol: '$',
                    currencySymbolPlacement: 'p',
                    decimalPlaces: 0,
                    minimumValue: min,
                    maximumValue: max,
                    wheelStep: 5
                });
                
                autoNumericRef.current.addEventListener('autoNumeric:formatted', function(e) {
                    const numericValue = AutoNumeric.getNumber(e.target);
                    if (numericValue !== budget) {
                        setBudget(numericValue);
                        onChange(numericValue);
                        
                        // Update localStorage immediately
                        saveState({ budget: numericValue });
                    }
                });
            } catch (error) {
                console.warn('AutoNumeric initialization failed:', error);
            }
        }
    }, [value, min, max, showCurrency]);

    useEffect(() => {
        // Update AutoNumeric value when budget changes externally
        if (autoNumericRef.current?.autoNumeric && budget !== AutoNumeric.getNumber(autoNumericRef.current)) {
            try {
                AutoNumeric.set(autoNumericRef.current, budget);
            } catch (error) {
                console.warn('AutoNumeric update failed:', error);
            }
        }
    }, [budget]);

    const handleSliderChange = (e) => {
        const newValue = parseInt(e.target.value);
        
        // Prevent unnecessary updates
        if (newValue === budget) return;
        
        // Update state immediately for smooth UI
        setBudget(newValue);
        onChange(newValue);
        
        // Clear any pending timeout
        if (handleSliderChange.autoNumericTimeout) {
            clearTimeout(handleSliderChange.autoNumericTimeout);
        }
        if (handleSliderChange.saveTimeout) {
            clearTimeout(handleSliderChange.saveTimeout);
        }
        
        // Debounce AutoNumeric update only when not dragging
        if (autoNumericRef.current?.autoNumeric && !isDragging) {
            handleSliderChange.autoNumericTimeout = setTimeout(() => {
                try {
                    const currentValue = AutoNumeric.getNumber(autoNumericRef.current);
                    if (currentValue !== newValue) {
                        AutoNumeric.set(autoNumericRef.current, newValue);
                    }
                } catch (error) {
                    console.warn('AutoNumeric slider update failed:', error);
                }
            }, 150);
        }
        
        // Debounce localStorage update
        handleSliderChange.saveTimeout = setTimeout(() => {
            saveState({ budget: newValue });
        }, 200);
    };

    const getCurrentScale = () => {
        return scales.find(scale => budget >= scale.min && budget <= scale.max) || scales[0];
    };

    const getEstimatedReach = () => {
        const baseBudget = 30;
        const baseReach = { min: 976900, max: 1465400 };
        const scale = budget / baseBudget;
        
        return {
            min: Math.round(baseReach.min * scale),
            max: Math.round(baseReach.max * scale)
        };
    };

    const currentScale = getCurrentScale();
    const reach = getEstimatedReach();

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Budget Input with improved styling */}
            {showCurrency && (
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                ref={autoNumericRef}
                                type="text"
                                className="w-full px-4 py-4 text-3xl font-bold text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="$30"
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium">
                                günlük
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Slider with better positioning */}
            <div className="space-y-6">
                <div className="relative px-2">
                    {/* Slider Track */}
                    <div className="relative">
                        <input
                            ref={sliderRef}
                            type="range"
                            min={min}
                            max={max}
                            value={budget}
                            onChange={handleSliderChange}
                            onMouseDown={() => setIsDragging(true)}
                            onMouseUp={() => setIsDragging(false)}
                            onTouchStart={() => setIsDragging(true)}
                            onTouchEnd={() => setIsDragging(false)}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none slider-custom"
                            style={{
                                background: `linear-gradient(to right, #7B61FF 0%, #7B61FF ${((budget - min) / (max - min)) * 100}%, #E5E7EB ${((budget - min) / (max - min)) * 100}%, #E5E7EB 100%)`
                            }}
                        />
                    </div>
                    
                    {/* Scale markers positioned below slider */}
                    <div className="flex justify-between items-center mt-6 px-1">
                        <div className="text-center">
                            <div className={`text-sm font-medium transition-colors ${
                                budget >= 10 && budget <= 30 ? 'text-blue-600' : 'text-gray-400'
                            }`}>Limited</div>
                            <div className="text-xs text-gray-400 mt-1">Sınırlı erişim</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-sm font-medium transition-colors ${
                                budget > 30 && budget <= 80 ? 'text-blue-600' : 'text-gray-400'
                            }`}>Basic Reach</div>
                            <div className="text-xs text-gray-400 mt-1">Temel erişim</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-sm font-medium transition-colors ${
                                budget > 80 ? 'text-blue-600' : 'text-gray-400'
                            }`}>2x+ Results</div>
                            <div className="text-xs text-gray-400 mt-1 whitespace-nowrap">2M - 3M</div>
                            <div className="text-xs text-gray-400">tahmini erişim</div>
                        </div>
                    </div>
                </div>
                
                {/* Budget Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-blue-800">Tahmini Günlük Erişim</div>
                            <div className="text-lg font-bold text-blue-900">
                                {formatNumber(reach.min)} - {formatNumber(reach.max)}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium text-blue-800">Kategori</div>
                            <div className="text-lg font-bold text-blue-900">{currentScale.label}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper function for formatting numbers
window.formatNumber = function(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
};

// Export for global use
window.BudgetSlider = BudgetSlider;