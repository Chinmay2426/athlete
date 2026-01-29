// live-tracking.js

import { createIcon } from "../utils.js";
import { mockLiveRunners, mockRaceResults } from "../data.js";

export function renderLiveTracking(container) {
    let searchBib = "";
    let currentTime = new Date();

    // ⏱️ Update time every second
    const timeInterval = setInterval(() => {
        currentTime = new Date();
        document.querySelectorAll(".live-time").forEach(el => {
            el.textContent = currentTime.toLocaleTimeString();
        });
    }, 1000);

    function renderContent() {
        const filteredRunners = searchBib
            ? mockLiveRunners.filter(runner =>
                runner.bibNumber.toLowerCase().includes(searchBib.toLowerCase()) ||
                runner.name.toLowerCase().includes(searchBib.toLowerCase())
            )
            : mockLiveRunners;

        container.innerHTML = `
            <div class="bg-gray-50" style="min-height: 100vh; padding: 2rem 0;">
                <div class="container">
                    <!-- Header -->
                    <div class="mb-8">
                        <div class="flex items-center gap-3 mb-2">
                            <div style="width: 40px; height: 40px; color: var(--danger-red);">
                                <div class="animate-pulse">${createIcon('radio').outerHTML}</div>
                            </div>
                            <div>
                                <h1 class="text-4xl font-bold">Live Race Tracking</h1>
                                <div class="flex items-center gap-2 mt-1">
                                    <span class="badge badge-live">LIVE</span>
                                    <span class="text-gray-600">Urban Cycling Grand Prix</span>
                                </div>
                            </div>
                        </div>
                        <p class="text-xl text-gray-600">Real-time participant tracking and race updates</p>
                    </div>

                    <!-- Race Info Bar -->
                    <div class="cta-section py-6 mb-8 rounded-lg">
                        <div class="grid grid-md-4 gap-6 text-white text-center">
                            <div>
                                ${createIcon('clock').outerHTML}
                                <p class="text-sm" style="opacity: 0.9; margin-top: 0.5rem;">Race Time</p>
                                <p class="text-2xl font-bold live-time">${currentTime.toLocaleTimeString()}</p>
                            </div>
                            <div>
                                ${createIcon('users').outerHTML}
                                <p class="text-sm" style="opacity: 0.9; margin-top: 0.5rem;">Active Runners</p>
                                <p class="text-2xl font-bold">1,523</p>
                            </div>
                            <div>
                                ${createIcon('activity').outerHTML}
                                <p class="text-sm" style="opacity: 0.9; margin-top: 0.5rem;">Finished</p>
                                <p class="text-2xl font-bold">847</p>
                            </div>
                            <div>
                                ${createIcon('mapPin').outerHTML}
                                <p class="text-sm" style="opacity: 0.9; margin-top: 0.5rem;">Current KM</p>
                                <p class="text-2xl font-bold">38.5</p>
                            </div>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div class="tabs" id="trackingTabs">
                        <div class="tabs-list">
                            <button class="tab-trigger active" data-tab="live" onclick="switchTab('trackingTabs', 'live')">Live Positions</button>
                            <button class="tab-trigger" data-tab="results" onclick="switchTab('trackingTabs', 'results')">Results</button>
                            <button class="tab-trigger" data-tab="map" onclick="switchTab('trackingTabs', 'map')">Track Map</button>
                        </div>

                        <!-- Live Positions Tab -->
                        <div class="tab-content active" id="live">
                            <!-- Search -->
                            <div class="card mb-6">
                                <div class="card-content">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <div class="card-title">Track a Runner</div>
                                            <div class="card-description">Search by bib number or name</div>
                                        </div>
                                        <div class="search-container" style="width: 256px;">
                                            <div class="search-icon">${createIcon('search').outerHTML}</div>
                                            <input type="text" id="searchBib" class="search-input" placeholder="Search bib number..." value="${searchBib}">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Live Leaderboard -->
                            <div class="card mb-6">
                                <div class="card-header">
                                    <div class="card-title flex items-center gap-2">
                                        ${createIcon('trophy').outerHTML}
                                        Current Top Positions
                                    </div>
                                    <div class="card-description">Live leaderboard updates every 30 seconds</div>
                                </div>
                                <div class="card-content">
                                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                        ${filteredRunners.map((runner, idx) => {
                                            const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : 'rank-other';
                                            const positionClass = idx === 0 ? 'position-1' : idx === 1 ? 'position-2' : idx === 2 ? 'position-3' : 'position-other';
                                            return `
                                                <div class="leaderboard-item ${rankClass}">
                                                    <div class="flex items-center justify-between">
                                                        <div class="flex items-center gap-4">
                                                            <div class="position-badge ${positionClass}">
                                                                ${runner.currentPosition}
                                                            </div>
                                                            <div>
                                                                <h4 class="font-bold text-lg">${runner.name}</h4>
                                                                <div class="flex items-center gap-3 text-sm text-gray-600">
                                                                    <span class="badge badge-outline">Bib ${runner.bibNumber}</span>
                                                                    <span class="flex items-center gap-1">
                                                                        ${createIcon('mapPin').outerHTML}
                                                                        ${runner.distance} km
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="text-right">
                                                            <div class="flex items-center gap-2 mb-1">
                                                                ${createIcon('zap').outerHTML}
                                                                <span class="font-semibold">${runner.pace}</span>
                                                            </div>
                                                            <div class="flex items-center gap-2 text-sm text-gray-600">
                                                                ${createIcon('clock').outerHTML}
                                                                <span>ETA: ${runner.estimatedFinish}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            `;
                                        }).join('')}
                                        
                                        ${filteredRunners.length === 0 ? `
                                            <div class="text-center py-8">
                                                <p class="text-gray-500">No runners found</p>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>

                            <!-- Live Updates -->
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title flex items-center gap-2">
                                        <div class="animate-pulse" style="color: var(--danger-red);">${createIcon('activity').outerHTML}</div>
                                        Live Updates
                                    </div>
                                </div>
                                <div class="card-content">
                                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                        ${[
                                            { time: '14:32:15', message: 'Alex Thompson passes 38km checkpoint!', type: 'checkpoint' },
                                            { time: '14:31:48', message: 'Maria Garcia maintains strong pace', type: 'update' },
                                            { time: '14:30:22', message: 'New leader! Alex Thompson takes 1st position', type: 'leader' },
                                            { time: '14:28:56', message: 'John Kim completes 37km', type: 'checkpoint' },
                                            { time: '14:27:10', message: '100 runners have finished!', type: 'milestone' }
                                        ].map(update => {
                                            const dotClass = update.type === 'leader' ? 'bg-yellow-500 animate-pulse' :
                                                           update.type === 'checkpoint' ? 'bg-blue-500' :
                                                           update.type === 'milestone' ? 'bg-green-500' : 'bg-gray-400';
                                            return `
                                                <div class="activity-item">
                                                    <div style="width: 0.5rem; height: 0.5rem; border-radius: var(--radius-full); margin-top: 0.5rem; ${dotClass.includes('bg-yellow') ? 'background: #eab308; animation: pulse 2s infinite;' : dotClass.includes('bg-blue') ? 'background: var(--primary-blue);' : dotClass.includes('bg-green') ? 'background: var(--success-green);' : 'background: var(--gray-400);'}"></div>
                                                    <div style="flex: 1;">
                                                        <p class="font-medium">${update.message}</p>
                                                        <p class="text-xs text-gray-500">${update.time}</p>
                                                    </div>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Results Tab -->
                        <div class="tab-content" id="results">
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title flex items-center gap-2">
                                        ${createIcon('medal').outerHTML}
                                        Race Results
                                    </div>
                                    <div class="card-description">Final standings for finished runners</div>
                                </div>
                                <div class="card-content">
                                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                        ${mockRaceResults.map(result => {
                                            const positionClass = result.rank === 1 ? 'position-1' : 
                                                                result.rank === 2 ? 'position-2' : 
                                                                result.rank === 3 ? 'position-3' : 'position-other';
                                            return `
                                                <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                                    <div class="flex items-center gap-4">
                                                        <div class="position-badge ${positionClass}" style="width: 2.5rem; height: 2.5rem; font-size: 1.125rem;">
                                                            ${result.rank}
                                                        </div>
                                                        <div>
                                                            <h4 class="font-semibold">${result.athleteName}</h4>
                                                            <div class="flex items-center gap-2 text-sm text-gray-600">
                                                                <span class="badge badge-outline">Bib ${result.bibNumber}</span>
                                                                <span>${result.category}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="text-right">
                                                        <p class="text-xl font-bold" style="color: var(--primary-blue);">${result.finishTime}</p>
                                                        <p class="text-sm text-gray-600">${result.pace}</p>
                                                    </div>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                    <div class="mt-6 text-center">
                                        <button class="btn btn-outline">Load More Results</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Map Tab -->
                        <div class="tab-content" id="map">
                            <div class="card mb-6">
                                <div class="card-header">
                                    <div class="card-title flex items-center gap-2">
                                        ${createIcon('navigation').outerHTML}
                                        Race Track Map
                                    </div>
                                    <div class="card-description">Interactive map showing runner positions</div>
                                </div>
                                <div class="card-content">
                                    <div class="bg-gray-100 rounded-lg p-12 text-center" style="height: 384px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                        <div style="width: 64px; height: 64px; color: var(--gray-400); margin-bottom: 1rem;">
                                            ${createIcon('mapPin').outerHTML}
                                        </div>
                                        <p class="text-gray-600 text-lg">Interactive map with GPS tracking</p>
                                        <p class="text-gray-500 text-sm mt-2">Live positions updated every 30 seconds</p>
                                        <div class="flex gap-4 mt-6">
                                            <div class="flex items-center gap-2">
                                                <div style="width: 1rem; height: 1rem; background: var(--primary-blue); border-radius: var(--radius-full);"></div>
                                                <span class="text-sm">Active Runners</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <div style="width: 1rem; height: 1rem; background: var(--success-green); border-radius: var(--radius-full);"></div>
                                                <span class="text-sm">Checkpoints</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <div style="width: 1rem; height: 1rem; background: var(--danger-red); border-radius: var(--radius-full);"></div>
                                                <span class="text-sm">Emergency</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Checkpoints -->
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title">Checkpoint Status</div>
                                </div>
                                <div class="card-content">
                                    <div class="grid grid-md-2 grid-lg-4 gap-4">
                                        ${[
                                            { name: 'Start Line', distance: '0 km', passed: 1523, status: 'complete' },
                                            { name: 'Checkpoint 1', distance: '10 km', passed: 1523, status: 'complete' },
                                            { name: 'Checkpoint 2', distance: '25 km', passed: 1498, status: 'active' },
                                            { name: 'Checkpoint 3', distance: '38 km', passed: 892, status: 'active' },
                                            { name: 'Checkpoint 4', distance: '50 km', passed: 234, status: 'active' },
                                            { name: 'Water Station 1', distance: '5 km', passed: 1523, status: 'complete' },
                                            { name: 'Water Station 2', distance: '15 km', passed: 1521, status: 'complete' },
                                            { name: 'Finish Line', distance: '100 km', passed: 0, status: 'waiting' }
                                        ].map(checkpoint => `
                                            <div class="checkpoint-card">
                                                <div class="checkpoint-status">
                                                    <h4 class="checkpoint-name">${checkpoint.name}</h4>
                                                    <span class="badge ${
                                                        checkpoint.status === 'complete' ? 'badge-success' :
                                                        checkpoint.status === 'active' ? 'badge-primary' :
                                                        'badge-outline'
                                                    }">${checkpoint.status}</span>
                                                </div>
                                                <p class="text-sm text-gray-600">${checkpoint.distance}</p>
                                                <p class="text-sm font-medium mt-1">${checkpoint.passed} runners passed</p>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Race Stats -->
                    <div class="grid grid-md-3 gap-6 mt-8">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title text-lg">Fastest Pace</div>
                            </div>
                            <div class="card-content">
                                <div class="text-center">
                                    <div style="width: 48px; height: 48px; color: var(--success-green); margin: 0 auto 0.5rem;">
                                        ${createIcon('trendingUp').outerHTML}
                                    </div>
                                    <p class="text-3xl font-bold" style="color: var(--success-green);">4:15/km</p>
                                    <p class="text-sm text-gray-600 mt-1">Alex Thompson</p>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-title text-lg">Average Pace</div>
                            </div>
                            <div class="card-content">
                                <div class="text-center">
                                    <div style="width: 48px; height: 48px; color: var(--primary-blue); margin: 0 auto 0.5rem;">
                                        ${createIcon('activity').outerHTML}
                                    </div>
                                    <p class="text-3xl font-bold" style="color: var(--primary-blue);">5:12/km</p>
                                    <p class="text-sm text-gray-600 mt-1">All participants</p>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-title text-lg">Completion Rate</div>
                            </div>
                            <div class="card-content">
                                <div class="text-center">
                                    <div style="width: 48px; height: 48px; color: var(--primary-purple); margin: 0 auto 0.5rem;">
                                        ${createIcon('trophy').outerHTML}
                                    </div>
                                    <p class="text-3xl font-bold" style="color: var(--primary-purple);">55.6%</p>
                                    <p class="text-sm text-gray-600 mt-1">847 / 1523 finished</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 🔎 Search handler
        const searchInput = document.getElementById("searchBib");
        if (searchInput) {
            searchInput.oninput = e => {
                searchBib = e.target.value;
                renderContent();
            };
        }
    }

    renderContent();

    // 🧹 Cleanup
    window.addEventListener("beforeunload", () => {
        clearInterval(timeInterval);
    });
}
