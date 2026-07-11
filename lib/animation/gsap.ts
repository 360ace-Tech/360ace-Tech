'use client';

/**
 * Single GSAP registration hub. Every animated component imports gsap and
 * plugins from here — never from 'gsap' directly — so plugin registration
 * happens exactly once.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };
