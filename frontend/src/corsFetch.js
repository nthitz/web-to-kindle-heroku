import defaultServerPort from './defaultServerPort';
const host = process.env.REACT_APP_HOST || 'localhost';
const corsServer = `http://${host}:${defaultServerPort}`;

export default function corsFetch(url, options) {
  const corsUrl = `${corsServer}/cors?url=${encodeURIComponent(url)}`;

  return fetch(corsUrl, options);
}
