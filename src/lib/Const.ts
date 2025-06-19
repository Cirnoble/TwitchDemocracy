export const REDIRECT_URL =import.meta.env.DEV ? 'http://localhost:5173': 'https://cirnoble.github.io/TwitchDemocracy/' 
export const CLIENT_ID = 'sgh0sog8v4dj5ncuodip6ib6zadjmh'

export const BASE_URL = ''
export const TWITCH_USER_URL = 'https://api.twitch.tv/helix/users?'
export const TWITCH_VALIDATION_URL = 'https://id.twitch.tv/oauth2/validate'
export const TWITCH_AUTHORIZE_URL = 'https://id.twitch.tv/oauth2/authorize'
export const TWITCH_EVENTSUB = 'wss://eventsub.wss.twitch.tv/ws'
export const TWITCH_EVENTSUB_MAKE = 'https://api.twitch.tv/helix/eventsub/subscriptions'
export const TWITCH_SCOPES = ['channel:bot','user:read:chat','user:bot']

export const SUBMIT_PREFIX = '!idea'
export const VOTE_PREFIX = '!vote'