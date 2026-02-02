// Organizer Dashboard View
import { createIcon } from "../utils.js";
import { getRegistrations } from "../storage.js";

// Helper functions
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDateShort(date) {
    return new Date(date).toLocaleDateString();
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'active': return 'badge-success';
        case 'upcoming': return 'badge-warning';
        case 'completed': return 'badge-outline';
        default: return 'badge-outline';
    }
}

// Fetch approved events from backend
async function loadApprovedOrganizerEvents() {
    try {
        const res = await fetch("http://127.0.0.1:8000/api/approved-events/");
        if (!res.ok) throw new Error("Failed to fetch approved events");
        const events = await res.json();
        return events;
    } catch (err) {
        console.error("Error loading approved events:", err);
        return [];
    }
}

// Fetch registrations from backend or fallback to localStorage
async function fetchOrganizerRegistrations() {
    try {
        const response = await fetch('/api/organizer/registrations/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json();
        }
    } catch (err) {
        console.log("Backend not available, fetching from localStorage");
    }
    return getRegistrations();
}


async function displayRegistrations(container, registrations) {
    const participantsContainer = container.querySelector('#participantsContainer');
    if (!registrations || registrations.length === 0) {
        participantsContainer.innerHTML = `<div class="text-center py-8"><p class="text-gray-600">No registrations yet</p></div>`;
        return;
    }

    const grouped = groupRegistrationsByEvent(registrations);

    participantsContainer.innerHTML = Object.entries(grouped).map(([eventName, participants]) => {
    const maleCount = participants.filter(p => (p.gender || '').toLowerCase() === 'male').length;
    const femaleCount = participants.filter(p => (p.gender || '').toLowerCase() === 'female').length;

    // Calculate revenue for this event
    const revenue = participants.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    // Initial registered count = number of participants already registered
    const registeredCount = participants.length;

    return `
    <div class="event-group mb-4 p-3 border rounded-lg bg-gray-50 flex flex-col gap-2" 
         data-event="${eventName}" 
         data-participants='${JSON.stringify(participants)}'
         data-registered="${registeredCount}">

        <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">${eventName}</h3>

            <div class="flex items-center gap-2">
                <!-- Small View Participants Button -->
                <button class="btn btn-outline btn-xs" onclick='viewEventRegistrations("${eventName}")'>
                    👁️ View
                </button>

                <!-- Register Button with initial count and label -->
                <button class="btn btn-sm btn-green" onclick='registerForEvent(this, "${eventName}")'>
                    ${registeredCount} Register 
                </button>
            </div>
        </div>

        <div class="flex gap-2 mt-2">
            <button class="btn btn-sm btn-blue flex items-center gap-1">
                👨 Male: ${maleCount}
            </button>
            <button class="btn btn-sm btn-pink flex items-center gap-1">
                👩 Female: ${femaleCount}
            </button>
        </div>

        <!-- Revenue Display -->
        <div class="mt-2 text-sm font-medium">
            Revenue: $${revenue.toFixed(2)}
        </div>

        <div class="event-details hidden mt-3"></div>
    </div>`;
}).join('');

// Function to handle registration and update count
function registerForEvent(button, eventName) {
    const eventDiv = button.closest('.event-group');
    let count = parseInt(eventDiv.dataset.registered) || 0;
    count++;
    eventDiv.dataset.registered = count;
    button.innerText = `Register (${count})`; // show label + count
}
}

window.viewEventDetails = function(event) {
    const modal = document.getElementById('eventDetailsModal');
    if (!modal) return;

    const content = modal.querySelector('.modal-content');
    content.innerHTML = `
        <h3 class="text-xl font-bold mb-4">${event.title}</h3>
        <div class="grid grid-cols-2 gap-4">
            <div><strong>Date:</strong> ${formatDateShort(event.date)}</div>
            <div><strong>Max Participants:</strong> ${event.maxParticipants}</div>
            <div><strong>Price:</strong> $${event.price}</div>
            <div><strong>Registrations:</strong> ${event.participants || 0}</div>
        </div>
        <p class="mt-4">${event.description || "No description available"}</p>
        <div class="mt-6 text-right">
            <button class="btn btn-primary" onclick="closeEventDetailsModal()">Close</button>
        </div>
    `;
    modal.classList.remove('hidden');
};

window.closeEventDetailsModal = function(event) {
    if (!event || event.target.classList.contains('modal-overlay')) {
        document.getElementById('eventDetailsModal').classList.add('hidden');
    }
};

