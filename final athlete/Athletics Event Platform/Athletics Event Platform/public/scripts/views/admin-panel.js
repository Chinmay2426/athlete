// admin-panel.js

import { createIcon, formatNumber, formatDateShort } from "../utils.js";
import { mockEvents } from "../data.js";


// 🔐 Make functions global (for onclick)
window.approveOrganization = approveOrganization;
window.rejectOrganization = rejectOrganization;



// Mock organizers
let organizers = [
    { id: 1, name: "NYC Running Club", email: "info@nycrunning.com", status: "pending" },
    { id: 2, name: "Pacific Tri Club", email: "contact@pactri.com", status: "pending" }
];

function approveOrganization(id) {
    const org = organizers.find(o => o.id === id);
    if (org) {
        org.status = "approved";
        renderAdminPanel(document.getElementById("app"));
    }
}

function rejectOrganization(id) {
    const org = organizers.find(o => o.id === id);
    if (org) {
        org.status = "rejected";
        renderAdminPanel(document.getElementById("app"));
    }
}
async function loadPendingEvents() {
    try {
        const res = await fetch("http://127.0.0.1:8000/api/pending-events/");
        if (!res.ok) throw new Error("Failed to load events");
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}



// async function approveEvent(id) {
//     await fetch(`http://127.0.0.1:8000/api/events/${id}/approve/`, {
//         method: "POST"
//     });
//     renderAdminPanel(document.getElementById("app"));
// }
async function approveEvent(id) {
    await fetch(`http://127.0.0.1:8000/api/events/${id}/approve/`, {
        method: "POST"
    });

    // Refresh admin panel
    renderAdminPanel(document.getElementById("app"));

    // Redirect to user events page
    if (window.navigateTo) {
        // your navigation function
        navigateTo('events'); // pass 'events' as page identifier
    } else {
        // fallback: reload page
        window.location.href = '/events.html'; 
    }
}



async function rejectEvent(id) {
    await fetch(`http://127.0.0.1:8000/api/events/${id}/reject/`, {
        method: "POST"
    });
    renderAdminPanel(document.getElementById("app"));
}

window.approveEvent = approveEvent;
window.rejectEvent = rejectEvent;
window.openEventApprovals = async function () {
    await renderAdminPanel(document.getElementById("app"));
    switchTab('adminTabs', 'events');
};


// ✅ EXPORT FUNCTION
export async function renderAdminPanel(container) {
    const pendingEvents = await loadPendingEvents();

        const approvedEvents = await fetch("/api/approved-events/")
        .then(res => res.json())
        .catch(err => {
            console.error("Failed to fetch approved events:", err);
            return [];
        });
    const platformStats = {
        totalUsers: 52847,
        totalEvents: 1247,
        totalRevenue: 4235890,
        activeEvents: 156,
        pendingApprovals: 23,
        systemHealth: 99.8
    };

     container.innerHTML = `
        <div class="bg-gray-50" style="min-height: 100vh; padding: 2rem 0;">
            <div class="container">
                <!-- Header -->
                <div class="mb-8">
                    <div class="flex items-center gap-3 mb-2">
                        <div style="width: 40px; height: 40px; color: var(--primary-blue);">
                            ${createIcon('shield').outerHTML}
                        </div>
                        <h1 class="text-4xl font-bold">Admin Panel</h1>
                    </div>
                    <p class="text-xl text-gray-600">Platform-wide management and monitoring</p>
                </div>

                <!-- Stats Overview -->
                <div class="grid grid-md-2 grid-lg-4 gap-6 mb-8">
                    <div class="dashboard-stat">
                        <div class="stat-header">
                            <div class="stat-title">Total Users</div>
                            <div class="stat-icon">${createIcon('users').outerHTML}</div>
                        </div>
                        <div class="stat-number">${formatNumber(platformStats.totalUsers)}</div>
                        <div class="stat-change positive">+2,847 this month</div>
                    </div>

                    <div class="dashboard-stat">
                        <div class="stat-header">
                            <div class="stat-title">Platform Events</div>
                            <div class="stat-icon">${createIcon('calendar').outerHTML}</div>
                        </div>
                        <div class="stat-number">${formatNumber(platformStats.totalEvents)}</div>
                        <div class="stat-change positive">+156 active now</div>
                    </div>

                    <div class="dashboard-stat">
                        <div class="stat-header">
                            <div class="stat-title">Total Revenue</div>
                            <div class="stat-icon">${createIcon('dollarSign').outerHTML}</div>
                        </div>
                        <div class="stat-number">$${(platformStats.totalRevenue / 1000000).toFixed(2)}M</div>
                        <div class="stat-change positive">+18% vs last month</div>
                    </div>

                    <div class="dashboard-stat">
                        <div class="stat-header">
                            <div class="stat-title">System Health</div>
                            <div class="stat-icon">${createIcon('activity').outerHTML}</div>
                        </div>
                        <div class="stat-number">${platformStats.systemHealth}%</div>
                        <div class="stat-change positive">All systems operational</div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="tabs" id="adminTabs">
                    <div class="tabs-list">
                        <button class="tab-trigger active" data-tab="overview" onclick="switchTab('adminTabs', 'overview')">Overview</button>
                        <button class="tab-trigger" data-tab="users" onclick="switchTab('adminTabs', 'users')">User Management</button>
                        <button class="tab-trigger" data-tab="organizations" onclick="switchTab('adminTabs', 'organizations')">Organization Approvals</button>
                       <button class="tab-trigger" data-tab="events" onclick="openEventApprovals()">Event Approvals</button>
                       <button class="tab-trigger" data-tab="reports" onclick="switchTab('adminTabs', 'reports')">Reports</button>
                        <button class="tab-trigger" data-tab="system" onclick="switchTab('adminTabs', 'system')">System Monitor</button>
                    </div>

                    <!-- Overview Tab -->
                    <div class="tab-content active" id="overview">
                        <div class="grid grid-lg-2 gap-6 mb-6">
                            <!-- Pending Actions -->
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title">Pending Actions</div>
                                    <div class="card-description">Items requiring your attention</div>
                                </div>
                                <div class="card-content">
                                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                        <div class="flex items-center justify-between p-3 rounded-lg" style="background: #fef3c7; border: 1px solid #fde68a;">
                                            <div class="flex items-center gap-3">
                                                ${createIcon('alertTriangle').outerHTML}
                                                <div>
                                                    <p class="font-medium">Event Approvals Pending</p>
                                                    <p class="text-sm text-gray-600">23 events awaiting review</p>
                                                </div>
                                            </div>
                                            <button class="btn btn-outline btn-sm">Review</button>
                                        </div>

                                        <div class="flex items-center justify-between p-3 rounded-lg" style="background: #dbeafe; border: 1px solid #bfdbfe;">
                                            <div class="flex items-center gap-3">
                                                ${createIcon('users').outerHTML}
                                                <div>
                                                    <p class="font-medium">User Reports</p>
                                                    <p class="text-sm text-gray-600">8 support tickets open</p>
                                                </div>
                                            </div>
                                            <button class="btn btn-outline btn-sm">View</button>
                                        </div>

                                        <div class="flex items-center justify-between p-3 rounded-lg" style="background: #dcfce7; border: 1px solid #bbf7d0;">
                                            <div class="flex items-center gap-3">
                                                ${createIcon('checkCircle').outerHTML}
                                                <div>
                                                    <p class="font-medium">System Updates</p>
                                                    <p class="text-sm text-gray-600">All systems running smoothly</p>
                                                </div>
                                            </div>
                                            <button class="btn btn-outline btn-sm">Details</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Recent Activity -->
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title">Recent Activity</div>
                                    <div class="card-description">Latest platform activities</div>
                                </div>
                                <div class="card-content">
                                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                                        ${[
                                            { action: 'New event created', user: 'NYC Running Club', time: '5 min ago', type: 'event' },
                                            { action: 'User registration', user: 'john.doe@email.com', time: '12 min ago', type: 'user' },
                                            { action: 'Event approved', user: 'Mountain Sports Assoc.', time: '23 min ago', type: 'approval' },
                                            { action: 'Payment processed', user: 'Event #1247', time: '1 hour ago', type: 'payment' },
                                            { action: 'Support ticket resolved', user: 'Ticket #8842', time: '2 hours ago', type: 'support' }
                                        ].map(activity => `
                                            <div class="flex items-center gap-3 text-sm">
                                                <div class="activity-dot ${activity.type}"></div>
                                                <div style="flex: 1;">
                                                    <p class="font-medium">${activity.action}</p>
                                                    <p class="text-xs text-gray-500">${activity.user}</p>
                                                </div>
                                                <span class="text-xs text-gray-400">${activity.time}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Platform Analytics -->
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">Platform Analytics</div>
                            </div>
                            <div class="card-content">
                                <div class="grid grid-md-3 gap-6">
                                    <div class="metric-card blue">
                                        <div class="metric-icon blue">${createIcon('globe').outerHTML}</div>
                                        <div class="metric-value blue">45+</div>
                                        <div class="metric-label">Countries</div>
                                    </div>
                                    <div class="metric-card green">
                                        <div class="metric-icon green">${createIcon('trendingUp').outerHTML}</div>
                                        <div class="metric-value green">892K</div>
                                        <div class="metric-label">Total Participants</div>
                                    </div>
                                    <div class="metric-card purple">
                                        <div class="metric-icon purple">${createIcon('activity').outerHTML}</div>
                                        <div class="metric-value purple">24/7</div>
                                        <div class="metric-label">Uptime</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- User Management Tab -->
                    <div class="tab-content" id="users">
                        <div class="card">
                            <div class="card-header">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="card-title">User Management</div>
                                        <div class="card-description">Manage platform users and roles</div>
                                    </div>
                                    <div class="search-container" style="width: 256px;">
                                        <div class="search-icon">${createIcon('search').outerHTML}</div>
                                        <input type="text" class="search-input" placeholder="Search users...">
                                    </div>
                                </div>
                            </div>
                            <div class="card-content">
                                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                    ${[
                                        { name: 'Sarah Johnson', email: 'sarah.j@email.com', role: 'Athlete', joined: '2025-03-15', status: 'active' },
                                        { name: 'NYC Running Club', email: 'info@nycrunning.com', role: 'Organizer', joined: '2024-11-20', status: 'active' },
                                        { name: 'Mike Chen', email: 'mike.c@email.com', role: 'Athlete', joined: '2025-01-08', status: 'active' },
                                        { name: 'Emma Wilson', email: 'emma.w@email.com', role: 'Athlete', joined: '2025-02-14', status: 'suspended' },
                                        { name: 'Pacific Tri Club', email: 'contact@pactri.com', role: 'Organizer', joined: '2024-09-30', status: 'active' }
                                    ].map(user => `
                                        <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                            <div class="flex items-center gap-4">
                                                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, var(--primary-blue), var(--primary-purple)); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">
                                                    ${user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 class="font-semibold">${user.name}</h4>
                                                    <p class="text-sm text-gray-600">${user.email}</p>
                                                    <div class="flex items-center gap-2 mt-1">
                                                        <span class="badge badge-outline">${user.role}</span>
                                                        <span class="badge ${user.status === 'active' ? 'badge-success' : 'badge-danger'}">
                                                            ${user.status}
                                                        </span>
                                                        <span class="text-xs text-gray-500">Joined ${user.joined}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button class="btn btn-ghost btn-icon">
                                                ${createIcon('moreVertical').outerHTML}
                                            </button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Organization Approvals Tab -->
<div class="tab-content" id="organizations">
    <div class="card">
        <div class="card-header">
            <div class="card-title">Organization Approvals</div>
            <div class="card-description">
                Approve or reject organizer accounts
            </div>
        </div>

        <div class="card-content">
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${organizers
                    .filter(org => org.status === "pending")
                    .map(org => `
                        <div class="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 class="font-semibold">${org.name}</h4>
                                <p class="text-sm text-gray-600">${org.email}</p>
                                <span class="badge badge-warning">pending</span>
                            </div>
                            <div class="flex gap-2">
                                <button class="btn btn-outline btn-sm"
                                    style="color: var(--success-green); border-color: var(--success-green);"
                                    onclick="approveOrganization(${org.id})">
                                    Approve
                                </button>
                                <button class="btn btn-outline btn-sm"
                                    style="color: var(--danger-red); border-color: var(--danger-red);"
                                    onclick="rejectOrganization(${org.id})">
                                    Reject
                                </button>
                            </div>
                        </div>
                `).join("")}
            </div>
        </div>
    </div>
</div>


                    <!-- Event Approvals Tab -->
<div class="tab-content" id="events">
    <div class="card">
        <div class="card-header">
            <div class="card-title">Event Approval Queue</div>
            <div class="card-description">Review and approve pending events</div>
        </div>

        <div class="card-content">
            <div style="display:flex; flex-direction:column; gap:1rem;">
                ${pendingEvents.length === 0
                    ? `<p class="text-gray-500">No pending events</p>`
                    : pendingEvents.map(event => `
                        <div class="flex items-center justify-between p-4 border rounded-lg">
                            <div class="flex items-center gap-4">
                                <img 
                                    src="${event.imageUrl}" 
                                    alt="${event.title}"
                                    style="width:80px;height:80px;border-radius:8px;object-fit:cover;"
                                >
                                <div>
                                    <h4 class="font-semibold">${event.title}</h4>
                                    <p class="text-sm text-gray-600">${event.organizer}</p>
                                    <div class="flex gap-3 text-sm mt-2">
                                        <span>${formatDateShort(event.date)}</span>
                                        <span>Max ${event.maxParticipants}</span>
                                        <span>${event.price} ${event.currency}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex gap-2">
                            <button onclick="approveEvent(${event.id})" class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg
                            hover:bg-green-700 active:scale-95 transition">
                                Approve
                            </button>

                            <button onclick="rejectEvent(${event.id})" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg
                            hover:bg-red-700 active:scale-95 transition">
                                Reject
                            </button>
                    </div>

                        </div>
                    `).join("")}
            </div>
        </div>
    </div>
</div>

                    <!-- Reports Tab -->
                    <div class="tab-content" id="reports">
                        <div class="grid grid-lg-2 gap-6 mb-6">
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title">Revenue Reports</div>
                                </div>
                                <div class="card-content">
                                    <div style="height: 256px; display: flex; align-items: center; justify-content: center; background: var(--gray-50); border-radius: var(--radius-lg);">
                                        <p class="text-gray-500">Revenue chart visualization</p>
                                    </div>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title">User Growth</div>
                                </div>
                                <div class="card-content">
                                    <div style="height: 256px; display: flex; align-items: center; justify-content: center; background: var(--gray-50); border-radius: var(--radius-lg);">
                                        <p class="text-gray-500">User growth chart visualization</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">Top Performing Events</div>
                            </div>
                            <div class="card-content">
                                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                    ${mockEvents.slice(0, 5).map((event, idx) => `
                                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div class="flex items-center gap-3">
                                                <div style="width: 32px; height: 32px; background: var(--primary-blue); color: white; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-weight: 700;">
                                                    #${idx + 1}
                                                </div>
                                                <div>
                                                    <p class="font-medium">${event.title}</p>
                                                    <p class="text-sm text-gray-600">${event.participants} participants</p>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <p class="font-bold" style="color: var(--success-green);">$${formatNumber(event.participants * event.price)}</p>
                                                <p class="text-xs text-gray-500">Revenue</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- System Monitor Tab -->
                    <div class="tab-content" id="system">
                        <div class="grid grid-lg-2 gap-6">
                            <!-- Server Status -->
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title flex items-center gap-2">
                                        ${createIcon('server').outerHTML}
                                        Server Status
                                    </div>
                                </div>
                                <div class="card-content">
                                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                                        ${[
                                            { name: 'API Server', status: 'operational', uptime: '99.9%', load: '45%' },
                                            { name: 'Database', status: 'operational', uptime: '99.8%', load: '38%' },
                                            { name: 'Storage', status: 'operational', uptime: '100%', load: '62%' },
                                            { name: 'CDN', status: 'operational', uptime: '99.9%', load: '52%' }
                                        ].map(server => `
                                            <div class="server-status">
                                                <div class="flex items-center gap-3">
                                                    <div class="status-dot"></div>
                                                    <div>
                                                        <p class="font-medium">${server.name}</p>
                                                        <p class="text-sm text-gray-600">Uptime: ${server.uptime}</p>
                                                    </div>
                                                </div>
                                                <div class="text-right">
                                                    <span class="badge badge-success">${server.status}</span>
                                                    <p class="text-xs text-gray-500 mt-1">Load: ${server.load}</p>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>

                            <!-- Database Metrics -->
                            <div class="card">
                                <div class="card-header">
                                    <div class="card-title flex items-center gap-2">
                                        ${createIcon('database').outerHTML}
                                        Database Metrics
                                    </div>
                                </div>
                                <div class="card-content">
                                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                                        <div>
                                            <div class="flex justify-between mb-2">
                                                <span class="text-sm font-medium">Storage Used</span>
                                                <span class="text-sm text-gray-600">487 GB / 1 TB</span>
                                            </div>
                                            <div class="progress">
                                                <div class="progress-bar" style="width: 48.7%;"></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div class="flex justify-between mb-2">
                                                <span class="text-sm font-medium">Query Performance</span>
                                                <span class="text-sm text-gray-600">Excellent</span>
                                            </div>
                                            <div class="progress">
                                                <div class="progress-bar" style="width: 92%; background: var(--success-green);"></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div class="flex justify-between mb-2">
                                                <span class="text-sm font-medium">Active Connections</span>
                                                <span class="text-sm text-gray-600">142 / 500</span>
                                            </div>
                                            <div class="progress">
                                                <div class="progress-bar" style="width: 28.4%; background: var(--warning-yellow);"></div>
                                            </div>
                                        </div>

                                        <div style="padding-top: 1rem; border-top: 1px solid var(--gray-200);">
                                            <h4 class="font-medium mb-3">Recent Backups</h4>
                                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                                <div class="flex items-center justify-between text-sm">
                                                    <span class="flex items-center gap-2">
                                                        ${createIcon('checkCircle').outerHTML}
                                                        Full Backup
                                                    </span>
                                                    <span class="text-gray-500">2 hours ago</span>
                                                </div>
                                                <div class="flex items-center justify-between text-sm">
                                                    <span class="flex items-center gap-2">
                                                        ${createIcon('checkCircle').outerHTML}
                                                        Incremental Backup
                                                    </span>
                                                    <span class="text-gray-500">30 min ago</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
