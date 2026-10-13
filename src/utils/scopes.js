// ==============================|| CREDENTIAL SCOPES ||============================== //

export const SCOPES = {
  STATS_READ: 'stats:publications:read',
  STATS_REASONS: 'stats:publications:reasons',
  GC_READ: 'gc:read',
  GC_WRITE: 'gc:write',
  PLATFORMS_READ: 'platforms:read',
  PLATFORMS_WRITE: 'platforms:write',
  CREDS_READ: 'creds:read',
  CREDS_WRITE: 'creds:write',
  AUDIT_READ: 'audit:read'
};

export const PERMISSION_GROUPS = [
  {
    id: 'publications',
    title: 'Publications',
    description: 'Message delivery stats on the Publications page',
    permissions: [
      {
        scope: SCOPES.STATS_READ,
        short: 'View',
        label: 'View publication stats',
        hint: 'Totals, charts, countries, platforms and the publications list'
      },
      {
        scope: SCOPES.STATS_REASONS,
        short: 'Failure reasons',
        label: 'See why publications failed',
        hint: 'Shows failure reasons in charts, the list and exports'
      }
    ]
  },
  {
    id: 'routing-numbers',
    title: 'Routing numbers',
    description: 'Phone numbers that receive RelaySMS messages',
    permissions: [
      { scope: SCOPES.GC_READ, short: 'View', label: 'View routing numbers', hint: 'See numbers, countries, operators and protocols' },
      { scope: SCOPES.GC_WRITE, short: 'Manage', label: 'Manage routing numbers', hint: 'Add, edit and remove numbers' }
    ]
  },
  {
    id: 'platforms',
    title: 'Platforms',
    description: 'Services the Publisher posts to, such as Gmail or Telegram',
    permissions: [
      { scope: SCOPES.PLATFORMS_READ, short: 'View', label: 'View platforms', hint: 'See installed platforms and how they work' },
      { scope: SCOPES.PLATFORMS_WRITE, short: 'Manage', label: 'Manage platforms', hint: 'Change and remove platforms' }
    ]
  },
  {
    id: 'users',
    title: 'Users',
    description: 'Who can sign in to this dashboard and the API',
    permissions: [
      { scope: SCOPES.CREDS_READ, short: 'View', label: 'View users', hint: 'See users, their access and when they last signed in' },
      {
        scope: SCOPES.CREDS_WRITE,
        short: 'Manage',
        label: 'Manage users',
        hint: 'Add and remove users, change their access, reset passwords and sign them out'
      }
    ]
  },
  {
    id: 'logs',
    title: 'Logs',
    description: 'Who signed in and what changed',
    permissions: [
      {
        scope: SCOPES.AUDIT_READ,
        short: 'View',
        label: 'View logs',
        hint: 'See sign-ins and changes, for the areas they can view (users, routing numbers, platforms)'
      }
    ]
  }
];

export const PERMISSION_LABELS = Object.fromEntries(
  PERMISSION_GROUPS.flatMap((group) => group.permissions.map((permission) => [permission.scope, permission.label]))
);

const WRITE_SCOPES = [SCOPES.GC_WRITE, SCOPES.PLATFORMS_WRITE, SCOPES.CREDS_WRITE];

export function roleOf(credential) {
  if (credential.administrator) return 'Administrator';
  return credential.scopes.some((scope) => WRITE_SCOPES.includes(scope)) ? 'Editor' : 'Viewer';
}

export const SCOPE_REQUIRES = {
  [SCOPES.STATS_REASONS]: SCOPES.STATS_READ,
  [SCOPES.GC_WRITE]: SCOPES.GC_READ,
  [SCOPES.PLATFORMS_WRITE]: SCOPES.PLATFORMS_READ,
  [SCOPES.CREDS_WRITE]: SCOPES.CREDS_READ
};

export const ALL_SCOPES = Object.values(SCOPES);

export function withRequiredScopes(scopes) {
  const result = new Set(scopes);
  scopes.forEach((scope) => SCOPE_REQUIRES[scope] && result.add(SCOPE_REQUIRES[scope]));
  return ALL_SCOPES.filter((scope) => result.has(scope));
}

export function withoutOrphanedScopes(scopes) {
  return scopes.filter((scope) => !SCOPE_REQUIRES[scope] || scopes.includes(SCOPE_REQUIRES[scope]));
}
