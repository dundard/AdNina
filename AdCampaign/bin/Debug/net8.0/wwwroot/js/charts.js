// Chart.js Configuration and Utilities

// Chart.js default configuration
Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
Chart.defaults.color = '#6B7280';
Chart.defaults.borderColor = '#E5E7EB';

// Color scheme
const colors = {
    primary: '#7B61FF',
    primaryLight: 'rgba(123, 97, 255, 0.1)',
    secondary: '#10B981',
    secondaryLight: 'rgba(16, 185, 129, 0.1)',
    warning: '#F59E0B',
    warningLight: 'rgba(245, 158, 11, 0.1)',
    gray: '#6B7280',
    grayLight: 'rgba(107, 114, 128, 0.1)'
};

// Chart utilities
export function createGradient(ctx, color, opacity = 0.1) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color.replace('rgb', 'rgba').replace(')', `, ${opacity})`));
    gradient.addColorStop(1, color.replace('rgb', 'rgba').replace(')', `, 0)`));
    return gradient;
}

// Forecast charts configuration
export function renderForecastCharts(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear existing charts
    container.innerHTML = '';
    
    // Create discovery phase chart
    const discoveryDiv = document.createElement('div');
    discoveryDiv.className = 'mb-8';
    discoveryDiv.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-text heading">Keşif Aşaması</h3>
            <div class="flex items-center space-x-4 text-sm">
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full bg-primary"></div>
                    <span class="text-muted">Lexi - Güçlü Performans</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span class="text-muted">Standart Performans</span>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl2 shadow-card p-6">
            <canvas id="discoveryChart" width="400" height="200"></canvas>
        </div>
    `;
    
    // Create scaling phase chart
    const scalingDiv = document.createElement('div');
    scalingDiv.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-text heading">Ölçekleme Aşaması</h3>
            <div class="text-sm text-muted">
                <span>Optimize edilmiş kampanya performansı</span>
            </div>
        </div>
        <div class="bg-white rounded-xl2 shadow-card p-6">
            <canvas id="scalingChart" width="400" height="200"></canvas>
        </div>
    `;
    
    container.appendChild(discoveryDiv);
    container.appendChild(scalingDiv);
    
    // Render discovery chart
    renderDiscoveryChart(data);
    
    // Render scaling chart
    renderScalingChart(data);
}

function renderDiscoveryChart(data) {
    const ctx = document.getElementById('discoveryChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels.slice(0, 7), // First 7 days
            datasets: [
                {
                    label: 'Lexi - Güçlü Performans',
                    data: data.seriesA.slice(0, 7),
                    borderColor: colors.primary,
                    backgroundColor: createGradient(ctx.getContext('2d'), colors.primary),
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
                    data: data.seriesB.slice(0, 7),
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
                        borderDash: [3, 3]
                    },
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            elements: {
                point: {
                    hoverBorderWidth: 3
                }
            }
        }
    });
}

function renderScalingChart(data) {
    const ctx = document.getElementById('scalingChart');
    if (!ctx) return;
    
    const scalingData = data.seriesA.slice(7); // Last 7 days
    const projectedData = scalingData.map((val, index) => val + (val * 0.3 * (index + 1) / 7)); // Growth projection
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels.slice(7),
            datasets: [
                {
                    label: 'Optimize Edilmiş Performans',
                    data: projectedData,
                    borderColor: colors.secondary,
                    backgroundColor: createGradient(ctx.getContext('2d'), colors.secondary),
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
                        borderDash: [3, 3]
                    },
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
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
}

// Performance chart for AdSets page
export function renderPerformanceChart(containerId, metrics) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="bg-white rounded-xl2 shadow-card p-6">
            <h3 class="text-lg font-semibold text-text heading mb-4">Performans Tahmini</h3>
            <canvas id="performanceChart" width="400" height="300"></canvas>
        </div>
    `;
    
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    const labels = ['Erişim', 'Gösterim', 'Tık', 'Dönüşüm'];
    const data = [
        (metrics.reach.min + metrics.reach.max) / 2,
        (metrics.impressions.min + metrics.impressions.max) / 2,
        (metrics.clicks.min + metrics.clicks.max) / 2,
        (metrics.conversions.min + metrics.conversions.max) / 2
    ];
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    colors.primary,
                    colors.secondary,
                    colors.warning,
                    '#EF4444'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#ffffff',
                    titleColor: '#1F2937',
                    bodyColor: '#6B7280',
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    cornerRadius: 12,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${formatNumber(context.parsed)}`;
                        }
                    }
                }
            }
        }
    });
}

// Budget impact chart
export function renderBudgetImpactChart(containerId, budgetData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="bg-white rounded-xl2 shadow-card p-6">
            <h3 class="text-lg font-semibold text-text heading mb-4">Bütçe Etkisi</h3>
            <canvas id="budgetChart" width="400" height="200"></canvas>
        </div>
    `;
    
    const ctx = document.getElementById('budgetChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: budgetData.labels,
            datasets: [{
                label: 'Tahmini Erişim',
                data: budgetData.reach,
                backgroundColor: colors.primaryLight,
                borderColor: colors.primary,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#ffffff',
                    titleColor: '#1F2937', 
                    bodyColor: '#6B7280',
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    cornerRadius: 12,
                    padding: 12
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        borderDash: [3, 3]
                    },
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            }
        }
    });
}

// Utility function to format numbers (should match app.js)
function formatNumber(num, decimals = 0) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(decimals) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(decimals) + 'K';
    }
    return num.toLocaleString();
}

// Export functions for ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderForecastCharts,
        renderPerformanceChart,
        renderBudgetImpactChart,
        colors
    };
}

// Make available globally
window.ChartHelpers = {
    renderForecastCharts,
    renderPerformanceChart,
    renderBudgetImpactChart,
    colors
};