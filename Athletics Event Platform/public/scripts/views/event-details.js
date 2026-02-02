// event-details.js
// FULL UI + supports BOTH mockEvents + backend approved events

import { mockEvents } from "../data.js";

/* ================= API ================= */

async function getApprovedEvents() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/approved-events/');
    if (!res.ok) throw new Error('Failed to fetch approved events');
    const data = await res.json();

  //   return data.map(ev => ({
  //     id: String(ev.id),
  //     title: ev.title || 'Untitled Event',
  //     description: ev.description || '',
  //     date: ev.date || '',
  //     location: ev.location || '',
  //     imageUrl: ev.imageUrl
  // ? (ev.imageUrl.startsWith('http')
  //     ? ev.imageUrl
  //     : `http://127.0.0.1:8000${ev.imageUrl}`)
  // : 'https://placehold.co/1200x400?text=No+Image',

  //     category: ev.category || 'Running',
  //     status: 'upcoming',
  //     price: ev.price || 0,
  //     currency: 'USD',
  //     participants: ev.participants || 0,
  //     maxParticipants: ev.maxParticipants || 100,
  //     distance: ev.distance || '-',
  //     organizer: ev.organizer || 'Event Organizer',
  //     registrationDeadline: ev.registrationDeadline || 'N/A',
  //     distances: ev.distances || []
  //   }));

  return data.map(ev => ({
  id: String(ev.id),
  title: ev.title || 'Untitled Event',
  description: ev.description || 'No description available.',
  date: ev.date,
  location: ev.location || 'Location TBA',
imageUrl: ev.imageUrl || "https://placehold.co/1200x400?text=Event+Image",

  category: 'Running',
  status: 'upcoming',

  price: ev.price ?? 0,
  currency: 'USD',

  participants: ev.participants ?? 0,
  maxParticipants: ev.maxParticipants ?? 200,

  distance: ev.distance || '—',
  organizer: ev.organizer || 'Event Organizer',
  registrationDeadline: ev.registrationDeadline || 'N/A',
}));


  } catch (err) {
    console.error("event-details fetch error:", err);
    return [];
  }
}

/* ================= STATE ================= */

let isRegistered = false;
let activeTab = "overview";

/* ================= MAIN RENDER ================= */

