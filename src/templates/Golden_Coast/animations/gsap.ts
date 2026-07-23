import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Registers all required GSAP plugins
 * Call this function at the root of your application or inside a useLayoutEffect
 */
export const registerGSAP = () => {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
};

/**
 * A utility to create reusable scroll animations
 */
export const createScrollAnimation = (
  element: Element | string,
  vars: gsap.TweenVars
) => {
  return gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top center',
    },
    ...vars,
  });
};
