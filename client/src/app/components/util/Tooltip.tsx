import React, { ReactNode, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  message: string;
  children: ReactNode;
}

export default function Tooltip({ message, children }: TooltipProps) {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const { top, left, height } = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: top + height + window.scrollY + 8,
      left: left + window.scrollX,
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {isVisible && createPortal(
        <div
          ref={tooltipRef}
          style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
          className="flex-col flex items-center absolute z-10 rounded-lg bg-gray-800 px-3 py-2 text-xs font-medium text-white shadow-lg"
        >
          <div className="-mt-4 absolute  clip-bottom h-2 w-4 bg-gray-800 ..."></div>
          <div className="text-center">{message}</div>
        </div>,
        document.body
      )}
    </div>
  );
}
