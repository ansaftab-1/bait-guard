import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

/**
 * AnimatedLottieIcon Component
 * Renders Lottie alert and warning animations with dynamic color filters.
 *
 * @param {'alert' | 'warning' | 'station'} type - Icon type
 * @param {number} [size=36] - Icon size in px
 * @param {'purple' | 'red' | 'amber' | 'emerald' | 'none'} [colorTint='none'] - Color filter tint
 */
export default function AnimatedLottieIcon({
  type = 'alert',
  size = 36,
  colorTint = 'none',
  className = '',
  src: customSrc,
}) {
  const alertLottieSrc = 'https://lottie.host/694b3c7b-87ed-45d1-94ac-91f367627fa8/nZWLeJ92bJ.lottie';
  const warningLottieSrc = 'https://lottie.host/3cefe3cc-1a33-4d48-b619-0b32466c3b0b/yI14TSYJMy.lottie';
  const assignedLottieSrc = 'https://lottie.host/6d460368-8305-4eb1-bec6-a2c16699a417/q5MaWTpN7Y.json';
  const pendingLottieSrc = 'https://lottie.host/06d2952e-e852-4328-8eb4-2660275b2c2c/XLhGeGozz9.lottie';
  const genericAlertLottieSrc = 'https://lottie.host/886816aa-d48d-4852-8eff-e173b4cefc30/tHHrVYh7h4.json';

  let src = customSrc;
  if (!src) {
    if (type === 'assigned') {
      src = assignedLottieSrc;
    } else if (type === 'pending') {
      src = pendingLottieSrc;
    } else if (type === 'pulseAlert') {
      src = genericAlertLottieSrc;
    } else if (type === 'alert') {
      src = alertLottieSrc;
    } else {
      src = warningLottieSrc;
    }
  }

  // CSS Filter for color modification
  let filterStyle = {};
  if (colorTint === 'purple' || type === 'station') {
    filterStyle = { filter: 'hue-rotate(220deg) saturate(1.8) brightness(0.95)' };
  } else if (colorTint === 'red') {
    filterStyle = { filter: 'hue-rotate(330deg) saturate(2) brightness(0.9)' };
  } else if (colorTint === 'amber') {
    filterStyle = { filter: 'hue-rotate(15deg) saturate(2)' };
  } else if (colorTint === 'emerald') {
    filterStyle = { filter: 'hue-rotate(90deg) saturate(2)' };
  } else if (colorTint === 'gray') {
    filterStyle = { filter: 'grayscale(1) opacity(0.6)' };
  }

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 pointer-events-none select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...filterStyle,
      }}
    >
      <DotLottieReact
        src={src}
        loop
        autoplay
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