window.viewRegistrationDetails = function(reg) {
    const modal = document.getElementById('registrationDetailsModal');
    if (!modal) return;

    const content = modal.querySelector('.modal-content');
    content.innerHTML = `
        <span class="modal-close absolute top-2 right-3 cursor-pointer text-gray-500 text-xl">&times;</span>
        <h3 class="text-xl font-bold mb-4">Participant Details</h3>
        <div class="grid grid-cols-2 gap-4">
            <div><strong>Name:</strong> ${reg.firstName || reg.first_name || ''} ${reg.lastName || reg.last_name || ''}</div>
            <div><strong>Event:</strong> ${reg.eventName || reg.event_name || 'Unknown'}</div>
            <div><strong>Email:</strong> ${reg.email || ''}</div>
            <div><strong>Mobile:</strong> ${reg.mobile || ''}</div>
            <div><strong>Gender:</strong> ${reg.gender || ''}</div>
            <div><strong>Registered At:</strong> ${formatDateShort(reg.registeredAt || new Date().toISOString())}</div>
            ${reg.amount ? `<div><strong>Amount Paid:</strong> $${reg.amount}</div>` : ''}
            ${reg.emergencyContact || reg.emergency_contact ? `<div><strong>Emergency Contact:</strong> ${reg.emergencyContact || reg.emergency_contact}</div>` : ''}
            ${reg.medicalCondition || reg.medical_condition ? `<div class="col-span-2 text-orange-600"><strong>Medical Condition:</strong> ${reg.medicalCondition || reg.medical_condition}</div>` : ''}
        </div>
    `;

    // Close button inside modal
    content.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.classList.remove('hidden');
};




window.viewEventRegistrations = function(eventName) {
    const eventGroup = document.querySelector(`.event-group[data-event="${eventName}"]`);
    if (!eventGroup) return;

    const detailsContainer = eventGroup.querySelector('.event-details');
    
    // Toggle visibility
    if (!detailsContainer.classList.contains('hidden')) {
        detailsContainer.classList.add('hidden');
        return;
    }

    const participants = JSON.parse(eventGroup.dataset.participants || '[]');

    const participantHtml = participants.map(reg => {
        const firstName = reg.firstName || reg.first_name || '';
        const lastName = reg.lastName || reg.last_name || '';
        const email = reg.email || '';
        const mobile = reg.mobile || '';
        const gender = reg.gender || '';
        const amount = reg.amount || '';
        const medicalCondition = reg.medicalCondition || reg.medical_condition || '';
        const emergencyContact = reg.emergencyContact || reg.emergency_contact || '';
        const registeredAt = formatDateShort(reg.registeredAt || new Date().toISOString());

        return `
            <div class="flex items-center justify-between p-3 border rounded hover:bg-gray-50 mb-2">
                <div>
                    <h4 class="font-semibold">${firstName} ${lastName}</h4>
                    <p class="text-xs text-gray-500">Email: ${email} | Phone: ${mobile}</p>
                    ${medicalCondition ? `<p class="text-xs text-orange-600">⚠️ Medical: ${medicalCondition}</p>` : ''}
                </div>
                <div class="flex flex-col items-end gap-1">
                    <p class="text-sm font-semibold text-gray-700">Gender: ${gender}</p>
                    ${amount ? `<p class="text-sm font-semibold text-green-600">Amount: $${amount}</p>` : ''}
                    <p class="text-xs text-gray-500">${registeredAt}</p>
                    <button class="btn btn-outline btn-sm" onclick='viewRegistrationDetails(${JSON.stringify(reg)})'>
                        ${createIcon('eye').outerHTML} Details
                    </button>

                </div>
            </div>
        `;
    }).join('');

    detailsContainer.innerHTML = `<h4 class="font-semibold mb-2">Participants for ${eventName}</h4>${participantHtml}`;
    detailsContainer.classList.remove('hidden');
};


function groupRegistrationsByEvent(registrations) {
    const grouped = {};
    registrations.forEach(r => {
        const eventName = r.eventName || r.event_name || 'Unknown Event';
        if (!grouped[eventName]) grouped[eventName] = [];
        grouped[eventName].push(r);
    });
    return grouped;
}


