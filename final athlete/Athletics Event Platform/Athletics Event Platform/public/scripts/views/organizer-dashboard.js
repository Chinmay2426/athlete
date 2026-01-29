// Organizer Dashboard View
import { mockEvents } from "../data.js";
import { createIcon } from "../utils.js";

// Helper functions
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDateShort(date) {
    return new Date(date).toLocaleDateString();
}

function getStatusBadgeClass(status) {
    switch(status) {
        case 'active': return 'badge-success';
        case 'upcoming': return 'badge-warning';
        case 'completed': return 'badge-outline';
        default: return 'badge-outline';
    }
}

const volunteers = [
    {
        name: "Alex Brown",
        role: "Check-in Desk",
        event: "City Marathon 2026",
        status: "active"
    },
    {
        name: "Priya Patel",
        role: "Water Station",
        event: "City Marathon 2026",
        status: "active"
    },
    {
        name: "Rahul Mehta",
        role: "Route Marshal",
        event: "Mountain Trail Challenge",
        status: "pending"
    }
];


function renderOrganizerDashboard(container) {
    const myEvents = mockEvents.slice(0, 4);
    const totalRevenue = myEvents.reduce((sum, event) => sum + (event.participants * event.price), 0);
    const totalParticipants = myEvents.reduce((sum, event) => sum + event.participants, 0);
    
    container.innerHTML = `
        <div class="bg-gray-50" style="min-height: 100vh; padding: 2rem 0;">
            <div class="container">
                <!-- Header -->
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="text-4xl font-bold mb-2">Organizer Portal</h1>
                        <p class="text-xl text-gray-600">Manage your events and participants</p>
                    </div>
                </div>

                <!-- Stats Overview -->
                <div class="grid grid-md-4 gap-6 mb-8">
                    <div class="dashboard-stat">
                        <div class="stat-header">
                            <div class="stat-title">Total Events</div>
                            <div class="stat-icon">${createIcon('calendar').outerHTML}</div>
                        </div>
                        <div class="stat-number">${myEvents.length}</div>
                        <div class="stat-change positive">+1 this month</div>
                    </div>

                    <div class="dashboard-stat">
                        <div class="stat-header">
                            <div class="stat-title">Total Participants</div>
                            <div class="stat-icon">${createIcon('users').outerHTML}</div>
                        </div>
                        <div class="stat-number">${formatNumber(totalParticipants)}</div>
                        <div class="stat-change positive">+423 this month</div>
                    </div>

                    <div class="dashboard-stat">
                        <div class="stat-header">
                            <div class="stat-title">Total Revenue</div>
                            <div class="stat-icon">${createIcon('dollarSign').outerHTML}</div>
                        </div>
                        <div class="stat-number">$${formatNumber(totalRevenue)}</div>
                        <div class="stat-change positive">+15% vs last month</div>
                    </div>

                    <div class="dashboard-stat">
                        <div class="stat-header">
                            <div class="stat-title">Avg. Rating</div>
                            <div class="stat-icon">${createIcon('trendingUp').outerHTML}</div>
                        </div>
                        <div class="stat-number">4.8</div>
                        <div class="stat-change">⭐⭐⭐⭐⭐</div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="tabs" id="organizerTabs">
                    <div class="tabs-list">
                        <button class="tab-trigger active" data-tab="events" onclick="switchTab('organizerTabs', 'events')">My Events</button>
                        <button class="tab-trigger" data-tab="participants" onclick="switchTab('organizerTabs', 'participants')">Participants</button>
                        <button class="tab-trigger" data-tab="volunteers" onclick="switchTab('organizerTabs', 'volunteers')">Volunteers</button>
                        <button class="tab-trigger" data-tab="analytics" onclick="switchTab('organizerTabs', 'analytics')">Analytics</button>
                        <button class="tab-trigger" data-tab="settings" onclick="switchTab('organizerTabs', 'settings')">Settings</button>
                    </div>

                    <!-- Events Tab -->
                    <div class="tab-content active" id="events">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">Event Management</div>
                                <div class="card-description">View and manage all your events</div>
                            </div>
                            <div class="card-content">
                                <div style="display: flex; flex-direction: column; gap: 1rem;">
                                    ${myEvents.map(event => `
                                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg transition hover:bg-gray-100">
                                            <div class="flex items-center gap-4">
                                                <img src="${event.imageUrl}" alt="${event.title}" style="width: 80px; height: 80px; border-radius: var(--radius-md); object-fit: cover;">
                                                <div>
                                                    <h4 class="font-semibold text-lg mb-1">${event.title}</h4>
                                                    <div class="flex items-center gap-3 text-sm text-gray-600">
                                                        <span class="flex items-center gap-1">
                                                            ${createIcon('calendar').outerHTML}
                                                            ${formatDateShort(event.date)}
                                                        </span>
                                                        <span class="flex items-center gap-1">
                                                            ${createIcon('users').outerHTML}
                                                            ${event.participants}/${event.maxParticipants}
                                                        </span>
                                                        <span class="flex items-center gap-1">
                                                            ${createIcon('dollarSign').outerHTML}
                                                            $${formatNumber(event.participants * event.price)}
                                                        </span>
                                                    </div>
                                                    <div class="mt-2">
                                                        <span class="badge ${getStatusBadgeClass(event.status)}">
                                                            ${event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex gap-2">
                                                <button class="btn btn-outline btn-sm" onclick="navigateTo('event-details', '${event.id}')">
                                                    ${createIcon('eye').outerHTML}
                                                    View
                                                </button>
                                                <button class="btn btn-outline btn-sm">
                                                    ${createIcon('edit').outerHTML}
                                                    Edit
                                                </button>
                                                <button class="btn btn-outline btn-sm">
                                                    ${createIcon('download').outerHTML}
                                                    Export
                                                </button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Participants Tab -->
                    <div class="tab-content" id="participants">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">Participant Management</div>
                                <div class="card-description">View and manage event registrations</div>
                            </div>
                            <div class="card-content">
                                <div style="display: flex; flex-direction: column; gap: 1rem;">
                                    ${[
                                        { name: 'John Smith', event: 'City Marathon 2026', bib: 'A1042', status: 'confirmed', checkedIn: true },
                                        { name: 'Sarah Johnson', event: 'City Marathon 2026', bib: 'A1043', status: 'confirmed', checkedIn: true },
                                        { name: 'Mike Chen', event: 'Mountain Trail Challenge', bib: 'B2015', status: 'confirmed', checkedIn: false },
                                        { name: 'Emma Wilson', event: 'Mountain Trail Challenge', bib: 'B2016', status: 'pending', checkedIn: false },
                                        { name: 'David Martinez', event: 'Coastal Triathlon Series', bib: 'C0789', status: 'confirmed', checkedIn: false }
                                    ].map(participant => `
                                        <div class="flex items-center justify-between p-4 border rounded-lg">
                                            <div class="flex items-center gap-4">
                                                <div style="width: 48px; height: 48px; background: #dbeafe; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; color: var(--primary-blue);">
                                                    ${createIcon('user').outerHTML}
                                                </div>
                                                <div>
                                                    <h4 class="font-semibold">${participant.name}</h4>
                                                    <p class="text-sm text-gray-600">${participant.event}</p>
                                                    <p class="text-xs text-gray-500">Bib: ${participant.bib}</p>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-3">
                                                <span class="badge ${participant.status === 'confirmed' ? 'badge-success' : 'badge-warning'}">
                                                    ${participant.status}
                                                </span>
                                                ${participant.checkedIn ? `
                                                    <span class="badge" style="background: #dbeafe; color: var(--primary-blue);">
                                                        ${createIcon('checkCircle').outerHTML}
                                                        Checked In
                                                    </span>
                                                ` : `
                                                    <span class="badge badge-outline">
                                                        ${createIcon('clock').outerHTML}
                                                        Not Checked In
                                                    </span>
                                                `}
                                                <button class="btn btn-outline btn-sm">View Details</button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Volunteers Tab -->
<div class="tab-content" id="volunteers">
    <div class="card">
        <div class="card-header">
            <div class="card-title">Volunteer Management</div>
            <div class="card-description">
                View and manage event volunteers
            </div>
        </div>

        <div class="card-content">
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${volunteers.map(volunteer => `
                    <div class="flex items-center justify-between p-4 border rounded-lg">
                        <div class="flex items-center gap-4">
                            <div style="width: 48px; height: 48px; background: #dcfce7; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; color: var(--success-green);">
                                ${createIcon('user').outerHTML}
                            </div>
                            <div>
                                <h4 class="font-semibold">${volunteer.name}</h4>
                                <p class="text-sm text-gray-600">${volunteer.role}</p>
                                <p class="text-xs text-gray-500">Event: ${volunteer.event}</p>
                            </div>
                        </div>

                        <span class="badge ${volunteer.status === 'active' ? 'badge-success' : 'badge-warning'}">
                            ${volunteer.status}
                        </span>
                    </div>
                `).join("")}
            </div>
        </div>
    </div>
</div>


                    <!-- Analytics Tab -->
                    <div class="tab-content" id="analytics">
                        <div class="grid grid-lg-2 gap-6 mb-6">
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title flex items-center gap-2">
                                        ${createIcon('barChart').outerHTML}
                                        Registration Trends
                                    </div>
                                </div>
                                <div class="card-content">
                                    <div style="height: 256px; display: flex; align-items: center; justify-content: center; background: var(--gray-50); border-radius: var(--radius-lg);">
                                        <p class="text-gray-500">Registration chart visualization</p>
                                    </div>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title flex items-center gap-2">
                                        ${createIcon('dollarSign').outerHTML}
                                        Revenue Breakdown
                                    </div>
                                </div>
                                <div class="card-content">
                                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                                        ${myEvents.map(event => `
                                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p class="font-medium">${event.title}</p>
                                                    <p class="text-sm text-gray-600">${event.participants} registrations</p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="font-bold" style="color: var(--success-green);">
                                                        $${formatNumber(event.participants * event.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">Key Metrics</div>
                            </div>
                            <div class="card-content">
                                <div class="grid grid-md-3 gap-6">
                                    <div class="metric-card blue">
                                        <div class="metric-icon blue">${createIcon('trendingUp').outerHTML}</div>
                                        <div class="metric-value blue">87%</div>
                                        <div class="metric-label">Avg. Capacity Filled</div>
                                    </div>
                                    <div class="metric-card green">
                                        <div class="metric-icon green">${createIcon('award').outerHTML}</div>
                                        <div class="metric-value green">4.8</div>
                                        <div class="metric-label">Participant Satisfaction</div>
                                    </div>
                                    <div class="metric-card purple">
                                        <div class="metric-icon purple">${createIcon('checkCircle').outerHTML}</div>
                                        <div class="metric-value purple">92%</div>
                                        <div class="metric-label">On-time Check-in Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Settings Tab -->
                    <div class="tab-content" id="settings">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title flex items-center gap-2">
                                    ${createIcon('settings').outerHTML}
                                    Organizer Settings
                                </div>
                                <div class="card-description">Manage your account and preferences</div>
                            </div>
                            <div class="card-content">
                                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                                    <div>
                                        <label class="label">Organization Name</label>
                                        <input type="text" class="input" value="NYC Running Club">
                                    </div>
                                    <div>
                                        <label class="label">Contact Email</label>
                                        <input type="email" class="input" value="contact@nycrunning.com">
                                    </div>
                                    <div>
                                        <label class="label">Phone Number</label>
                                        <input type="tel" class="input" value="+1 234 567 8900">
                                    </div>
                                    <div>
                                        <label class="label">Website</label>
                                        <input type="url" class="input" value="https://nycrunning.com">
                                    </div>
                                    <button class="btn btn-primary">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- LOGOUT BUTTON -->
                <div style="text-align:center;margin-top:40px;padding:20px 0">
                    <button class="btn btn-outline" id="organizerDashboardLogoutBtn">Logout</button>
                </div>
            </div>
        </div>

        <!-- Create Event Modal -->
        <div id="createEventModal" class="modal-overlay hidden" onclick="hideCreateEventModal(event)">
            <div class="modal" style="max-width: 600px;" onclick="event.stopPropagation();">
                <div class="modal-header">
                    <div class="modal-title">Create New Event</div>
                    <div class="modal-description">Fill in the details to create a new athletics event</div>
                </div>
                <div class="modal-content" style="max-height: 60vh; overflow-y: auto;">
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div class="grid grid-md-2 gap-4">
                            <div>
                                <label class="label">Event Title</label>
                                <input type="text" class="input" placeholder="City Marathon 2026">
                            </div>
                            <div>
                                <label class="label">Event Date</label>
                                <input type="date" class="input">
                            </div>
                        </div>
                        <div>
                            <label class="label">Location</label>
                            <input type="text" class="input" placeholder="New York, USA">
                        </div>
                        <div class="grid grid-md-2 gap-4">
                            <div>
                                <label class="label">Category</label>
                                <select class="select">
                                    <option>Marathon</option>
                                    <option>Running</option>
                                    <option>Triathlon</option>
                                    <option>Cycling</option>
                                    <option>Trail Running</option>
                                </select>
                            </div>
                            <div>
                                <label class="label">Distance</label>
                                <input type="text" class="input" placeholder="42.2 km">
                            </div>
                        </div>
                        <div class="grid grid-md-2 gap-4">
                            <div>
                                <label class="label">Max Participants</label>
                                <input type="number" class="input" placeholder="5000">
                            </div>
                            <div>
                                <label class="label">Registration Fee (USD)</label>
                                <input type="number" class="input" placeholder="75">
                            </div>
                        </div>
                        <div>
                            <label class="label">Description</label>
                            <textarea class="textarea" rows="4" placeholder="Describe your event..."></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="hideCreateEventModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="createEvent()">Create Event</button>
                </div>
            </div>
        </div>
    `;
    
    window.showCreateEventModal = function() {
        document.getElementById('createEventModal').classList.remove('hidden');
    };
    
    window.hideCreateEventModal = function(event) {
        if (!event || event.target.classList.contains('modal-overlay')) {
            document.getElementById('createEventModal').classList.add('hidden');
        }
    };
    
    window.createEvent = function() {
        alert('Event created successfully!');
        document.getElementById('createEventModal').classList.add('hidden');
    };

    // Logout button handler
    const logoutBtn = container.querySelector("#organizerDashboardLogoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem("currentUser");
            navigateTo("landing");
        };
    }
}

/* ================= EXPORT ================= */

export { renderOrganizerDashboard };



//backend
