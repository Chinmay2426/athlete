// Athlete Dashboard View
import { mockAthlete, mockEvents } from "../data.js";
import { createIcon } from "../utils.js";



// Helper functions
function formatDate(date) {
    return new Date(date).toDateString();
}

function formatDateShort(date) {
    return new Date(date).toLocaleDateString();
}
function switchTab(tabsId, activeTab) {
    const tabs = document.getElementById(tabsId);
    if (!tabs) return;

    tabs.querySelectorAll(".tab-trigger").forEach(btn => {
        btn.classList.remove("active");
    });

    tabs.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.remove("active");
    });

    const activeBtn = tabs.querySelector(`[data-tab="${activeTab}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    const activeContent = tabs.querySelector(`#${activeTab}`);
    if (activeContent) activeContent.classList.add("active");
}

/* 🔑 VERY IMPORTANT */
window.switchTab = switchTab;


function renderAthleteDashboard(container) {
    const upcomingEvents = mockEvents.filter(e => e.status === 'upcoming').slice(0, 3);
    const completedEvents = mockEvents.filter(e => e.status === 'completed');
    
    container.innerHTML = `
        <div class="bg-gray-50" style="min-height: 100vh; padding: 2rem 0;">
            <div class="container">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-4xl font-bold mb-2">Welcome back, ${mockAthlete.name}!</h1>
                    <p class="text-xl text-gray-600">Track your progress and manage your events</p>
                </div>

                <!-- Stats Overview -->
                <div class="grid grid-md-4 gap-6 mb-8">
                    <div class="dashboard-stat">
                        <div class="stat-header">
                            <div class="stat-title">Events Completed</div>
                            <div class="stat-icon">${createIcon('trophy').outerHTML}</div>
                        </div>
                        <div class="stat-number">${mockAthlete.eventsCompleted}</div>
                        <div class="stat-change positive">+2 this month</div>
                    </div>

                    <div class="dashboard-stat">
                        <div class="stat-header">
                            <div class="stat-title">Total Distance</div>
                            <div class="stat-icon">${createIcon('activity').outerHTML}</div>
                        </div>
                        <div class="stat-number">${mockAthlete.totalDistance} km</div>
                        <div class="stat-change positive">+42.2 km this month</div>
                    </div>

                    <div class="dashboard-stat">
                        <div class="stat-header">
                            <div class="stat-title">Achievements</div>
                            <div class="stat-icon">${createIcon('award').outerHTML}</div>
                        </div>
                        <div class="stat-number">${mockAthlete.achievements.length}</div>
                        <div class="stat-change positive">+1 new badge</div>
                    </div>

                    <div class="dashboard-stat">
                        <div class="stat-header">
                            <div class="stat-title">Current Rank</div>
                            <div class="stat-icon">${createIcon('trendingUp').outerHTML}</div>
                        </div>
                        <div class="stat-number">#247</div>
                        <div class="stat-change positive">↑ 12 positions</div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="tabs" id="athleteTabs">
                    <div class="tabs-list">
                        <button class="tab-trigger active" data-tab="overview" onclick="switchTab('athleteTabs', 'overview')">Overview</button>
                        <button class="tab-trigger" data-tab="upcoming" onclick="switchTab('athleteTabs', 'upcoming')">Upcoming Events</button>
                        <button class="tab-trigger" data-tab="history" onclick="switchTab('athleteTabs', 'history')">Event History</button>
                        <button class="tab-trigger" data-tab="achievements" onclick="switchTab('athleteTabs', 'achievements')">Achievements</button>
                        <button class="tab-trigger" data-tab="analytics" onclick="switchTab('athleteTabs', 'analytics')">Performance</button>
                    </div>

                    <!-- Overview Tab -->
                    <div class="tab-content active" id="overview">
                        <div class="grid grid-lg-2 gap-6 mb-6">
                            <!-- Next Event -->
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title flex items-center gap-2">
                                        ${createIcon('calendar').outerHTML}
                                        Next Event
                                    </div>
                                </div>
                                <div class="card-content">
                                    ${upcomingEvents[0] ? `
                                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                                            <div>
                                                <h3 class="font-semibold text-lg mb-1">${upcomingEvents[0].title}</h3>
                                                <p class="text-gray-600">${upcomingEvents[0].category} • ${upcomingEvents[0].distance}</p>
                                            </div>
                                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                                <div class="flex items-center gap-2 text-sm">
                                                    ${createIcon('calendar').outerHTML}
                                                    <span>${formatDate(upcomingEvents[0].date)}</span>
                                                </div>
                                                <div class="flex items-center gap-2 text-sm">
                                                    ${createIcon('mapPin').outerHTML}
                                                    <span>${upcomingEvents[0].location}</span>
                                                </div>
                                            </div>
                                            <div style="padding-top: 1rem;">
                                                <p class="text-sm text-gray-600 mb-2">Days until race</p>
                                                <div class="text-3xl font-bold" style="color: var(--primary-blue);">23</div>
                                            </div>
                                            <button class="btn btn-primary" style="width: 100%;" onclick="navigateTo('event-details', '${upcomingEvents[0].id}')">
                                                View Event Details
                                            </button>
                                        </div>
                                    ` : `
                                        <p class="text-gray-500">No upcoming events</p>
                                    `}
                                </div>
                            </div>

                            <!-- Training Progress -->
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title flex items-center gap-2">
                                        ${createIcon('target').outerHTML}
                                        Training Progress
                                    </div>
                                    <div class="card-description">This month's goals</div>
                                </div>
                                <div class="card-content" style="display: flex; flex-direction: column; gap: 1.5rem;">
                                    <div>
                                        <div class="flex justify-between mb-2">
                                            <span class="text-sm font-medium">Weekly Distance Goal</span>
                                            <span class="text-sm text-gray-600">45/50 km</span>
                                        </div>
                                        <div class="progress">
                                            <div class="progress-bar" style="width: 90%;"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex justify-between mb-2">
                                            <span class="text-sm font-medium">Training Sessions</span>
                                            <span class="text-sm text-gray-600">12/15 completed</span>
                                        </div>
                                        <div class="progress">
                                            <div class="progress-bar" style="width: 80%;"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex justify-between mb-2">
                                            <span class="text-sm font-medium">Recovery Days</span>
                                            <span class="text-sm text-gray-600">5/6 taken</span>
                                        </div>
                                        <div class="progress">
                                            <div class="progress-bar" style="width: 83%;"></div>
                                        </div>
                                    </div>
                                    <button class="btn btn-outline" style="width: 100%;">View Training Plan</button>
                                </div>
                            </div>
                        </div>

                        <!-- Recent Achievements -->
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title flex items-center gap-2">
                                    ${createIcon('medal').outerHTML}
                                    Recent Achievements
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="grid grid-md-4 gap-4">
                                    ${mockAthlete.achievements.map(achievement => `
                                        <div class="achievement">
                                            <div class="achievement-icon">${achievement.icon}</div>
                                            <div class="achievement-title">${achievement.title}</div>
                                            <div class="achievement-date">${formatDateShort(achievement.date)}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Upcoming Events Tab -->
                    <div class="tab-content" id="upcoming">
                        <div class="grid grid-md-2 grid-lg-3 gap-6">
                            ${upcomingEvents.map(event => `
                                <div class="event-card">
                                    <div class="event-image-container">
                                        <img src="${event.imageUrl}" alt="${event.title}" class="event-image">
                                    </div>
                                    <div class="card-header">
                                        <div class="card-title text-lg">${event.title}</div>
                                        <div class="card-description">${event.category} • ${event.distance}</div>
                                    </div>
                                    <div class="card-content" style="display: flex; flex-direction: column; gap: 0.75rem;">
                                        <div class="flex items-center gap-2 text-sm">
                                            ${createIcon('calendar').outerHTML}
                                            ${formatDateShort(event.date)}
                                        </div>
                                        <div class="flex items-center gap-2 text-sm">
                                            ${createIcon('mapPin').outerHTML}
                                            ${event.location}
                                        </div>
                                        <span class="badge badge-success">Registered</span>
                                        <button class="btn btn-outline" style="width: 100%; margin-top: 0.5rem;" onclick="navigateTo('event-details', '${event.id}')">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Event History Tab -->
                    <div class="tab-content" id="history">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">Completed Events</div>
                                <div class="card-description">Your race history and results</div>
                            </div>
                            <div class="card-content">
                                <div style="display: flex; flex-direction: column; gap: 1rem;">
                                    ${completedEvents.map(event => `
                                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div class="flex items-center gap-4">
                                                <img src="${event.imageUrl}" alt="${event.title}" style="width: 64px; height: 64px; border-radius: var(--radius-md); object-fit: cover;">
                                                <div>
                                                    <h4 class="font-semibold">${event.title}</h4>
                                                    <p class="text-sm text-gray-600">${event.category} • ${event.distance}</p>
                                                    <p class="text-xs text-gray-500">${formatDateShort(event.date)}</p>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <div class="flex items-center gap-2 mb-1">
                                                    ${createIcon('clock').outerHTML}
                                                    <span class="font-semibold">3:42:15</span>
                                                </div>
                                                <span class="badge badge-outline">Rank: 24/${event.participants}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Achievements Tab -->
                    <div class="tab-content" id="achievements">
                        <div class="grid grid-md-3 grid-lg-4 gap-6">
                            ${mockAthlete.achievements.map(achievement => `
                                <div class="card text-center">
                                    <div class="card-header">
                                        <div style="font-size: 4rem; margin-bottom: 1rem;">${achievement.icon}</div>
                                        <div class="card-title text-lg">${achievement.title}</div>
                                    </div>
                                    <div class="card-content">
                                        <p class="text-sm text-gray-600">Earned on ${formatDate(achievement.date)}</p>
                                    </div>
                                </div>
                            `).join('')}
                            
                            <div class="card text-center" style="border: 2px dashed var(--gray-300); opacity: 0.6;">
                                <div class="card-header">
                                    <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;">🔒</div>
                                    <div class="card-title text-lg text-gray-500">Century Club</div>
                                </div>
                                <div class="card-content">
                                    <p class="text-sm text-gray-500">Complete 100km total</p>
                                    <div class="progress mt-2">
                                        <div class="progress-bar" style="width: 48.75%;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Analytics Tab -->
                    <div class="tab-content" id="analytics">
                        <div class="grid grid-lg-2 gap-6">
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title flex items-center gap-2">
                                        ${createIcon('barChart').outerHTML}
                                        Performance Trends
                                    </div>
                                </div>
                                <div class="card-content">
                                    <div style="height: 256px; display: flex; align-items: center; justify-content: center; background: var(--gray-50); border-radius: var(--radius-lg);">
                                        <p class="text-gray-500">Performance chart visualization</p>
                                    </div>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title">Personal Records</div>
                                </div>
                                <div class="card-content" style="display: flex; flex-direction: column; gap: 1rem;">
                                    <div class="pr-card yellow flex justify-between items-center">
                                        <div>
                                            <p class="font-semibold">5K</p>
                                            <p class="text-sm text-gray-600">Best Time</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="pr-time yellow">19:45</p>
                                            <p class="text-xs text-gray-500">Mar 2025</p>
                                        </div>
                                    </div>
                                    <div class="pr-card blue flex justify-between items-center">
                                        <div>
                                            <p class="font-semibold">10K</p>
                                            <p class="text-sm text-gray-600">Best Time</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="pr-time blue">41:22</p>
                                            <p class="text-xs text-gray-500">Feb 2026</p>
                                        </div>
                                    </div>
                                    <div class="pr-card purple flex justify-between items-center">
                                        <div>
                                            <p class="font-semibold">Half Marathon</p>
                                            <p class="text-sm text-gray-600">Best Time</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="pr-time purple">1:32:18</p>
                                            <p class="text-xs text-gray-500">Jan 2026</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- LOGOUT BUTTON -->
                <div style="text-align:center;margin-top:40px;padding:20px 0">
                    <button class="btn btn-outline" id="dashboardLogoutBtn">Logout</button>
                </div>
            </div>
        </div>
    `;

    /* ================= EVENTS ================= */

    const logoutBtn = container.querySelector("#dashboardLogoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem("currentUser");
            navigateTo("landing");
        };
    }
}

/* ================= EXPORT ================= */

export { renderAthleteDashboard };
