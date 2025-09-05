// SkeletonBlock Component - React component for loading states
const { useState, useEffect } = React;

function SkeletonBlock({ 
    width = "w-full",
    height = "h-4",
    className = "",
    animated = true,
    lines = 1,
    spacing = "space-y-2"
}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Delay showing skeleton to avoid flash on fast loads
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) {
        return null;
    }

    const skeletonClass = `
        ${width} ${height} bg-gray-200 rounded
        ${animated ? 'animate-shimmer' : ''}
        ${className}
    `.trim();

    if (lines === 1) {
        return <div className={skeletonClass}></div>;
    }

    return (
        <div className={spacing}>
            {Array.from({ length: lines }, (_, index) => (
                <div 
                    key={index} 
                    className={`${skeletonClass} ${index === lines - 1 && lines > 1 ? 'w-3/4' : ''}`}
                ></div>
            ))}
        </div>
    );
}

// Pre-built skeleton components for common use cases
function SkeletonCard({ className = "" }) {
    return (
        <div className={`bg-white rounded-xl2 shadow-card p-6 ${className}`}>
            <div className="space-y-4">
                <SkeletonBlock width="w-3/4" height="h-6" />
                <SkeletonBlock lines={3} />
                <div className="flex space-x-4">
                    <SkeletonBlock width="w-20" height="h-8" />
                    <SkeletonBlock width="w-20" height="h-8" />
                </div>
            </div>
        </div>
    );
}

function SkeletonText({ lines = 3, className = "" }) {
    return (
        <div className={className}>
            <SkeletonBlock lines={lines} spacing="space-y-3" />
        </div>
    );
}

function SkeletonAvatar({ size = "w-10 h-10", className = "" }) {
    return (
        <div className={`${size} bg-gray-200 rounded-full animate-shimmer ${className}`}></div>
    );
}

function SkeletonButton({ width = "w-24", className = "" }) {
    return (
        <div className={`${width} h-10 bg-gray-200 rounded-xl2 animate-shimmer ${className}`}></div>
    );
}

function SkeletonChart({ height = "h-64", className = "" }) {
    return (
        <div className={`bg-white rounded-xl2 shadow-card p-6 ${className}`}>
            <div className="space-y-4">
                <SkeletonBlock width="w-1/3" height="h-6" />
                <div className={`${height} bg-gray-100 rounded-lg relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer transform -skew-x-12"></div>
                    {/* Mock chart elements */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        {Array.from({ length: 7 }, (_, i) => (
                            <div 
                                key={i}
                                className="bg-gray-200 rounded-t"
                                style={{ 
                                    width: '8%', 
                                    height: `${Math.random() * 60 + 20}%` 
                                }}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SkeletonForm({ className = "" }) {
    return (
        <div className={`space-y-6 ${className}`}>
            <div className="space-y-2">
                <SkeletonBlock width="w-1/4" height="h-4" />
                <SkeletonBlock height="h-12" />
            </div>
            <div className="space-y-2">
                <SkeletonBlock width="w-1/3" height="h-4" />
                <SkeletonBlock height="h-32" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <SkeletonBlock width="w-1/2" height="h-4" />
                    <SkeletonBlock height="h-12" />
                </div>
                <div className="space-y-2">
                    <SkeletonBlock width="w-1/2" height="h-4" />
                    <SkeletonBlock height="h-12" />
                </div>
            </div>
            <SkeletonButton width="w-32" />
        </div>
    );
}

function SkeletonList({ items = 5, className = "" }) {
    return (
        <div className={`space-y-4 ${className}`}>
            {Array.from({ length: items }, (_, index) => (
                <div key={index} className="flex items-center space-x-4">
                    <SkeletonAvatar />
                    <div className="flex-1 space-y-2">
                        <SkeletonBlock width="w-1/4" height="h-4" />
                        <SkeletonBlock width="w-3/4" height="h-3" />
                    </div>
                    <SkeletonButton width="w-16" />
                </div>
            ))}
        </div>
    );
}

// Analysis page skeleton
function SkeletonAnalysis({ className = "" }) {
    return (
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${className}`}>
            {/* Left column - checklist */}
            <div className="lg:col-span-4">
                <div className="bg-white rounded-xl2 shadow-card p-6">
                    <SkeletonBlock width="w-2/3" height="h-6" className="mb-6" />
                    <div className="space-y-4">
                        {Array.from({ length: 7 }, (_, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-gray-200 rounded-full animate-shimmer"></div>
                                <SkeletonBlock width="w-full" height="h-4" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Right column - cards */}
            <div className="lg:col-span-8 space-y-6">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    );
}

// Export individual components
window.SkeletonBlock = SkeletonBlock;
window.SkeletonCard = SkeletonCard;
window.SkeletonText = SkeletonText;
window.SkeletonAvatar = SkeletonAvatar;
window.SkeletonButton = SkeletonButton;
window.SkeletonChart = SkeletonChart;
window.SkeletonForm = SkeletonForm;
window.SkeletonList = SkeletonList;
window.SkeletonAnalysis = SkeletonAnalysis;