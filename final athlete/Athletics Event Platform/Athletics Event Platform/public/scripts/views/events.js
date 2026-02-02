// Events Discovery Page

import { 
  createIcon,
  formatDate,
  getStatusBadgeClass
} from "../utils.js";

import { mockEvents } from "../data.js";

/* ================= API HELPERS ================= */

// NORMALIZED backend events
async function getApprovedEvents() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/approved-events/');
    if (!res.ok) throw new Error('Failed to fetch approved events');
    const data = await res.json();

    // ✅ Map backend fields to frontend format
    return data.map(ev => ({
      id: String(ev.id),

      title: ev.title || 'Untitled Event',
      description: ev.description || '',

      date: ev.date || '',
      location: ev.location || '',

      // 🔥 Make full image URL
      // imageUrl: ev.imageUrl
      //   ? `http://127.0.0.1:8000${ev.imageUrl}`
      //   : 'default-image.jpg',
      imageUrl: ev.imageUrl || 'https://placehold.co/600x400?text=Event+Image',

      category: ev.category || 'Running',
      status: 'upcoming',

      price: ev.price || 0,
      currency: 'USD',

      participants: ev.participants || 0,
      maxParticipants: ev.maxParticipants || 100,

      distance: ev.distance || '-',
      organizer: ev.organizer || '-',
      registrationDeadline: ev.registrationDeadline || '-',

      distances: ev.distances || []
    }));

  } catch (err) {
    console.error("Approved events fetch error:", err);
    return [];
  }
}


/* ================= EVENTS PAGE ================= */

export async function renderEventsPage(container) {

  let searchQuery = '';
  let selectedCategory = 'all';
  let selectedStatus = 'all';

  let events = [...mockEvents]; // keep old working mock events

  const approvedEvents = await getApprovedEvents();

  // Merge backend events safely
  approvedEvents.forEach(ev => {
    const exists = events.some(e => String(e.id) === String(ev.id));
    if (!exists) {
      events.push(ev);
    }
  });

  function render() {
    const filteredEvents = events.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || event.category === selectedCategory;

      const matchesStatus =
        selectedStatus === 'all' || event.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    container.innerHTML = `
      <div class="bg-gray-50" style="min-height: 100vh; padding: 2rem 0;">
        <div class="container">

          <div class="mb-8">
  <h1 class="text-4xl font-bold mb-2">Discover Events</h1>
  <p class="text-xl text-gray-600">Find your next athletic challenge</p>

  <!-- SEARCH & FILTER BAR -->
  <div style="
      margin-top:20px;
      padding:16px;
      background:white;
      border-radius:12px;
      box-shadow:0 2px 8px rgba(0,0,0,0.06);
      display:flex;
      gap:12px;
      flex-wrap:wrap;
  ">
    <input 
      id="searchInput"
      type="text"
      placeholder="Search events or locations..."
      style="flex:1; padding:10px; border:1px solid #ddd; border-radius:8px;"
    />

    <select id="categoryFilter" style="padding:10px; border-radius:8px;">
      <option value="all">All Categories</option>
      <option value="Running">Running</option>
      <option value="Cycling">Cycling</option>
      <option value="Swimming">Swimming</option>
      <option value="Triathlon">Triathlon</option>
    </select>

    <select id="statusFilter" style="padding:10px; border-radius:8px;">
      <option value="all">All Status</option>
      <option value="upcoming">Upcoming</option>
      <option value="ongoing">Ongoing</option>
      <option value="completed">Completed</option>
    </select>
  </div>
</div>


          <div class="grid grid-md-2 grid-lg-3 gap-6">
            ${filteredEvents.map(event => `
              <div class="event-card">
                <div class="event-image-container">
                  <img src="${event.imageUrl}" alt="${event.title}" class="event-image">
                </div>

                <div class="card-header">
                  <span class="badge ${getStatusBadgeClass(event.status)}">
                    ${event.status}
                  </span>
                  <h3>${event.title}</h3>
                  <p>${event.description.slice(0,80)}...</p>
                </div>

                <div class="card-content">
                  <p>${formatDate(event.date)}</p>
                  <p>${event.location}</p>
                  <p>${event.price} ${event.currency}</p>
                </div>

                <div class="card-footer">
                  <button class="btn btn-primary"
                    onclick="navigateTo('event-details','${event.id}')">
                    View Details
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

        </div>
      </div>
    `;
  }

  render();
}

/* ================= EVENT DETAILS (FIXED) ================= */

async function renderEventDetails(container, eventId) {
  const approvedEvents = await getApprovedEvents();
  const allEvents = [...mockEvents, ...approvedEvents];

  console.log("Clicked Event ID:", eventId);
  console.log("All Event IDs:", allEvents.map(e => e.id));

  const event = allEvents.find(ev => String(ev.id) === String(eventId));

  if (!event) {
    container.innerHTML = `<h2>Event not found</h2>`;
    return;
  }

  container.innerHTML = `
    <div class="container py-8">
      <h1 class="text-2xl font-bold mb-2">${event.title}</h1>

      <img src="${event.imageUrl}" class="w-full max-w-lg rounded mb-4">

      <p><b>Description:</b> ${event.description}</p>
      <p><b>Date:</b> ${event.date}</p>
      <p><b>Location:</b> ${event.location}</p>
      <p><b>Category:</b> ${event.category}</p>
      <p><b>Distance:</b> ${event.distance}</p>
      <p><b>Participants:</b> ${event.participants} / ${event.maxParticipants}</p>
      <p><b>Price:</b> ${event.price} ${event.currency}</p>
      <p><b>Organizer:</b> ${event.organizer}</p>
      <p><b>Registration Deadline:</b> ${event.registrationDeadline}</p>

      <button class="btn btn-primary"
        onclick="navigateTo('register','${event.id}')">
        Register Now
      </button>
    </div>
  `;
}

/* ================= NAVIGATION ================= */

async function navigateTo(page, eventId) {
  const container = document.getElementById('app');

  if (page === 'events') {
    await renderEventsPage(container);
  } 
  else if (page === 'event-details') {
    await renderEventDetails(container, eventId);
  } 
  else if (page === 'register') {
    renderRegistrationForm(container, eventId);
  }
}

window.navigateTo = navigateTo;
window.renderEventDetails = renderEventDetails;