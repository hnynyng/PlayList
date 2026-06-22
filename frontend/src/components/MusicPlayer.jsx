import { useState, useEffect, useRef } from 'react';
import '../styles/MusicPlayer.css';

export default function MusicPlayer({ songs, currentSongIndex, onSongChange }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const audio = audioRef.current;
    audio.src = `http://localhost:5000${currentSong.file_path}`;
    audio.volume = volume;

    if (isPlaying) {
      audio.play().catch(err => console.error('Play error:', err));
    }
  }, [currentSong, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSongIndex, songs.length]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error('Play error:', err));
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentSongIndex > 0) {
      onSongChange(currentSongIndex - 1);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentSongIndex < songs.length - 1) {
      onSongChange(currentSongIndex + 1);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return <div className="player-empty">No songs to play</div>;
  }

  return (
    <div className="music-player">
      <audio ref={audioRef} />

      <div className="player-artwork">
        <div className="artwork-placeholder">🎵</div>
      </div>

      <div className="player-info">
        <h2>{currentSong.title}</h2>
        <p>{currentSong.artist}</p>
      </div>

      <div className="player-timeline">
        <span className="time">{formatTime(currentTime)}</span>
        <div className="progress-bar" onClick={handleSeek}>
          <div
            className="progress-fill"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <span className="time">{formatTime(duration)}</span>
      </div>

      <div className="player-controls">
        <button
          className="control-btn"
          onClick={handlePrevious}
          disabled={currentSongIndex === 0}
          title="Previous"
        >
          ⏮
        </button>
        <button
          className="control-btn play-btn"
          onClick={handlePlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          className="control-btn"
          onClick={handleNext}
          disabled={currentSongIndex === songs.length - 1}
          title="Next"
        >
          ⏭
        </button>
      </div>

      <div className="player-volume">
        <span>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
        <span>{Math.round(volume * 100)}%</span>
      </div>

      <div className="player-info-bottom">
        <span>
          {currentSongIndex + 1} / {songs.length}
        </span>
      </div>
    </div>
  );
}
