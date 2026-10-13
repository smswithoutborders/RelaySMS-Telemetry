// ==============================|| AUDIT LOG - WORDING ||============================== //

import { PERMISSION_LABELS, SCOPES } from 'utils/scopes';
import { AUDIT_ACTIONS, AUDIT_AREAS, AUDIT_OUTCOMES, FAILED_LOGIN_LABEL, GATEWAY_CLIENT_FIELDS, label } from 'utils/backendLabels';

// Wording lives in utils/backendLabels; re-exported so pages keep one import.
export { AUDIT_ACTIONS, AUDIT_AREAS };

// The Publisher's AREA_SCOPES: reading an area's events also needs that area's view permission.
export const AREA_SCOPES = {
  auth: SCOPES.CREDS_READ,
  creds: SCOPES.CREDS_READ,
  platforms: SCOPES.PLATFORMS_READ,
  gateway_clients: SCOPES.GC_READ
};

export function actionLabel(event) {
  if (event.action === 'auth.login' && event.outcome === 'failed') return FAILED_LOGIN_LABEL;
  return AUDIT_ACTIONS[event.action]?.label ?? event.action;
}

export function actionArea(action) {
  return AUDIT_ACTIONS[action]?.area ?? action?.split('.')[0];
}

// Sign-in and user events target a username.
export function targetIsUser(action) {
  const area = actionArea(action);
  return area === 'auth' || area === 'creds';
}

// Labels live in utils/backendLabels.
export const OUTCOMES = AUDIT_OUTCOMES;

const permissionNames = (scopes) => scopes.map((scope) => PERMISSION_LABELS[scope] || scope).join(', ');

// A one-line summary of `details`, or '' when there's nothing worth saying. The raw JSON stays one click away.
export function describeDetails(event) {
  const d = event.details || {};
  const parts = [];

  if (event.outcome === 'denied') parts.push(d.reason ? `Not allowed: ${d.reason}` : 'Not allowed');
  if (event.action === 'auth.login' && event.outcome === 'failed') parts.push('Wrong password or disabled account');

  switch (event.action) {
    case 'auth.login':
    case 'auth.logout':
      if (d.method) parts.push(`Via ${label.loginMethod(d.method)}`);
      break;
    case 'creds.create':
      if (Array.isArray(d.scopes)) parts.push(d.scopes.length ? `With: ${permissionNames(d.scopes)}` : 'With no permissions');
      break;
    case 'creds.update':
      if (d.scopes?.added?.length) parts.push(`Gave: ${permissionNames(d.scopes.added)}`);
      if (d.scopes?.removed?.length) parts.push(`Took away: ${permissionNames(d.scopes.removed)}`);
      if (d.active === true) parts.push('Enabled');
      if (d.active === false) parts.push('Disabled');
      break;
    case 'creds.revoke_sessions':
      if (typeof d.sessions === 'number') parts.push(`Ended ${d.sessions} session${d.sessions === 1 ? '' : 's'}`);
      break;
    case 'platforms.add':
      if (d.tag || d.commit) parts.push(`Version ${[d.tag, d.commit && `(${String(d.commit).slice(0, 7)})`].filter(Boolean).join(' ')}`);
      break;
    case 'platforms.update':
      if (d.to_tag || d.to_commit) {
        parts.push(`To ${[d.to_tag, d.to_commit && `(${String(d.to_commit).slice(0, 7)})`].filter(Boolean).join(' ')}`);
      }
      break;
    case 'platforms.remove':
      if (typeof d.linked_accounts === 'number') parts.push(`${d.linked_accounts} linked account${d.linked_accounts === 1 ? '' : 's'}`);
      break;
    case 'gateway_clients.create':
    case 'gateway_clients.delete':
      parts.push(
        [d.operator, d.country, Array.isArray(d.protocols) && d.protocols.map(label.protocol).join(', ')].filter(Boolean).join(', ')
      );
      break;
    case 'gateway_clients.update':
      // { field: { from, to } } for each changed field.
      Object.entries(d).forEach(([field, change]) => {
        if (!change || typeof change !== 'object' || !('to' in change)) return;
        const show = (value) => (Array.isArray(value) ? value.join(', ') : (value ?? '—'));
        parts.push(`${GATEWAY_CLIENT_FIELDS[field] || field}: ${show(change.from)} → ${show(change.to)}`);
      });
      break;
    default:
      break;
  }
  return parts.filter(Boolean).join(' · ');
}
