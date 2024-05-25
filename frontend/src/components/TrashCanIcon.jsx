import React, { useEffect, useRef, useState } from 'react';

const TrashCanIcon = ({ color, progressColor, progress, className, darkMode }) => {
  const [previousProgress, setPreviousProgress] = useState(progress);
  const stop1Ref = useRef(null);
  const stop2Ref = useRef(null);

  useEffect(() => {
    const stop1 = stop1Ref.current;
    const stop2 = stop2Ref.current;

    if (stop1 && stop2) {
      // Update the stop offsets and colors
      stop1.setAttribute('offset', `0.${progress}`);
      stop1.setAttribute('stop-color', progressColor);

      stop2.setAttribute('offset', `0.${progress}`);
      stop2.setAttribute('stop-color', color);

      // Restart animations
      const animate1 = stop1.querySelector('animate');
      const animate2 = stop2.querySelector('animate');

      if (animate1 && animate2) {
        animate1.setAttribute('values', `0.${previousProgress - 5};0.${progress - 5}`);
        animate1.beginElement();

        animate2.setAttribute('values', `0.${previousProgress};0.${progress}`);
        animate2.beginElement();
      }
    }
    setPreviousProgress(progress);
  }, [color, progressColor, progress]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2 -2 452 520"
      className={className}
    > 
      <defs>
        <linearGradient id="lg" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset={`0.${progress}`} stopColor={progressColor} ref={stop1Ref}>
            <animate attributeName="offset" dur="1s" values={`0;0.${progress - 5}`} fill="freeze" />
          </stop>
          <stop offset={`0.${progress}`} stopColor={color} ref={stop2Ref}>
            <animate attributeName="offset" dur="1s" values={`0;0.${progress}`} fill="freeze" />
          </stop>
        </linearGradient>
      </defs>
      <path
        fill={`url(#lg)`}
        stroke="black"
        strokeWidth={darkMode ? "0" : "2"}
        d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
      />
    </svg>
  );
};

export default TrashCanIcon;
