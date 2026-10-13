import adminApi from './admin';

// ==============================|| PUBLISHER API ||============================== //

// Drops empty filters and serializes dates; the API reads ISO-8601 and assumes UTC without an offset.
function cleanParams(params) {
  const result = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value) && value.length === 0) return;
    result[key] = typeof value?.toISOString === 'function' ? value.toISOString() : value;
  });
  return result;
}

// ---- publication stats ---- //

// filters: { since, until, status, platform_name, protocol, country_code }
export async function getPublicationSummary({ groupBy = ['status'], interval, filters = {} } = {}, config) {
  const { data } = await adminApi.get('stats/publications/summary', {
    ...config,
    params: cleanParams({ ...filters, group_by: groupBy, interval })
  });
  return data;
}

export async function listPublications({ filters = {}, limit = 50, cursor } = {}, config) {
  const { data } = await adminApi.get('stats/publications', {
    ...config,
    params: cleanParams({ ...filters, limit, cursor })
  });
  return {
    data: data.data,
    nextCursor: cursorFromLink(data.next),
    prevCursor: cursorFromLink(data.prev)
  };
}

// ---- audit log ---- //

// filters: { since, until, action, actor, target }. The API only returns areas the caller can view.
export async function listAuditEvents({ filters = {}, limit = 50, cursor } = {}, config) {
  const { data } = await adminApi.get('audit-events', {
    ...config,
    params: cleanParams({ ...filters, limit, cursor })
  });
  return {
    data: data.data,
    nextCursor: cursorFromLink(data.next),
    prevCursor: cursorFromLink(data.prev)
  };
}

function cursorFromLink(link) {
  if (!link) return null;
  try {
    return new URL(link, window.location.origin).searchParams.get('cursor');
  } catch {
    return null;
  }
}

// ---- catalog ---- //

export async function listPlatforms(config) {
  const { data } = await adminApi.get('platforms', config);
  return data;
}

// The registry: every client, disabled ones included, with who added and last changed it. Needs gc:read.
export async function listGatewayClientRegistry(config) {
  const { data } = await adminApi.get('gateway-clients/registry', config);
  return data;
}

// Country, operator and PLMN candidates for a number, to confirm before adding. Needs gc:write.
export async function suggestGatewayClient(msisdn, config) {
  const { data } = await adminApi.get('gateway-clients/registry/suggest', { ...config, params: { msisdn } });
  return data;
}

// Country, operator and operator code are resolved by the server when left out.
export async function createGatewayClient(client) {
  const { data } = await adminApi.post('gateway-clients/registry', cleanParams(client));
  return data;
}

// Concurrency: changes send If-Match with the ETag of the version the user was shown. Read it with the record when
// opening the dialog or action, not right before sending, or another admin's change in between is silently overwritten.
// A mismatch comes back as 412.

// The current registry entry and its ETag.
export async function getGatewayClient(id, config) {
  const response = await adminApi.get(`gateway-clients/registry/${encodeURIComponent(id)}`, config);
  return { client: response.data, etag: response.headers.etag };
}

// changes: any of { country, operator, operator_code, protocols, enabled }; omitted fields stay as they are.
export async function updateGatewayClient(id, changes, etag) {
  const { data } = await adminApi.patch(`gateway-clients/registry/${encodeURIComponent(id)}`, changes, {
    headers: { 'If-Match': etag }
  });
  return data;
}

export async function deleteGatewayClient(id, etag) {
  await adminApi.delete(`gateway-clients/registry/${encodeURIComponent(id)}`, { headers: { 'If-Match': etag } });
}

// Public list: enabled clients only, no login details.
export async function listGatewayClients(config) {
  const { data } = await adminApi.get('gateway-clients', config);
  return data;
}

// ---- credentials ---- //

export async function listCredentials(config) {
  const { data } = await adminApi.get('creds', config);
  return data;
}

export async function createCredential({ username, scopes }) {
  const { data } = await adminApi.post('creds', { username, scopes });
  return data;
}

// The current credential and its ETag (see the concurrency note above).
export async function getCredential(username, config) {
  const response = await adminApi.get(`creds/${encodeURIComponent(username)}`, config);
  return { credential: response.data, etag: response.headers.etag };
}

export async function updateCredential(username, changes, etag) {
  const { data } = await adminApi.patch(`creds/${encodeURIComponent(username)}`, changes, { headers: { 'If-Match': etag } });
  return data;
}

export async function resetCredentialPassword(username, etag) {
  const { data } = await adminApi.post(`creds/${encodeURIComponent(username)}/reset-password`, null, {
    headers: { 'If-Match': etag }
  });
  return data;
}

export async function revokeCredentialSessions(username) {
  await adminApi.post(`creds/${encodeURIComponent(username)}/revoke-sessions`);
}

export async function deleteCredential(username, etag) {
  await adminApi.delete(`creds/${encodeURIComponent(username)}`, { headers: { 'If-Match': etag } });
}
