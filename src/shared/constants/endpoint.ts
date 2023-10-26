export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


// USERS ENDPOINTS
export const LOGIN_USER = `${API_BASE_URL}/users/login`
export const GET_USER = `${API_BASE_URL}/users/me`


// EVENTS ENDPOINTS
export const EVENTS_API = `${API_BASE_URL}/event`
export const RECENT_EVENTS_API = `${API_BASE_URL}/event/recent`
export const IMAGES_ZIP_API = `${API_BASE_URL}/event/image/:id/zip`
export const EVENT_API = `${API_BASE_URL}/event/:id`