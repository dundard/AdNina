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
        setBudget(newValue);
        onChange(newValue);
        
        // Update AutoNumeric
        if (autoNumericRef.current?.autoNumeric) {
            try {
                AutoNumeric.set(autoNumericRef.current, newValue);
            } catch (error) {
                console.warn('AutoNumeric slider update failed:', error);
            }
        }
        
        // Update localStorage
        saveState({ budget: newValue });
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
            {/* Budget Input */}
            {showCurrency && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text">
                        Günlük Bütçe
                    </label>
                    <div className="relative">
                        <input
                            ref={autoNumericRef}
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-input bg-white text-lg font-semibold text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="$30"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted">
                            günlük
                        </div>
                    </div>
                </div>
            )}

            {/* Slider */}
            <div className="space-y-4">
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                        style={{
                            background: `linear-gradient(to right, #7B61FF 0%, #7B61FF ${((budget - min) / (max - min)) * 100}%, #E5E7EB ${((budget - min) / (max - min)) * 100}%, #E5E7EB 100%)`
                        }}
                    />
                    
                    {/* Scale markers */}
                    <div className="absolute -bottom-8 left-0 right-0">
                        {scales.map((scale, index) => (
                            <div
                                key={index}
                                className="absolute transform -translate-x-1/2"
                                style={{ left: `${scale.position}%` }}
                            >
                                <div className={`text-xs font-medium transition-colors ${
                                    currentScale.label === scale.label ? 'text-primary' : 'text-muted'
                                }`}>
                                    {scale.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Current scale info */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl2 p-4 border border-primary/20">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium text-primary mb-1">
                            {currentScale.label}
                        </div>
                        <div className="text-xs text-muted">
                            {currentScale.description}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-semibold text-text">
                            {formatNumber(reach.min)} - {formatNumber(reach.max)}
                        </div>
                        <div className="text-xs text-muted">
                            tahmini erişim
                        </div>
                    </div>
                </div>
            </div>

            {/* Budget impact indicators */}
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                    <div className="text-lg font-semibold text-text">
                        {formatNumber(reach.min / 14)}
                    </div>
                    <div className="text-xs text-muted mt-1">
                        günlük erişim
                    </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                    <div className="text-lg font-semibold text-text">
                        ${budget * 7}
                    </div>
                    <div className="text-xs text-muted mt-1">
                        haftalık bütçe
                    </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                    <div className="text-lg font-semibold text-text">
                        ${budget * 30}
                    </div>
                    <div className="text-xs text-muted mt-1">
                        aylık bütçe
                    </div>
                </div>
            </div>
        </div>
    );
}

// Export for global use
window.BudgetSlider = BudgetSlider;