import datFetch from 'dat-fetch';

export default async function({ url }, callback) {
  const core = await global.loadCore();
  const fetch = datFetch(core.sdk);

  const response = await fetch(url);

  const { status: statusCode, body: data, headers: responseHeaders } = response;
  const headers = {};

  for (const [key, value] of responseHeaders) {
    headers[key] = value;
  }

  callback({
    statusCode,
    headers,
    data
  });
}
