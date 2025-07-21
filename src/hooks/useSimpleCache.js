"use client";

import { useState, useEffect } from 'react';

export function useSimpleCache(key, fetchFunction, cacheTime = 300000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check cache first
        const cached = sessionStorage.getItem(key);
        const cacheTimestamp = sessionStorage.getItem(`${key}_time`);
        
        if (cached && cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < cacheTime) {
          setData(JSON.parse(cached));
          setLoading(false);
          return;
        }

        // Fetch new data
        setLoading(true);
        const result = await fetchFunction();
        
        // Cache the result
        sessionStorage.setItem(key, JSON.stringify(result));
        sessionStorage.setItem(`${key}_time`, Date.now().toString());
        
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, fetchFunction, cacheTime]);

  return { data, loading, error };
}