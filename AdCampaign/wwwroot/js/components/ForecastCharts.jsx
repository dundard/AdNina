// ForecastCharts Component - React component for displaying forecast charts
const { useState, useEffect, useRef } = React;

function ForecastCharts({ 
    budget = 30,
    className = ""
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState(null);
    const chartsRef = useRef(null);
    const discoveryChartRef = useRef(null);
    const scalingChartRef = useRef(null);

    useEffect(() => {
        // Simulate loading and get scaled data
        setIsLoading(true);
        
        const timer = setTimeout(() => {
            if (window.AppData && window.AppData.getScaledForecast) {
                const data = window.AppData.getScaledForecast(budget);
                setChartData(data);
            }
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [budget]);

    useEffect(() => {
        if (chartData && !isLoading) {
            renderCharts();
        }
    }, [chartData, isLoading]);

    const renderCharts = () => {
        if (!chartData) return;

        // Clear existing charts
        if (discoveryChartRef.current) {
            Chart.getChart(discoveryChartRef.current)?.destroy();
        }
        if (scalingChartRef.current) {
            Chart.getChart(scalingChartRef.current)?.destroy();
        }

        // Render discovery chart
        renderDiscoveryChart();
        
        // Render scaling chart
        renderScalingChart();
    };

    const renderDiscoveryChart = () => {
        const ctx = discoveryChartRef.current;
        if (!ctx || !chartData) return;

        const colors = {
            primary: '#7B61FF',
            primaryLight: 'rgba(123, 97, 255, 0.1)',
            gray: '#6B7280',
            grayLight: 'rgba(107, 114, 128, 0.1)'
        };

        // Create gradient
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(123, 97, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(123, 97, 255, 0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels.slice(0, 7),
                datasets: [
                    {
                        label: 'Lexi - Güçlü Performans',
                        data: chartData.seriesA.slice(0, 7),
                        borderColor: colors.primary,
                        backgroundColor: gradient,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: colors.primary,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Standart Performans',
                        data: chartData.seriesB.slice(0, 7),
                        borderColor: colors.gray,
                        backgroundColor: colors.grayLight,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: colors.gray,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#ffffff',
                        titleColor: '#1F2937',
                        bodyColor: '#6B7280',
                        borderColor: '#E5E7EB',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 12,
                        callbacks: {
                            title: function(context) {
                                return `Gün ${context[0].dataIndex + 1}`;
                            },
                            label: function(context) {
                                return `${context.dataset.label}: ${formatNumber(context.parsed.y)} erişim`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            callback: function(value, index) {
                                return `Gün ${index + 1}`;
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            borderDash: [3, 3],
                            color: '#F3F4F6'
                        },
                        ticks: {
                            callback: function(value) {
                                return formatNumber(value);
                            },
                            color: '#6B7280'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    };

    const renderScalingChart = () => {
        const ctx = scalingChartRef.current;
        if (!ctx || !chartData) return;

        const colors = {
            secondary: '#10B981',
            secondaryLight: 'rgba(16, 185, 129, 0.1)',
            gray: '#6B7280'
        };

        const scalingData = chartData.seriesA.slice(7);
        const projectedData = scalingData.map((val, index) => val + (val * 0.3 * (index + 1) / 7));

        // Create gradient
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels.slice(7),
                datasets: [
                    {
                        label: 'Optimize Edilmiş Performans',
                        data: projectedData,
                        borderColor: colors.secondary,
                        backgroundColor: gradient,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: colors.secondary,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Mevcut Performans',
                        data: scalingData,
                        borderColor: colors.gray,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: colors.gray,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#ffffff',
                        titleColor: '#1F2937',
                        bodyColor: '#6B7280',
                        borderColor: '#E5E7EB',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 12,
                        callbacks: {
                            title: function(context) {
                                return `Gün ${context[0].dataIndex + 8}`;
                            },
                            label: function(context) {
                                return `${context.dataset.label}: ${formatNumber(context.parsed.y)} erişim`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            callback: function(value, index) {
                                return `Gün ${index + 8}`;
                            }
                        }
                    },
                    y: {
                        beginAtZero: false,
                        grid: {
                            borderDash: [3, 3],
                            color: '#F3F4F6'
                        },
                        ticks: {
                            callback: function(value) {
                                return formatNumber(value);
                            },
                            color: '#6B7280'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    };

    const getEstimatedReach = () => {
        if (window.AppData && window.AppData.getEstimatedReach) {
            return window.AppData.getEstimatedReach(budget);
        }
        return { min: 976900, max: 1465400 };
    };

    const reach = getEstimatedReach();

    if (isLoading) {
        return (
            <div className={`space-y-8 ${className}`}>
                <SkeletonBlock height="h-64" />
                <SkeletonBlock height="h-64" />
            </div>
        );
    }

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Estimated Reach Display */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl2 p-6 border border-primary/20">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-text heading mb-2">
                        Tahmini Erişim
                    </h3>
                    <div className="text-3xl font-bold text-primary mb-1">
                        {formatNumber(reach.min)} - {formatNumber(reach.max)}
                    </div>
                    <div className="text-sm text-muted">
                        14 günlük kampanya süresi
                    </div>
                </div>
            </div>

            {/* Discovery Phase Chart */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text heading">Keşif Aşaması</h3>
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span className="text-muted">Lexi - Güçlü Performans</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <span className="text-muted">Standart Performans</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl2 shadow-card p-6">
                    <div className="h-64">
                        <canvas ref={discoveryChartRef}></canvas>
                    </div>
                </div>
            </div>

            {/* Scaling Phase Chart */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text heading">Ölçekleme Aşaması</h3>
                    <div className="text-sm text-muted">
                        <span>Optimize edilmiş kampanya performansı</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl2 shadow-card p-6">
                    <div className="h-64">
                        <canvas ref={scalingChartRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Format number utility (should match app.js)
function formatNumber(num, decimals = 0) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(decimals) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(decimals) + 'K';
    }
    return num.toLocaleString();
}

// Export for global use
window.ForecastCharts = ForecastCharts;