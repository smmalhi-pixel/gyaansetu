const CACHE_KEY = 'gyaansetu_ai_cache';

export const getCache = () => {
  const saved = localStorage.getItem(CACHE_KEY);
  return saved ? JSON.parse(saved) : {};
};

export const getCachedResponse = (type, params) => {
  const cache = getCache();
  const cacheKey = `${type}_${JSON.stringify(params)}`;
  return cache[cacheKey] || null;
};

export const setCachedResponse = (type, params, data) => {
  const cache = getCache();
  const cacheKey = `${type}_${JSON.stringify(params)}`;
  cache[cacheKey] = { data, timestamp: Date.now() };
  
  // Keep only last 50 cached items
  const keys = Object.keys(cache);
  if (keys.length > 50) {
    const oldest = keys.sort((a, b) => cache[a].timestamp - cache[b].timestamp)[0];
    delete cache[oldest];
  }
  
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

export const clearCache = () => {
  localStorage.removeItem(CACHE_KEY);
};