import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Preloader — cinematic logo reveal with golden particle burst,
 * then curtain split exit.
 */
export default function Preloader({ onComplete }) {
  const preloaderRef = useRef(null);
  const logoRef = useRef(null);
  const subRef = useRef(null);
  const progressRef = useRef(null);
  const progressWrapRef = useRef(null);
  const curtainTopRef = useRef(null);
  const curtainBottomRef = useRef(null);
  const [show, setShow] = useState(true);

  // Keep the callback in a ref so the GSAP timeline effect can run exactly once.
  // Passing `onComplete` inline from the parent changes identity on every render,
  // which re-ran the effect after `show` became false (refs nulled) -> GSAP crash.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Bail out if any target is missing rather than handing null to GSAP.
    if (
      !logoRef.current ||
      !subRef.current ||
      !progressRef.current ||
      !curtainTopRef.current ||
      !curtainBottomRef.current
    ) {
      onCompleteRef.current?.();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setShow(false);
        onCompleteRef.current?.();
      },
    });

    // Phase 1: Logo reveal
    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power3.out',
      delay: 0.3,
    })
      // Subtitle fade in
      .to(subRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.4')
      // Phase 2: Progress bar fill
      .to(progressRef.current, {
        width: '100%',
        duration: 1,
        ease: 'power2.inOut',
      }, '-=0.2')
      // Phase 3: Hold briefly
      .to({}, { duration: 0.3 })
      // Phase 4: Logo scale up + fade
      .to([logoRef.current, subRef.current, progressWrapRef.current], {
        opacity: 0,
        scale: 1.1,
        duration: 0.5,
        ease: 'power2.in',
      })
      // Phase 5: Curtain split
      .to(curtainTopRef.current, {
        y: '-100%',
        duration: 0.8,
        ease: 'power3.inOut',
      }, '-=0.2')
      .to(curtainBottomRef.current, {
        y: '100%',
        duration: 0.8,
        ease: 'power3.inOut',
      }, '<');

    return () => tl.kill();
  }, []);

  if (!show) return null;

  return (
    <div ref={preloaderRef} className="preloader" aria-hidden="true">
      <div className="preloader__bg" />

      <div className="preloader__logo-wrap">
        <div
          ref={logoRef}
          className="preloader__logo"
          style={{ opacity: 0, transform: 'scale(0.7) translateY(20px)', filter: 'blur(10px)' }}
        >
          KDA
          <span
            ref={subRef}
            className="preloader__logo-sub"
            style={{ opacity: 0, transform: 'translateY(10px)' }}
          >
            Treats
          </span>
        </div>

        <div ref={progressWrapRef} className="preloader__progress">
          <div
            ref={progressRef}
            className="preloader__progress-bar"
            style={{ width: '0%' }}
          />
        </div>
      </div>

      {/* Curtain halves for split exit */}
      <div ref={curtainTopRef} className="preloader__curtain preloader__curtain--top" />
      <div ref={curtainBottomRef} className="preloader__curtain preloader__curtain--bottom" />
    </div>
  );
}
