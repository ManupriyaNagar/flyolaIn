"use client";

import { useEffect, useState } from 'react';

export function usePerformance() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    isLoading: true
  });

  useEffect(() => {
    const startTime = performance.now();
    
    // Measure initial load time
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({
        ...prev,
        loadTime,
        isLoading: false
      }));
    };

    // Measure render time
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const renderTime = entries.reduce((acc, entry) => acc + entry.duration, 0);
      setMetrics(prev => ({
        ...prev,
        renderTime
      }));
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
      observer.disconnect();
    };
  }, []);

  return metrics;
}

export function useImagePreloader(imageSources) {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageSources || imageSources.length === 0) {
      setIsLoading(false);
      return;
    }

    const imagePromises = imageSources.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, src]));
          resolve(src);
        };
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.allSettled(imagePromises).then(() => {
      setIsLoading(false);
    });
  }, [imageSources]);

  return { loadedImages, isLoading };
}