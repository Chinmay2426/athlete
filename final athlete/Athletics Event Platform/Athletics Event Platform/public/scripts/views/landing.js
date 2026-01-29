// Landing Page View
import { createIcon } from "../utils.js";

// Function to handle role button clicks
window.handleRoleClick = function(role) {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        navigateTo('events');
    } else {
        window.location.href = `login.html?role=${role}`;
    }
};

export function renderLandingPage(container) {

    container.innerHTML = `
        <!-- Hero Section -->
        <div class="hero py-24">
            <div class="hero-content">
                <div class="container">
                    <div class="text-center">
                        <div class="flex items-center justify-center gap-3 mb-6">
                            <div style="width: 64px; height: 64px;">
                                ${createIcon('radio').outerHTML}
                            </div>
                        </div>
                        <h1 class="text-5xl font-bold mb-6">
                            Next-Generation Athletics Platform
                        </h1>
                        <p class="text-xl mb-8" style="color: #dbeafe;">
                            Discover, Register, Track & Excel in Endurance Events Worldwide
                        </p>
                        <div class="flex flex-wrap gap-4 justify-center">
                            <button class="btn btn-lg" style="background: white; color: var(--primary-blue);" onclick="navigateTo('events')">
                                ${createIcon('calendar').outerHTML}
                                Explore Events
                            </button>
                            ${localStorage.getItem("currentUser") ? '' : `
                            <button class="btn btn-outline btn-lg" style="color: white; border-color: white;"
                                onclick="window.location.href='login.html'">
                                ${createIcon('users').outerHTML}
                                Login
                            </button>
                            `}

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats Section -->
        <div class="bg-white py-16">
            <div class="container">
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-value" style="color: var(--primary-blue);">50K+</div>
                        <div class="stat-label">Active Athletes</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" style="color: var(--primary-purple);">1,200+</div>
                        <div class="stat-label">Events Hosted</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" style="color: var(--success-green);">95%</div>
                        <div class="stat-label">Satisfaction Rate</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" style="color: #ea580c;">45+</div>
                        <div class="stat-label">Countries</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Features Section -->
        <div class="bg-gray-50 py-16">
            <div class="container">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold mb-4">Platform Features</h2>
                    <p class="text-xl text-gray-600">Everything you need for a world-class event experience</p>
                </div>

                <div class="grid grid-md-2 grid-lg-3 gap-6">
                    <div class="card">
                        <div class="card-header">
                            <div class="feature-icon feature-icon-blue">
                                ${createIcon('calendar').outerHTML}
                            </div>
                            <div class="card-title">Event Discovery</div>
                            <div class="card-description">
                                Browse and register for marathons, triathlons, cycling events and more
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="feature-icon feature-icon-purple">
                                ${createIcon('radio').outerHTML}
                            </div>
                            <div class="card-title">Live Tracking</div>
                            <div class="card-description">
                                Real-time GPS tracking and race updates for participants and spectators
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="feature-icon feature-icon-green">
                                ${createIcon('barChart').outerHTML}
                            </div>
                            <div class="card-title">Performance Analytics</div>
                            <div class="card-description">
                                Detailed insights, personal records, and progress tracking
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="feature-icon feature-icon-orange">
                                ${createIcon('trophy').outerHTML}
                            </div>
                            <div class="card-title">Results & Rankings</div>
                            <div class="card-description">
                                Instant results, leaderboards, and digital certificates
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="feature-icon feature-icon-red">
                                ${createIcon('shield').outerHTML}
                            </div>
                            <div class="card-title">Secure Payments</div>
                            <div class="card-description">
                                Safe and secure registration with multiple payment options
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="feature-icon feature-icon-indigo">
                                ${createIcon('globe').outerHTML}
                            </div>
                            <div class="card-title">Global Events</div>
                            <div class="card-description">
                                Multi-language and multi-currency support for worldwide events
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
<!-- User Roles Section -->
<div class="bg-white py-16">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold mb-4">Built for Everyone</h2>
      <p class="text-xl text-gray-600">
        Tailored experiences for every role in the athletics ecosystem
      </p>
    </div>

    <div class="grid grid-md-3 gap-8">

      <!-- Athletes -->
      <div class="card role-card" onclick="window.location.href='login.html'">
        <div class="card-header">
          <div class="role-icon role-icon-athlete">
            ${createIcon('users').outerHTML}
          </div>
          <div class="card-title text-center">Athletes</div>
        </div>
        <div class="card-content">
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
            <li class="flex items-center gap-2 text-sm">
              ${createIcon('target').outerHTML}
              <span>Event registration & discovery</span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              ${createIcon('clock').outerHTML}
              <span>Training plans & preparation</span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              ${createIcon('award').outerHTML}
              <span>Performance tracking & achievements</span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              ${createIcon('mapPin').outerHTML}
              <span>Digital bibs & race tracking</span>
            </li>
          </ul>

          <button class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;"
            onclick="event.stopPropagation(); handleRoleClick('participant')">
            Enter as Athlete
          </button>
        </div>
      </div>

      <!-- Organizers -->
      <div class="card role-card" onclick="event.stopPropagation();">
        <div class="card-header">
          <div class="role-icon role-icon-organizer">
            ${createIcon('trophy').outerHTML}
          </div>
          <div class="card-title text-center">Organizers</div>
        </div>
        <div class="card-content">
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
            <li class="flex items-center gap-2 text-sm">
              ${createIcon('calendar').outerHTML}
              <span>Event creation & management</span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              ${createIcon('users').outerHTML}
              <span>Participant management</span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              ${createIcon('barChart').outerHTML}
              <span>Real-time analytics & reports</span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              ${createIcon('zap').outerHTML}
              <span>Race-day operations</span>
            </li>
          </ul>

          <button class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;"
            onclick="event.stopPropagation(); handleRoleClick('organizer')">
            Enter as Organizer
          </button>
        </div>
      </div>

      <!-- Administrators -->
      <div class="card role-card" onclick="event.stopPropagation();">
        <div class="card-header">
          <div class="role-icon role-icon-admin">
            ${createIcon('shield').outerHTML}
          </div>
          <div class="card-title text-center">Super Admin</div>
        </div>
        <div class="card-content">
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
            <li class="flex items-center gap-2 text-sm">
              ${createIcon('shield').outerHTML}
              <span>Platform-wide management</span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              ${createIcon('users').outerHTML}
              <span>User & role control</span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              ${createIcon('barChart').outerHTML}
              <span>System monitoring</span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              ${createIcon('globe').outerHTML}
              <span>Content management</span>
            </li>
          </ul>

          <button class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;"
            onclick="event.stopPropagation(); handleRoleClick('superadmin')">
            Enter as Super Admin
          </button>
        </div>
      </div>

    </div>
  </div>
</div>

    `;
}
