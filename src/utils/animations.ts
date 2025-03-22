export const staggeredAnimation = (index: number) => {
  return {
    opacity: 0,
    animation: `fadeIn 0.5s ease-out forwards ${index * 0.1}s`,
  };
};

export const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4 },
};

export const slideInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export const pulseAnimation = {
  animation: "pulse 2s infinite",
};
