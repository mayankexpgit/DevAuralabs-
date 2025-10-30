
'use client';

import React from 'react';

export const RippleEffect: React.FC = () => {
  const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    ripple.classList.add("ripple");
    
    // Check if a ripple element already exists and remove it
    const rippleEffect = button.getElementsByClassName("ripple")[0];
    if (rippleEffect) {
      rippleEffect.remove();
    }
    
    button.appendChild(ripple);

    // Remove the ripple element after the animation is done
    setTimeout(() => {
        if(ripple.parentElement) {
            ripple.remove();
        }
    }, 700);
  };

  return (
    <div
      className="absolute inset-0"
      onClick={createRipple}
    />
  );
};
