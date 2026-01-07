import React, { useCallback, useMemo } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

// Full-bleed particles canvas that fits its parent (not full screen)
// Usage: wrap a relatively positioned container and place this as the first child.
export default function ParticlesBackground({ className = '' }) {
  const init = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(() => ({
    fullScreen: false,
    background: { color: 'transparent' },
    fpsLimit: 60,
    detectRetina: true,
    particles: {
      number: { value: 90, density: { enable: true, area: 800 } },
      // 更丰富的颜色：多色并开启轻微色相动画
      color: {
        value: ['#ff6b6b', '#f7b801', '#6bcb77', '#4d96ff', '#b388eb'],
        animation: { enable: true, speed: 10, sync: false }
      },
      opacity: { value: 0.25 },
      size: { value: { min: 1, max: 3 } },
      links: {
        enable: true,
        distance: 90,
        color: { value: ['#ff6b6b', '#f7b801', '#6bcb77', '#4d96ff', '#b388eb'] },
        opacity: 0.25,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1.0,
        direction: 'none',
        outModes: { default: 'out' },
      },
      shape: { type: 'circle' },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
        resize: true,
      },
      modes: {
        repulse: { distance: 120, duration: 0.3 },
      },
    },
  }), []);

  return (
    <div className={`particles-bg ${className}`}>
      <Particles id="tsparticles" init={init} options={options} />
    </div>
  );
}