function renderAnalyticsBarChart(registrationsByEvent, revenueByEvent) {
    const ctx = document.getElementById('analyticsBarChart');
    if (!ctx) return;

    const eventNames = Object.keys(registrationsByEvent);
    const registrationsData = eventNames.map(e => registrationsByEvent[e] || 0);
    const revenueData = eventNames.map(e => revenueByEvent[e] || 0);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: eventNames, // X-axis (event names)
            datasets: [
                {
                    label: 'Users Registered',
                    data: registrationsData,
                    backgroundColor: '#3b82f6'
                },
                {
                    label: 'Revenue ($)',
                    data: revenueData,
                    backgroundColor: '#22c55e'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) =>
                            `${ctx.dataset.label}: ${ctx.raw}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Users / Revenue'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Events'
                    }
                }
            }
        }
    });
}


// Render Organizer Dashboard with full metrics, volunteers, analytics, settings
async function renderOrganizerDashboard(container) {
    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const userData = users[currentUser] || {};
    const organizerName = userData.name || currentUser || "Organizer";

    const [registrations, approvedEvents] = await Promise.all([
        fetchOrganizerRegistrations(),
        loadApprovedOrganizerEvents()
    ]);

    const totalParticipants = registrations.length;
    const totalRevenue = registrations.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thisMonthRegistrations = registrations.filter(r => new Date(r.registeredAt || new Date()) >= thirtyDaysAgo).length;

    const registrationsByEvent = {};
    registrations.forEach(r => {
        const name = r.eventName || r.event_name || 'Unknown';
        registrationsByEvent[name] = (registrationsByEvent[name] || 0) + 1;
    });

    const revenueByEvent = {};
    registrations.forEach(r => {
        const name = r.eventName || r.event_name || 'Unknown';
        revenueByEvent[name] = (revenueByEvent[name] || 0) + (parseFloat(r.amount) || 0);
    });

    const avgSatisfaction = totalParticipants > 0 ? (4.5 + Math.random() * 0.5).toFixed(1) : '—';

    // Volunteers placeholder
    const volunteers = [
        { name: "Alex Brown", role: "Check-in Desk", event: "Sample Event", status: "active" },
        { name: "Priya Patel", role: "Water Station", event: "Sample Event", status: "active" },
        { name: "Rahul Mehta", role: "Route Marshal", event: "Sample Event", status: "pending" }
    ];

    container.innerHTML = `
        <div class="bg-gray-50" style="min-height: 100vh; padding: 2rem 0;">
            <div class="container">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-4xl font-bold mb-2">Welcome, ${organizerName}</h1>
                    <p class="text-xl text-gray-600">Manage your events and participants</p>
                </div>

                <!-- Stats Overview -->
                <div class="grid grid-md-4 gap-6 mb-8">
                    <div class="dashboard-stat"><div class="stat-header"><div class="stat-title">Total Events</div><div class="stat-icon">${createIcon('calendar').outerHTML}</div></div><div class="stat-number">${approvedEvents.length}</div><div class="stat-change positive">+${thisMonthRegistrations} this month</div></div>
                    <div class="dashboard-stat"><div class="stat-header"><div class="stat-title">Total Participants</div><div class="stat-icon">${createIcon('users').outerHTML}</div></div><div class="stat-number">${formatNumber(totalParticipants)}</div><div class="stat-change positive">+${formatNumber(thisMonthRegistrations)} this month</div></div>
                    <div class="dashboard-stat"><div class="stat-header"><div class="stat-title">Total Revenue</div><div class="stat-icon">${createIcon('dollarSign').outerHTML}</div></div><div class="stat-number">$${formatNumber(Math.round(totalRevenue))}</div><div class="stat-change positive">${totalParticipants > 0 ? '✓ Active' : 'No data yet'}</div></div>
                    <div class="dashboard-stat"><div class="stat-header"><div class="stat-title">Avg. Satisfaction</div><div class="stat-icon">${createIcon('trendingUp').outerHTML}</div></div><div class="stat-number">${avgSatisfaction}</div><div class="stat-change">⭐⭐⭐⭐⭐</div></div>
                </div>

                <!-- Tabs -->
                <div class="tabs" id="organizerTabs">
                    <div class="tabs-list">
                        <button class="tab-trigger active" data-tab="events" onclick="switchTab('organizerTabs','events')">My Events</button>
                        <button class="tab-trigger" data-tab="participants" onclick="switchTab('organizerTabs','participants')">Participants</button>
                        <button class="tab-trigger" data-tab="volunteers" onclick="switchTab('organizerTabs','volunteers')">Volunteers</button>
                        <button class="tab-trigger" data-tab="analytics" onclick="switchTab('organizerTabs','analytics')">Analytics</button>
                        <button class="tab-trigger" data-tab="settings" onclick="switchTab('organizerTabs','settings')">Settings</button>
                    </div>

                    <!-- My Events -->
                    <div class="tab-content active" id="events">
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">My Approved Events</div>
                                <div class="card-description">Only events approved by admin</div>
                            </div>
                            <div class="card-content">
                                <div style="display:flex;flex-direction:column;gap:1rem;">
                                    ${approvedEvents.length > 0
                                        ? approvedEvents.map(event => {
                                            const regCount = registrationsByEvent[event.title] || event.participants || 0;
                                            const revenue = revenueByEvent[event.title] || (regCount * event.price);
                                            return `
                                                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                                    <div class="flex items-center gap-4">
                                                        <img src="${event.imageUrl}" alt="${event.title}" style="width:80px;height:80px;border-radius:var(--radius-md);object-fit:cover;">
                                                        <div>
                                                            <h4 class="font-semibold text-lg mb-1">${event.title}</h4>
                                                            <div class="flex items-center gap-3 text-sm text-gray-600">
                                                                <span class="flex items-center gap-1">${createIcon('calendar').outerHTML} ${formatDateShort(event.date)}</span>
                                                                <span class="flex items-center gap-1">${createIcon('users').outerHTML} ${regCount}/${event.maxParticipants}</span>
                                                                <span class="flex items-center gap-1">${createIcon('dollarSign').outerHTML} $${formatNumber(Math.round(revenue))}</span>
                                                            </div>
                                                            <div class="mt-2"><span class="badge badge-success">Approved</span></div>
                                                        </div>
                                                    </div>
                                                    <div class="flex gap-2">
                                                        <button class="btn btn-outline btn-sm" onclick="navigateTo('event-details','${event.id}')">${createIcon('eye').outerHTML} View</button>
                                                    </div>
                                                </div>`;
                                        }).join('') : `<p class="text-gray-600 text-center py-8">No approved events yet</p>`}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Participants Tab -->
                    <div class="tab-content" id="participants">
                        <div class="card">
                            <div class="card-header"><div class="card-title">Participant Management</div></div>
                            <div class="card-content">
                                <div id="participantsContainer" style="display:flex; flex-direction: column; gap:1rem;"><p class="text-gray-600">Loading...</p></div>
                            </div>
                        </div>
                    </div>

                    <!-- Volunteers Tab -->
                    <div class="tab-content" id="volunteers">
                        <div class="card">
                            <div class="card-header"><div class="card-title">Volunteers</div></div>
                            <div class="card-content">
                                <div style="display:flex; flex-direction:column; gap:1rem;">
                                    ${volunteers.map(v => `
                                        <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                            <div>
                                                <p class="font-semibold">${v.name}</p>
                                                <p class="text-sm text-gray-600">${v.role} | ${v.event}</p>
                                            </div>
                                            <span class="badge ${v.status === 'active' ? 'badge-success' : 'badge-outline'}">${v.status}</span>
                                        </div>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                   <!-- Analytics  Tab --> 
                   <div class="tab-content" id="analytics">
    <div class="card">
        <div class="card-header">
            <div class="card-title">Event Performance Analytics</div>
        </div>
        <div class="card-content">
            <canvas id="analyticsBarChart" height="120"></canvas>
        </div>
    </div>
</div>


                    <!-- Settings Tab -->
                    <div class="tab-content" id="settings">
                        <div class="card">
                            <div class="card-header"><div class="card-title">Organizer Settings</div></div>
                            <div class="card-content">
                                <div style="display:flex; flex-direction:column; gap:1.5rem;">
                                    <div><label class="label">Organization Name</label><input type="text" class="input" value="My Organization"></div>
                                    <div><label class="label">Contact Email</label><input type="email" class="input" value="contact@example.com"></div>
                                    <div><label class="label">Phone Number</label><input type="tel" class="input" value="+1 234 567 8900"></div>
                                    <div><label class="label">Website</label><input type="url" class="input" value="https://example.com"></div>
                                    <button class="btn btn-primary">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div style="text-align:center;margin-top:40px;padding:20px 0">
                    <button class="btn btn-outline" id="organizerDashboardLogoutBtn">Logout</button>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => displayRegistrations(container, registrations), 100);

    const logoutBtn = container.querySelector("#organizerDashboardLogoutBtn");
    if (logoutBtn) logoutBtn.onclick = () => { localStorage.removeItem("currentUser"); navigateTo("landing"); };

    setTimeout(() => {
    renderAnalyticsBarChart(registrationsByEvent, revenueByEvent);
}, 150);

                                    
}



export { renderOrganizerDashboard };