export async function renderEventDetails(container, eventId) {
  const app = document.getElementById("app");

  const approvedEvents = await getApprovedEvents();
  const allEvents = [...mockEvents, ...approvedEvents];

  const event = allEvents.find(e => String(e.id) === String(eventId));

  if (!event) {
    app.innerHTML = `<h2>Event not found</h2>`;
    return;
  }

  const participationPercentage =
    Math.round((event.participants / event.maxParticipants) * 100);

  app.innerHTML = `
    <div style="max-width:1200px;margin:0 auto;padding:16px">

      <!-- Back -->
      <button id="backBtn" style="margin-bottom:12px">← Back to Events</button>

      <!-- Banner -->
      <img
        src="${event.imageUrl}"
        alt="${event.title}"
        style="
          width:100%;
          height:300px;
          object-fit:cover;
          border-radius:14px;
          margin-bottom:20px
        "
      />

      <!-- MAIN GRID -->
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:24px">

        <!-- LEFT CONTENT -->
        <div style="
          background:#fff;
          border:1px solid #e5e7eb;
          border-radius:14px;
          padding:20px
        ">

          <!-- Header -->
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <h2 style="margin:0">${event.title}</h2>
              <p style="margin:4px 0;color:#6b7280">${event.organizer}</p>
              <span style="
                background:#dcfce7;
                color:#166534;
                padding:4px 10px;
                border-radius:999px;
                font-size:12px
              ">
                ${event.status}
              </span>
            </div>
            <div style="display:flex;gap:10px">
              <button>♡</button>
              <button>↗</button>
            </div>
          </div>

          <!-- Tabs -->
          <div style="
            display:flex;
            gap:16px;
            margin-top:20px;
            border-bottom:1px solid #e5e7eb;
            padding-bottom:10px
          ">
            <button class="tabBtn" data-tab="overview">Overview</button>
            <button class="tabBtn" data-tab="details">Details</button>
            <button class="tabBtn" data-tab="route">Route</button>
            <button class="tabBtn" data-tab="faqs">FAQs</button>
          </div>

          <!-- Tab Content -->
          <div style="margin-top:16px">
            ${renderTabContent(event)}
          </div>

          <!-- Info Grid -->
          <div style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:12px;
            margin-top:20px
          ">
            <div style="border:1px solid #e5e7eb;border-radius:10px;padding:12px">
              <b>Event Date</b><br>
              ${new Date(event.date).toDateString()}
            </div>
            <div style="border:1px solid #e5e7eb;border-radius:10px;padding:12px">
              <b>Location</b><br>
              ${event.location}
            </div>
            <div style="border:1px solid #e5e7eb;border-radius:10px;padding:12px">
              <b>Distance</b><br>
              ${event.distance}
            </div>
            <div style="border:1px solid #e5e7eb;border-radius:10px;padding:12px">
              <b>Registration Deadline</b><br>
              ${event.registrationDeadline}
            </div>
          </div>

        </div>

        <!-- RIGHT REGISTRATION -->
        <div style="
          background:#fff;
          border:1px solid #e5e7eb;
          border-radius:14px;
          padding:20px
        ">
          <h3>Registration</h3>
          <p style="font-size:14px;color:#6b7280">
            Secure your spot today
          </p>

          <div style="
            background:#eff6ff;
            padding:12px;
            border-radius:10px;
            margin:12px 0
          ">
            <h2 style="margin:0">${event.price} ${event.currency}</h2>
            <span style="font-size:12px">Registration Fee</span>
          </div>

          <p style="font-size:14px">
            Spots Available:
            <b>${event.maxParticipants - event.participants}</b>
          </p>

          <!-- Progress -->
          <div style="background:#e5e7eb;height:8px;border-radius:4px">
            <div style="
              background:#2563eb;
              height:8px;
              width:${participationPercentage}%;
              border-radius:4px
            "></div>
          </div>

          <p style="font-size:12px;margin
-top:6px">
            ${participationPercentage}% filled
          </p>

          <button
            id="registerBtn"
            style="
              width:100%;
              margin-top:12px;
              background:#2563eb;
              color:white;
              border:none;
              padding:10px;
              border-radius:8px;
              cursor:pointer
            "
          >
            Register Now
          </button>

          <p style="font-size:12px;color:#6b7280;margin-top:10px">
            Secure payment processing. Refunds available up to 14 days before event.
          </p>
        </div>

      </div>
    </div>
  `;

  /* ================= EVENTS ================= */

  document.getElementById("backBtn").onclick = () =>
    navigateTo("events");

  document.querySelectorAll(".tabBtn").forEach(btn => {
    btn.onclick = () => {
      activeTab = btn.dataset.tab;
      renderEventDetails(container, eventId);
    };
  });

  document.getElementById("registerBtn")?.addEventListener("click", () => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      alert("Please log in first to register for events");
      window.location.href = 'login.html';
      return;
    }
    window.location.href = `register.html?id=${eventId}`;
  });
}

/* ================= TAB CONTENT ================= */

function renderTabContent(event) {
  if (activeTab === "overview") {
    return `
      <h4>📋 Event Overview</h4>
      <p>${event.description || 'No description available for this event.'}</p>
    `;
  }

  if (activeTab === "details") {
    return `
      <ul>
        <li>Registration Opens: 6:00 AM</li>
        <li>Event Start: 8:00 AM</li>
        <li>Awards Ceremony: 3:00 PM</li>
        <li>Organizer: ${event.organizer}</li>
      </ul>
    `;
  }

  if (activeTab === "route") {
    return `<p>🗺️ Route map will be shared soon.</p>`;
  }

  if (activeTab === "faqs") {
    return `
      <p><b>Can I transfer registration?</b> Yes</p>
      <p><b>What if it rains?</b> Event continues</p>
      <p><b>Age limit?</b> 18+</p>
    `;
  }

  return "";
}
