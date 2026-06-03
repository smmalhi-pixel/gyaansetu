import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';

function MusicPlayer() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  const tracks = [
    { title: 'Lo-Fi Study', artist: 'GyaanSetu', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: 'Calm Focus', artist: 'GyaanSetu', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { title: 'Deep Work', artist: 'GyaanSetu', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { title: 'Night Study', artist: 'GyaanSetu', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  ];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % tracks.length;
    setCurrentTrack(next);
    setIsPlaying(false);
    setTimeout(() => {
      audioRef.current?.play();
      setIsPlaying(true);
    }, 100);
  };

  const prevTrack = () => {
    const prev = (currentTrack - 1 + tracks.length) % tracks.length;
    setCurrentTrack(prev);
    setIsPlaying(false);
    setTimeout(() => {
      audioRef.current?.play();
      setIsPlaying(true);
    }, 100);
  };

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors page-enter">
      <header className="bg-indigo-500 dark:bg-indigo-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={() => navigate('/')} className="p-1"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2"><Music size={24} /><h1 className="font-bold text-lg">Study Music</h1></div>
      </header>

      <div className="p-4 max-w-md mx-auto space-y-6 pt-10">
        {/* Album Art */}
        <div className="flex justify-center">
          <div className={`w-48 h-48 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
            <Music size={64} className="text-white opacity-50" />
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{tracks[currentTrack].title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{tracks[currentTrack].artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full w-0" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button onClick={prevTrack} className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"><SkipBack size={24} /></button>
          <button onClick={togglePlay} className="p-5 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition-all transform hover:scale-105">{isPlaying ? <Pause size={28} /> : <Play size={28} />}</button>
          <button onClick={nextTrack} className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"><SkipForward size={24} /></button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 justify-center">
          <Volume2 size={18} className="text-gray-400" />
          <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolume} className="w-32 accent-indigo-500" />
        </div>

        {/* Track List */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Playlist</h3>
          {tracks.map((track, i) => (
            <button
              key={i}
              onClick={() => { setCurrentTrack(i); setIsPlaying(false); setTimeout(() => { audioRef.current?.play(); setIsPlaying(true); }, 100); }}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${currentTrack === i ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-300' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent'}`}
            >
              <Music size={18} className={currentTrack === i ? 'text-indigo-500' : 'text-gray-400'} />
              <div className="text-left">
                <p className="font-medium text-sm text-gray-800 dark:text-white">{track.title}</p>
                <p className="text-xs text-gray-400">{track.artist}</p>
              </div>
              {currentTrack === i && isPlaying && <span className="ml-auto text-indigo-500 text-xs">▶ Playing</span>}
            </button>
          ))}
        </div>
      </div>

      <audio ref={audioRef} src={tracks[currentTrack].url} onEnded={nextTrack} />
    </div>
  );
}

export default MusicPlayer;