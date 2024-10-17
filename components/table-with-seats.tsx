"use client"

import React, { useState, useEffect } from "react";

interface TableWithSeatsProps {
  seats: number;
  tableColor?: string;
  seatColor?: string;
  maxSize?: number;
}

export default function TableWithSeats(
  {
    seats,
    tableColor = "#8B4513",
    seatColor = "#6D4C41",
    maxSize = 300,
  }: TableWithSeatsProps = { seats: 4 }
) {
  const [size, setSize] = useState(maxSize);

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      if (viewportWidth <= 350) {
        setSize(Math.min(viewportWidth * 0.8, maxSize));
      } else {
        setSize(maxSize);
      }
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [maxSize]);

  const centerX = size / 2;
  const centerY = size / 2;
  const tableRadius = size * 0.35;
  const seatWidth = size * 0.12;
  const seatDepth = size * 0.1;
  const seatDistance = tableRadius + seatDepth / 2;

  const generateSeats = () => {
    return Array.from({ length: seats }, (_, index) => {
      const angle = (index / seats) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + seatDistance * Math.cos(angle);
      const y = centerY + seatDistance * Math.sin(angle);

      return (
        <g
          key={index}
          transform={`rotate(${angle * (180 / Math.PI) + 90} ${x} ${y})`}
        >
          {/* Chair base */}
          <rect
            x={x - seatWidth / 2}
            y={y - seatDepth / 2}
            width={seatWidth}
            height={seatDepth}
            fill={seatColor}
            rx={seatDepth / 4}
          />
          {/* Chair back */}
          <rect
            x={x - seatWidth / 2}
            y={y - seatDepth / 2 - seatDepth * 0.3}
            width={seatWidth}
            height={seatDepth * 0.3}
            fill={seatColor}
            rx={seatDepth / 8}
          />
          {/* Chair highlight */}
          <rect
            x={x - seatWidth / 2 + 2}
            y={y - seatDepth / 2 + 2}
            width={seatWidth - 4}
            height={seatDepth - 4}
            fill="rgba(255, 255, 255, 0.2)"
            rx={(seatDepth - 4) / 4}
          />
        </g>
      );
    });
  };

  return (
    <div className="flex items-center justify-center p-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Table shadow */}
        <circle
          cx={centerX}
          cy={centerY}
          r={tableRadius + 2}
          fill="rgba(0, 0, 0, 0.1)"
        />

        {/* Table */}
        <circle
          cx={centerX}
          cy={centerY}
          r={tableRadius}
          fill={tableColor}
          stroke={seatColor}
          strokeWidth="4"
        />

        {/* Table grain */}
        <circle
          cx={centerX}
          cy={centerY}
          r={tableRadius * 0.8}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="20"
        />

        {/* Seats */}
        {generateSeats()}
      </svg>
    </div>
  );
}