import defaultServerPort from './defaultServerPort';
const corsServer = `http://localhost:${defaultServerPort}`;

export default function corsFetch(url, options) {
  const corsUrl = `${corsServer}/cors?url=${encodeURIComponent(url)}`;

  return fetch(corsUrl, options);
}
