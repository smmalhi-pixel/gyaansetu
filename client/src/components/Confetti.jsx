import { useEffect, useState } from 'react';

function Confetti({ onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#f97316', '#ef4444', '#22c55e', '#3b82f6', '#eab308', '#8b5cf6', '#ec4899', '#06b6d4'];
    const newParticles = [];
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.5,
        duration: Math.random() * 1 + 1.5,
        rotation: Math.random() * 360,
      });
    }
    
    setParticles(newParticles);
    
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default Confetti;