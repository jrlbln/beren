"use client";

import { useMemo, useState } from "react";
import { Play, Pause } from "lucide-react";
import { getStrokePaths } from "@/lib/strokes";

type StrokeCanvasProps = {
  character: string;
  buttonPosition?: "top" | "bottom";
};

export function StrokeCanvas({ character, buttonPosition = "top" }: StrokeCanvasProps) {
  const strokes = useMemo(() => getStrokePaths(character), [character]);
  const [replayKey, setReplayKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setReplayKey((value) => value + 1);
      setIsPlaying(true);
    }
  };

  const button = (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        handlePlayPause();
      }}
      className="rounded-full bg-slate-900 p-2 text-white hover:bg-slate-800"
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {isPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-2">
      {buttonPosition === "top" && button}

      {/* SVG Canvas with Cross Guide */}
      <div className="relative flex items-center justify-center rounded-lg bg-white">
        {/* Cross Guide */}
        <div className="absolute inset-0 flex items-center justify-center rounded-lg">
          <div className="absolute h-full w-px bg-slate-200" />
          <div className="absolute h-px w-full bg-slate-200" />
        </div>

        {/* SVG Canvas */}
        <svg viewBox="0 0 109 109" className="relative z-10 h-24 w-24">
          {strokes.map((path, index) => (
            <path
              key={`${replayKey}-${index}-${path}`}
              d={path}
              fill="none"
              stroke="#1e293b"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 200,
                strokeDashoffset: 0,
                animation: isPlaying ? `strokeDraw 650ms ease forwards ${index * 200}ms` : "none",
              }}
            />
          ))}

          {/* Stroke Order Numbers */}
          {strokes.map((_, index) => {
            const positions = [
              { x: 15, y: 50 },
              { x: 50, y: 15 },
              { x: 85, y: 50 },
              { x: 50, y: 85 },
            ];
            const pos = positions[index % positions.length];

            return (
              <text
                key={`num-${index}`}
                x={pos.x}
                y={pos.y}
                fontSize="10"
                fill="#64748b"
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none"
              >
                {index + 1}
              </text>
            );
          })}
        </svg>
      </div>

      {buttonPosition === "bottom" && button}

      <style jsx>{`
        @keyframes strokeDraw {
          from {
            stroke-dashoffset: 200;
            opacity: 0.3;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
