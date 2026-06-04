import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pen, Eraser, RotateCcw, Download, Circle } from 'lucide-react';
import { t } from '../utils/Language';

function Whiteboard() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const colors = ['#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff'];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth - 32;
    canvas.height = window.innerHeight - 200;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e) => { e.preventDefault(); const pos = getPos(e); setIsDrawing(true); setLastPos(pos); };
  const draw = (e) => { if (!isDrawing) return; e.preventDefault(); const canvas = canvasRef.current; const ctx = canvas.getContext('2d'); const pos = getPos(e); ctx.beginPath(); ctx.moveTo(lastPos.x, lastPos.y); ctx.lineTo(pos.x, pos.y); ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color; ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth; ctx.stroke(); setLastPos(pos); };
  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => { const canvas = canvasRef.current; const ctx = canvas.getContext('2d'); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); };
  const downloadCanvas = () => { const canvas = canvasRef.current; const link = document.createElement('a'); link.download = 'my-doodle.png'; link.href = canvas.toDataURL(); link.click(); };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-gray-800 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2 flex-1"><Pen size={24} /><h1 className="font-bold text-lg">{t('whiteboard')}</h1></div>
        <div className="flex gap-1">
          <button onClick={clearCanvas} className="p-2 rounded-full hover:bg-gray-700" title="Clear"><RotateCcw size={18} /></button>
          <button onClick={downloadCanvas} className="p-2 rounded-full hover:bg-gray-700" title="Download"><Download size={18} /></button>
        </div>
      </header>

      <div className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center gap-3 flex-wrap">
        <button onClick={() => setTool('pen')} className={`p-2 rounded-lg transition-colors ${tool === 'pen' ? 'bg-gray-200 dark:bg-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} title="Pen"><Pen size={20} className="text-gray-700 dark:text-gray-300" /></button>
        <button onClick={() => setTool('eraser')} className={`p-2 rounded-lg transition-colors ${tool === 'eraser' ? 'bg-gray-200 dark:bg-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} title="Eraser"><Eraser size={20} className="text-gray-700 dark:text-gray-300" /></button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
        {colors.map(c => (
          <button key={c} onClick={() => { setColor(c); setTool('pen'); }} className={`w-7 h-7 rounded-full border-2 transition-all ${color === c && tool === 'pen' ? 'border-gray-800 dark:border-white scale-110' : 'border-gray-300 dark:border-gray-600'}`} style={{ backgroundColor: c }} />
        ))}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
        <div className="flex items-center gap-2">
          <Circle size={14} className="text-gray-400" />
          <input type="range" min="1" max="10" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-20" />
          <Circle size={22} className="text-gray-400" />
        </div>
      </div>

      <div className="p-4 flex justify-center">
        <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} className="border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg bg-white cursor-crosshair touch-none" />
      </div>
    </div>
  );
}

export default Whiteboard;
