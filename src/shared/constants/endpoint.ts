const API_BASE_URL = process.env.API_BASE_URL

export const EVENTS_API = `${API_BASE_URL}/event`
export const RECENT_EVENTS_API = `${API_BASE_URL}/event/recent`
export const EVENT_MUTATION_API = `${API_BASE_URL}/event/:id`