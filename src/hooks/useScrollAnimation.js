import { useEffect, useRef, useState, useCallback } from 'react';

const easings = {
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
};

export const useScrollAnimation = (threshold = 0.05) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      const fallbackTimer = window.setTimeout(() => setIsVisible(true), 0);
      return () => window.clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el); // stop watching after first trigger
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -12% 0px',
      }
    );

    const fallbackTimer = window.setTimeout(() => {
      setIsVisible(true);
      observer.unobserve(el);
    }, 900);

    observer.observe(el);
    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, isVisible };
};

export const useCountUp = (target, duration = 1200, isVisible = true) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const startValueRef = useRef(0);

  const animate = useCallback(
    function animateFrame(timestamp) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easings.easeOutExpo(progress);

      const current = Math.round(startValueRef.current + (target - startValueRef.current) * eased);
      setCount(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateFrame);
      } else {
        setCount(target);
      }
    },
    [target, duration]
  );

  useEffect(() => {
    if (!isVisible) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = null;
    startValueRef.current = 0;

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, target, animate]);

  return count;
};