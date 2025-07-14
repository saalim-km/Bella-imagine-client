// src/hooks/useInfiniteScroll.ts
import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';

const useInfiniteScroll = (callback: () => void) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const sentinel = sentinelRef.current; // ✅ capture once
  const handleIntersection = debounce((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback();
      }
    });
  }, 500);

  observerRef.current = new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  });

  if (sentinel) {
    observerRef.current.observe(sentinel);
  }

  return () => {
    if (observerRef.current && sentinel) {
      observerRef.current.unobserve(sentinel);
    }
    handleIntersection.cancel();
  };
}, [callback]);


  return sentinelRef;
};

export default useInfiniteScroll;