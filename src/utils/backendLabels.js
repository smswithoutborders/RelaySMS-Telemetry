// ==============================|| BACKEND VALUES → WHAT THE DASHBOARD SHOWS ||============================== //
//
// Every raw value the Publisher API sends that the dashboard turns into words lives here. If the backend renames a value
// (say `method: "session"` becomes `"web"`) or adds one, change it in this file only. Each section names where the values
// come from in RelaySMS-Publisher. Anything not listed falls back to a readable version of the raw value.
//
// Permission (scope) wording lives with the permission rules in utils/scopes.js.

// ---- Publications: /v1/stats/publications (publisher/tasks/publication_task.py) ---- //

export const PUBLICATION_STATUS = {
  published: 'Published',
  failed: 'Failed'
};

// Ingestion protocols. Also used for routing numbers' protocols.
export const PROTOCOLS = {
  sms: 'SMS',
  https: 'HTTPS',
  smtp: 'SMTP'
};

// platform_name → display name and logo (files in /public). `invertInDark` turns a black logo white in dark mode.
const publicFile = (name) => `${import.meta.env.BASE_URL}${name}`;

export const PLATFORMS = {
  gmail: { name: 'Gmail', logo: publicFile('Gmail_icon.svg') },
  twitter: { name: 'Twitter', logo: publicFile('x-twitter-brands-solid.svg'), invertInDark: true },
  x: { name: 'X', logo: publicFile('x-twitter-brands-solid.svg'), invertInDark: true },
  telegram: { name: 'Telegram', logo: publicFile('telegram.png') },
  bluesky: { name: 'Bluesky', logo: publicFile('Bluesky_Logo.svg') },
  mastodon: { name: 'Mastodon', logo: publicFile('mastodon.svg') },
  slack: { name: 'Slack', logo: publicFile('slack.png') },
  // RelaySMS's own email bridge, so it uses the RelaySMS logo.
  email_bridge: { name: 'Email Bridge', logo: publicFile('logo.svg') }
};

// platform_name is null when a publication failed before the platform was known.
export const NO_PLATFORM = { short: 'Unknown', long: 'Unknown (failed before the platform was known)' };

// failure_reason → friendlier wording. Reasons not listed are shown as the Publisher wrote them.
export const FAILURE_REASONS = {
  unexpected_error: 'Unexpected error'
};

// ---- Platforms: /v1/platforms (lib_relaysms_payload_specs: V1PayloadsSupportedProtocols, V1ContentCategories) ---- //

export const PLATFORM_AUTH = { 0: 'OAuth 2.0', 1: 'Phone number' };
export const PLATFORM_CATEGORIES = { 0: 'Email', 1: 'Message', 2: 'Text' };

// ---- Routing numbers: /v1/gateway-clients/registry (publisher/gateway_clients/manager.py) ---- //

export const GATEWAY_CLIENT_STATUS = { enabled: 'Enabled', disabled: 'Disabled' };

export const GATEWAY_CLIENT_FIELDS = {
  msisdn: 'Number',
  country: 'Country',
  operator: 'Operator',
  operator_code: 'Operator code',
  protocols: 'Protocols'
};

// Suggest endpoint's `match`: how sure the lookup is about the number's network.
export const SUGGEST_MATCH = {
  carrier: '',
  region: 'The carrier is unknown, so pick the network below.',
  none: "This number couldn't be placed. Fill in the country and operator below."
};

// ---- Users: /v1/creds ---- //

export const CREDENTIAL_STATUS = { active: 'Active', disabled: 'Disabled' };

// ---- Logs: /v1/audit-events (publisher/models/audit_event.py: AuditAction, AuditOutcome, AREA_SCOPES) ---- //

// action → label and area. The area decides the group in the Action filter and whether the target is a user.
export const AUDIT_ACTIONS = {
  'auth.login': { label: 'Signed in', area: 'auth' },
  'auth.logout': { label: 'Signed out', area: 'auth' },
  'creds.create': { label: 'Added user', area: 'creds' },
  'creds.update': { label: 'Changed user', area: 'creds' },
  'creds.reset_password': { label: 'Reset password', area: 'creds' },
  'creds.revoke_sessions': { label: 'Signed user out everywhere', area: 'creds' },
  'creds.delete': { label: 'Removed user', area: 'creds' },
  'platforms.add': { label: 'Installed platform', area: 'platforms' },
  'platforms.update': { label: 'Updated platform', area: 'platforms' },
  'platforms.remove': { label: 'Removed platform', area: 'platforms' },
  'platforms.enable': { label: 'Enabled platform', area: 'platforms' },
  'platforms.disable': { label: 'Disabled platform', area: 'platforms' },
  'gateway_clients.create': { label: 'Added routing number', area: 'gateway_clients' },
  'gateway_clients.update': { label: 'Changed routing number', area: 'gateway_clients' },
  'gateway_clients.enable': { label: 'Enabled routing number', area: 'gateway_clients' },
  'gateway_clients.disable': { label: 'Disabled routing number', area: 'gateway_clients' },
  'gateway_clients.delete': { label: 'Removed routing number', area: 'gateway_clients' }
};

// A failed auth.login reads better as its own phrase.
export const FAILED_LOGIN_LABEL = 'Sign-in failed';

export const AUDIT_AREAS = [
  { id: 'auth', label: 'Sign-ins' },
  { id: 'creds', label: 'Users' },
  { id: 'platforms', label: 'Platforms' },
  { id: 'gateway_clients', label: 'Routing numbers' }
];

export const AUDIT_OUTCOMES = {
  success: { label: 'Success', color: 'success.dark' },
  denied: { label: 'Denied', color: '#c2760c' },
  failed: { label: 'Failed', color: 'error.dark' }
};

// details.method on sign-in and sign-out events.
export const LOGIN_METHODS = {
  session: 'dashboard',
  basic: 'API, username and password'
};

// ---- Fallbacks ---- //

// "email_bridge" → "Email Bridge" for values not listed above.
export function humanize(value) {
  if (value === null || value === undefined || value === '') return '';
  return String(value)
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const label = {
  status: (value) => PUBLICATION_STATUS[value] ?? humanize(value),
  protocol: (value) => (value ? (PROTOCOLS[value.toLowerCase()] ?? value.toUpperCase()) : 'Unknown'),
  platform: (value) => (value ? (PLATFORMS[value.toLowerCase()]?.name ?? humanize(value)) : NO_PLATFORM.short),
  failureReason: (value) => (value ? (FAILURE_REASONS[value] ?? value) : 'No reason recorded'),
  loginMethod: (value) => LOGIN_METHODS[value] ?? value
};
