import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

/**
 * AnimatedBellIcon Component
 * Clean, borderless bell icon with state-specific Lottie animations:
 * 1. Muted State: https://lottie.host/553b6309-8bfb-46a9-b4ea-237f7b1fd01c/akmdUJDulH.lottie (High contrast & enlarged for vivid visibility)
 * 2. Unread Arrival State: https://lottie.host/6a4165e1-50c5-4784-aeb3-d836616561f7/Os9jdJQlNp.lottie
 * 3. No Notifications State (Sleeping Cat Bell): https://lottie.host/8a9e2d30-d4d9-438d-b15e-d418f170836a/LKDID44mm4.lottie
 */
export default function AnimatedBellIcon({
  pushEnabled = true,
  hasUnread = false,
  animateOnHover = true,
  size = 40,
  className = '',
}) {
  const [isRinging, setIsRinging] = useState(false);

  // Trigger brief ring animation on unread arrival
  useEffect(() => {
    if (pushEnabled && hasUnread) {
      setIsRinging(true);
      const timer = setTimeout(() => setIsRinging(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [hasUnread, pushEnabled]);

  // STATE 1: Push notifications disabled / muted (Vivid, high contrast purple bell)
  if (!pushEnabled) {
    return (
      <div className={`relative inline-flex items-center justify-center pointer-events-none ${className}`}>
        <DotLottieReact
          src="https://lottie.host/553b6309-8bfb-46a9-b4ea-237f7b1fd01c/akmdUJDulH.lottie"
          loop
          autoplay
          style={{
            width: `${size + 10}px`,
            height: `${size + 10}px`,
            transform: 'scale(1.85)',
            filter: 'contrast(1.4) brightness(0.85) drop-shadow(0 2px 4px rgba(124,58,237,0.25))',
          }}
        />
      </div>
    );
  }

  // STATE 2: Unread notifications exist or new notification arrived
  if (hasUnread || isRinging) {
    return (
      <div className={`relative inline-flex items-center justify-center pointer-events-none ${className}`}>
        <DotLottieReact
          src="https://lottie.host/6a4165e1-50c5-4784-aeb3-d836616561f7/Os9jdJQlNp.lottie"
          loop
          autoplay
          style={{
            width: `${size + 8}px`,
            height: `${size + 8}px`,
            transform: 'scale(1.15)',
          }}
        />
      </div>
    );
  }

  // STATE 3: No notifications (Animated Sleeping Cat Bell - Crisp & proportional)
  return (
    <div className={`relative inline-flex items-center justify-center pointer-events-none ${className}`}>
      <DotLottieReact
        src="https://lottie.host/8a9e2d30-d4d9-438d-b15e-d418f170836a/LKDID44mm4.lottie"
        loop
        autoplay
        style={{
          width: `${size + 6}px`,
          height: `${size + 6}px`,
          transform: 'scale(1.08)',
        }}
      />
    </div>
  );
}
