"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function MPMap({ dots = [], lineColor = "#0ea5e9" }) {
  const svgRef = useRef(null);
  const { theme } = useTheme();

  const mpOutline = `
    M383.5,45.7 L396.8,62.3 413.2,70.4 422.1,86.8 417.9,108.3 430.5,126.7 
    426.2,147.1 410.3,160.8 392.0,162.4 374.1,152.9 361.3,136.0 350.4,113.5 
    354.9,91.4 371.6,76.5 Z
  `;

  const dottedSvg = new DottedMap({ height: 600, grid: "diagonal" }).getSVG({
    radius: 0.22,
    color: theme === "dark" ? "#FFFFFF40" : "#00000040",
    shape: "circle",
    clipPath: `<path d="${mpOutline}" />`,
    backgroundColor: theme === "dark" ? "black" : "white",
  });

  const projectPoint = (lat, lng) => ({
    x: ((lng - 74) / 8) * 800,
    y: ((26 - lat) / 7) * 600,
  });

  const createCurvedPath = (start, end) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M${start.x},${start.y} Q${midX},${midY} ${end.x},${end.y}`;
  };

  return (
    <div className="w-full aspect-[4/3] relative">
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(dottedSvg)}`}
        alt="Madhya Pradesh Map"
        fill
        className="object-contain pointer-events-none select-none"
        draggable={false}
      />

      <svg ref={svgRef} viewBox="0 0 800 600" className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => {
          const start = projectPoint(dot.start.lat, dot.start.lng);
          const end = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={i}>
              <motion.path
                d={createCurvedPath(start, end)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.5, ease: "easeOut" }}
              />
              {[start, end].map((p, idx) => (
                <circle key={idx} cx={p.x} cy={p.y} r="4" fill={lineColor} />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
