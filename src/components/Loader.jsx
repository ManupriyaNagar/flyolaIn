"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { FaPlane } from "react-icons/fa";
import Image from "next/image";

export default function Loader({ onLoadingComplete = () => {} }) {
  const controls = useAnimation();
  const progress = useMotionValue(0);
  const width = useTransform(progress, (v) => `${v}%`);

  // track mounted state so we don't call controls.start after unmount
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // 1) immediately set the "initial" state
    controls.set("initial");

    // 2) then kick off the looped "animate" variant
    controls.start("animate");

    let startTs = null;
    let rafId;
    const step = (ts) => {
      if (!isMounted.current) return;

      if (startTs === null) startTs = ts;
      const elapsed = ts - startTs;
      const pct = Math.min((elapsed / 1000) * 20, 100);
      progress.set(pct);

      if (pct < 100) {
        rafId = requestAnimationFrame(step);
      } else {
        // once we hit 100%, fade out
        controls.start("exit").then(() => {
          if (isMounted.current) onLoadingComplete();
        });
      }
    };

    rafId = requestAnimationFrame(step);

    // tidy up if unmounted mid-load
    return () => cancelAnimationFrame(rafId);
  }, [controls, onLoadingComplete, progress]);

  return (
    <motion.div
      variants={{
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.3 } },
      }}
      initial="initial"
      animate={controls}
      exit="exit"
      className="fixed inset-0 flex flex-col items-center justify-center bg-blue-400 z-50"
    >
      {/* your runway & plane SVG + logo + progress bar */}
      <style jsx>{`
        @keyframes runwayDash {
          to {
            stroke-dashoffset: -80;
          }
        }
        .runway {
          stroke-dasharray: 15;
          stroke-dashoffset: 0;
          animation: runwayDash 1.2s linear infinite;
        }
      `}</style>

      <div className="relative w-56 h-40 flex items-center justify-center">
        {/* cloud behind plane */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 0.6, x: -40 }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute top-4"
        >
          <svg width="36" height="18" viewBox="0 0 36 18" fill="white">
            <path
              d="M8 14a4 4 0 100-8h20a4 4 0 100 8H8z"
              opacity="0.6"
            />
          </svg>
        </motion.div>

        {/* animated plane */}
        <motion.div
          variants={{
            initial: { x: -80, y: 0 },
            animate: {
              x: 80,
              y: [-8, 8, -8],
              transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
            },
          }}
          initial="initial"
          animate={controls}
        >
          <FaPlane className="text-yellow-400 text-3xl" />
        </motion.div>

        {/* runway line */}
        <svg
          className="absolute bottom-0 w-full h-10"
          viewBox="0 0 80 16"
        >
          <line
            x1="0"
            y1="8"
            x2="80"
            y2="8"
            stroke="white"
            strokeWidth="1.5"
            className="runway"
          />
        </svg>
      </div>

      {/* logo fade‐in */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mt-3 mb-5 ml-10"
      >
        <Image
          src="/logo-04.png"
          alt="Flyola Logo"
          width={100}
          height={50}
          priority
          quality={70}
        />
      </motion.div>

      {/* progress bar */}
      <div className="w-40 h-1.5 bg-gray-300 rounded-full overflow-hidden">
        <motion.div
          style={{ width }}
          className="h-full bg-yellow-400"
        />
      </div>

      {/* loading text */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-3 text-white text-base font-medium"
      >
        {progress.get() < 100 ? "Preparing…" : "Ready!"}
      </motion.p>
    </motion.div>
  );
}
