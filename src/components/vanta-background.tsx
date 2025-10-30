
'use client';

import { useState, useEffect, useRef } from 'react';

// Dynamically load the scripts
const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error(`Script load error for ${src}`));
    document.body.appendChild(script);
  });
};


const VantaBackground = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    let effect: any;
    
    const initVanta = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js');

        if ((window as any).VANTA && (window as any).VANTA.BIRDS && (window as any).THREE && vantaRef.current && !vantaEffect) {
          effect = (window as any).VANTA.BIRDS({
            el: vantaRef.current,
            THREE: (window as any).THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color1: 0x22ff,
            backgroundColor: 0x0,
          });
          setVantaEffect(effect);
        }
      } catch (error) {
        console.error('Vanta.js script loading failed:', error);
      }
    };
    
    initVanta();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={vantaRef} className="absolute inset-0 z-0 h-full w-full" />;
};

export default VantaBackground;
