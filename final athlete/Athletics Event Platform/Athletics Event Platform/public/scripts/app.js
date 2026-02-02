// app.js
// Main Application Logic
// LOGIC NOT CHANGED – ONLY MODULE COMPATIBILITY FIXED

/* ================= IMPORTS ================= */

// Views
import { renderLandingPage } from "./views/landing.js";
import { renderEventsPage } from "./views/events.js";
import { renderEventDetails } from "./views/event-details.js";
import { renderAthleteDashboard } from "./views/athlete-dashboard.js";
import { renderOrganizerDashboard } from "./views/organizer-dashboard.js";
import { renderAdminPanel } from "./views/admin-panel.js";
import { renderLiveTracking } from "./views/live-tracking.js";

// Shared
import "./data.js";
import { createElement, createIcon } from "./utils.js";

/* ================= GLOBAL STATE ================= */

let currentView = "landing";
let userRole = "guest";
let selectedEventId = null;

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", function () {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        const users = JSON.parse(localStorage.getItem("users")) || {};
        if (users[currentUser]) {
            // Set user role based on stored data
            userRole = users[currentUser].role;
        }
    }
    navigateTo("landing");
});

/* ================= NAVIGATION ================= */

window.navigateTo = function (view, eventId = null) {
    currentView = view;
    if (eventId) selectedEventId = eventId;

    const app = document.getElementById("app");
    const navigation = document.getElementById("navigation");

    // Always show navigation and update it
    navigation.classList.remove("hidden");
    updateNavigation();

    // Clear current content
    app.innerHTML = "";

    // Load view
    switch (view) {
        case "landing":
            renderLandingPage(app);
            break;
        case "events":
            renderEventsPage(app);
            break;
        case "event-details":
            renderEventDetails(app, selectedEventId);
            break;
        case "athlete-dashboard":
            renderAthleteDashboard(app);
            break;
        case "organizer-dashboard":
            renderOrganizerDashboard(app);
            break;
        case "admin-panel":
            renderAdminPanel(app);
            break;
        case "live-tracking":
            renderLiveTracking(app);
            break;
        default:
            renderLandingPage(app);
    }

    window.scrollTo(0, 0);
};

/* ================= AUTH ================= */

window.login = function (role) {
    userRole = role;

    if (role === "athlete") navigateTo("athlete-dashboard");
    else if (role === "organizer") navigateTo("organizer-dashboard");
    else if (role === "admin") navigateTo("admin-panel");
};

function logout() {
    userRole = "guest";
    localStorage.removeItem("currentUser");
    navigateTo("landing");
}

/* ================= NAV BAR ================= */


function updateNavigation() {
    const navLinks = document.getElementById("navbarLinks");
    navLinks.innerHTML = "";

    
    // Show Create Event button only for organizers and admins
    if (userRole === "organizer" || userRole === "superadmin") {
        const createEventBtn = createElement("button", "btn btn-primary btn-sm");
        createEventBtn.appendChild(createIcon("plus"));
        createEventBtn.appendChild(document.createTextNode(" Create Event"));
        createEventBtn.onclick = () => {
            window.location.href = "event.html";
        };
        navLinks.appendChild(createEventBtn);
    }

    const homeBtn = createElement("button", "btn btn-ghost btn-sm");
    homeBtn.appendChild(createIcon("home"));
    homeBtn.appendChild(document.createTextNode(" Home"));
    homeBtn.onclick = () => navigateTo("landing");
    navLinks.appendChild(homeBtn);

    const eventsBtn = createElement("button", "btn btn-ghost btn-sm");
    eventsBtn.appendChild(createIcon("calendar"));
    eventsBtn.appendChild(document.createTextNode(" Events"));
    eventsBtn.onclick = () => navigateTo("events");
    navLinks.appendChild(eventsBtn);

    // if (userRole === "athlete") {
    //     const btn = createElement("button", "btn btn-ghost btn-sm");
    //     btn.appendChild(createIcon("user"));
    //     btn.appendChild(document.createTextNode(" Dashboard"));
    //     btn.onclick = () => navigateTo("login.html");
    //     navLinks.appendChild(btn);

    
    if (userRole === "athlete") {
        const btn = createElement("button", "btn btn-ghost btn-sm");
        btn.appendChild(createIcon("user"));
        btn.appendChild(document.createTextNode(" Dashboard"));
        btn.onclick = () => {
            window.location.href = "login.html";
        };
        navLinks.appendChild(btn);
    }

    if (userRole === "admin") {
        const btn = createElement("button", "btn btn-ghost btn-sm");
        btn.appendChild(createIcon("shield"));
        btn.appendChild(document.createTextNode(" Admin"));
        btn.onclick = () => navigateTo("admin-panel");
        navLinks.appendChild(btn);
    }

    const liveBtn = createElement("button", "btn btn-ghost btn-sm");
    liveBtn.appendChild(createIcon("radio"));
    liveBtn.appendChild(document.createTextNode(" Live"));
    liveBtn.onclick = () => navigateTo("live-tracking");
    navLinks.appendChild(liveBtn);

    if (userRole !== "guest") {
        // Add profile avatar
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
            const users = JSON.parse(localStorage.getItem("users")) || {};
            const userData = users[currentUser];

            if (userData) {
                const profileAvatar = document.createElement("div");
                const userInitial = currentUser.charAt(0).toUpperCase();

                // Determine avatar color based on role
                let avatarClass = "profile-avatar profile-avatar-blue";
                if (userData.role === "organizer") {
                    avatarClass = "profile-avatar profile-avatar-purple";
                } else if (userData.role === "superadmin") {
                    avatarClass = "profile-avatar profile-avatar-green";
                }

                profileAvatar.className = avatarClass;
                profileAvatar.textContent = userInitial;
                profileAvatar.title = `${userData.firstName} ${userData.lastName}`;
                profileAvatar.style.cursor = "pointer";
                profileAvatar.onclick = () => {
                    if (userData.role === "organizer") {
                        navigateTo('organizer-dashboard');
                    } else if (userData.role === "superadmin") {
                        navigateTo('admin-panel');
                    } else {
                        navigateTo('athlete-dashboard');
                    }
                };
                navLinks.appendChild(profileAvatar);
            }
        }

        // Only show logout on athlete dashboard, not on landing page
        if (currentView !== "landing") {
            const logoutBtn = createElement("button", "btn btn-outline btn-sm");
            logoutBtn.appendChild(createIcon("logout"));
            logoutBtn.appendChild(document.createTextNode(" Logout"));
            logoutBtn.onclick = logout;
            navLinks.appendChild(logoutBtn);
        }
    }
}
