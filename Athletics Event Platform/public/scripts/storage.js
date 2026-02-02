// Registration Storage Utility
// Handles saving and retrieving athlete registrations from localStorage

const REGISTRATIONS_KEY = 'athleteRegistrations';

/**
 * Save a new registration
 * @param {Object} registration - Registration data object
 */
export function saveRegistration(registration) {
    const registrations = getRegistrations();
    
    // Generate unique ID if not provided
    if (!registration.id) {
        registration.id = Date.now();
    }
    
    // Add timestamp if not provided
    if (!registration.registeredAt) {
        registration.registeredAt = new Date().toISOString();
    }
    
    registrations.push(registration);
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
    
    return registration;
}

/**
 * Get all registrations
 * @returns {Array} Array of registration objects
 */
export function getRegistrations() {
    const data = localStorage.getItem(REGISTRATIONS_KEY);
    return data ? JSON.parse(data) : [];
}

/**
 * Get registrations by event name
 * @param {string} eventName - Name of the event
 * @returns {Array} Array of registrations for the event
 */
export function getRegistrationsByEvent(eventName) {
    const registrations = getRegistrations();
    return registrations.filter(reg => reg.event_name === eventName || reg.eventName === eventName);
}

/**
 * Get registration by ID
 * @param {number} id - Registration ID
 * @returns {Object|null} Registration object or null
 */
export function getRegistrationById(id) {
    const registrations = getRegistrations();
    return registrations.find(reg => reg.id === id) || null;
}

/**
 * Update a registration
 * @param {number} id - Registration ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated registration or null
 */
export function updateRegistration(id, updates) {
    const registrations = getRegistrations();
    const index = registrations.findIndex(reg => reg.id === id);
    
    if (index === -1) return null;
    
    registrations[index] = { ...registrations[index], ...updates };
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
    
    return registrations[index];
}

/**
 * Delete a registration
 * @param {number} id - Registration ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteRegistration(id) {
    const registrations = getRegistrations();
    const filtered = registrations.filter(reg => reg.id !== id);
    
    if (filtered.length === registrations.length) return false;
    
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(filtered));
    return true;
}

/**
 * Clear all registrations
 */
export function clearRegistrations() {
    localStorage.removeItem(REGISTRATIONS_KEY);
}

/**
 * Get registration count
 * @returns {number} Total number of registrations
 */
export function getRegistrationCount() {
    return getRegistrations().length;
}
