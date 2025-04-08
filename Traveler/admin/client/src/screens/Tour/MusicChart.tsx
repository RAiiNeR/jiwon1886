import React from 'react';
import { Play, Pause } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  duration: string;
}

interface MusicChartProps {
  songs: Song[];
  title?: string;
}

const MusicChart: React.FC<MusicChartProps> = ({ songs, title = "음악 차트" }) => {
  const [playingId, setPlayingId] = React.useState<string | null>(null);

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="card">
      <div className="card-header py-3">
        <h6 className="m-0 fw-bold">{title}</h6>
      </div>
      <div className="card-body">
        <ul className="list-group list-group-flush">
          {songs.map((song, index) => (
            <li key={song.id} className="list-group-item d-flex align-items-center py-3 px-2 border-bottom">
              <div className="me-3 fs-5 fw-bold text-muted" style={{ width: '30px' }}>
                {index + 1}
              </div>
              <div className="me-3" style={{ width: '50px', height: '50px' }}>
                <img src={`.${song.albumCover}` || "/placeholder.svg"} alt={`${song.title} 앨범 커버`} className="img-fluid rounded" />
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-0 fw-bold">{song.title}</h6>
                <small className="text-muted">{song.artist}</small>
              </div>
              <div className="text-muted me-3">{song.duration}</div>
              <button 
                className="btn btn-outline-secondary btn-sm rounded-circle"
                onClick={() => togglePlay(song.id)}
                aria-label={playingId === song.id ? "일시정지" : "재생"}
              >
                {playingId === song.id ? <Pause size={18} /> : <Play size={18} />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MusicChart;