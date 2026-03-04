import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { MissionCategory } from "../../lib/types";
import { WHEEL_CATEGORIES } from "../../lib/gameLogic";
import { Button } from "../ui/Button";

interface WheelSpinnerProps {
  onResult: (category: MissionCategory) => void;
  disabled?: boolean;
}

const SEGMENT_COLORS = [
  "#FF10F0", // pink - solo
  "#00D4FF", // blue - duo
  "#39FF14", // green - group
  "#FFD700", // gold - truth
  "#FF3131", // red - skill
  "#A855F7", // purple - speed
  "#F97316", // orange - secret
];

const SEGMENT_ANGLE = 360 / 7;

export function WheelSpinner({ onResult, disabled }: WheelSpinnerProps) {
  const { t } = useTranslation("game");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const spin = useCallback(() => {
    if (spinning || disabled) return;
    setSpinning(true);

    // 3-5 full rotations + random offset
    const extraRotations = (3 + Math.random() * 2) * 360;
    const randomOffset = Math.random() * 360;
    const newRotation = rotation + extraRotations + randomOffset;
    setRotation(newRotation);

    setTimeout(() => {
      // Calculate which segment the pointer lands on
      const normalizedAngle = ((newRotation % 360) + 360) % 360;
      const segmentIndex = Math.floor(normalizedAngle / SEGMENT_ANGLE) % 7;
      const category = WHEEL_CATEGORIES[segmentIndex]!;
      setSpinning(false);
      onResult(category);
    }, 3000);
  }, [spinning, disabled, rotation, onResult]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Pointer */}
      <div className="relative">
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 text-2xl">
          ▼
        </div>

        {/* Wheel */}
        <motion.svg
          width={280}
          height={280}
          viewBox="0 0 280 280"
          animate={{ rotate: rotation }}
          transition={{
            duration: 3,
            ease: [0.15, 0.85, 0.25, 1],
          }}
          className="drop-shadow-[0_0_30px_rgba(255,16,240,0.3)]"
        >
          {WHEEL_CATEGORIES.map((category, i) => {
            const startAngle = i * SEGMENT_ANGLE - 90;
            const endAngle = startAngle + SEGMENT_ANGLE;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const cx = 140, cy = 140, r = 130;

            const x1 = cx + r * Math.cos(startRad);
            const y1 = cy + r * Math.sin(startRad);
            const x2 = cx + r * Math.cos(endRad);
            const y2 = cy + r * Math.sin(endRad);

            const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
            const labelR = r * 0.65;
            const lx = cx + labelR * Math.cos(midAngle);
            const ly = cy + labelR * Math.sin(midAngle);

            return (
              <g key={category}>
                <path
                  d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
                  fill={SEGMENT_COLORS[i]}
                  stroke="#0A0A0A"
                  strokeWidth={2}
                  opacity={0.85}
                />
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={10}
                  fontWeight="bold"
                  transform={`rotate(${(startAngle + endAngle) / 2 + 90}, ${lx}, ${ly})`}
                >
                  {t(`categories.${category}`)}
                </text>
              </g>
            );
          })}
          {/* Center circle */}
          <circle cx={140} cy={140} r={20} fill="#1A0B2E" stroke="#FF10F0" strokeWidth={2} />
        </motion.svg>
      </div>

      <Button
        variant="primary"
        size="lg"
        glow
        onClick={spin}
        disabled={spinning || disabled}
        className="min-w-[160px]"
      >
        {spinning ? t("spinning") : t("spin")}
      </Button>
    </div>
  );
}
