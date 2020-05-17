export const PROTOCOL_SCHEME = 'natakanu://';
export const PROJECT_PATH = new RegExp(
  `^${PROTOCOL_SCHEME}project/([^/]+)(.*)`
);
export const ACCOUNT_PATH = new RegExp(
  `^${PROTOCOL_SCHEME}account/([^/]+)(.*)`
);

export function parseURL(url) {
  let match = null;
  if (!url.startsWith(PROTOCOL_SCHEME)) {
    return {
      type: 'name',
      key: url,
      path: '/'
    };
  }

  match = url.match(PROJECT_PATH);
  if (match) {
    return {
      type: 'project',
      key: match[1],
      path: match[2] || '/'
    };
  }

  match = url.match(ACCOUNT_PATH);
  if (match) {
    return {
      type: 'account',
      key: match[1],
      path: match[2] || '/'
    };
  }
}

export function encodeProject(key, path = '/') {
  return `${PROTOCOL_SCHEME}project/${key.toString('hex')}${path}`;
}

export function encodeAccount(key, path = '/') {
  return `${PROTOCOL_SCHEME}/account/${key.toString('hex')}${path}`;
}
