import React, { useState, useEffect } from 'react';
import {
  Search,
  Music,
  Play,
  Pause,
  ArrowLeft,
  Radio,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { YOUTUBE_API_KEY } from '@/lib/supabase';
import { YouTubeSyncState } from '@/types';
import { useApp } from '@/contexts/AppContext';

interface YouTubeSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncState: YouTubeSyncState | null;
  onUpdateSync: (state: YouTubeSyncState) => void;
}

interface VideoSearchResult {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

// Músicas aconchegantes e típicas mineiras/brasileiras prontas para reprodução
const FEATURED_MG_TRACKS: VideoSearchResult[] = [
  {
    id: 'kC8oM0G-r1c',
    title: 'Clube da Esquina Nº 2',
    channel: 'Milton Nascimento & Lô Borges',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'eJoxc_x3_3I',
    title: 'Paisagem da Janela',
    channel: 'Lô Borges',
    thumbnail: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'j4k9L3Xv_m0',
    title: 'O Trem Azul',
    channel: 'Elis Regina & Clube da Esquina',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'x8A7K92m1Pq',
    title: 'Amor de Índio',
    channel: 'Beto Guedes',
    thumbnail: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&q=80',
  },
];

export const YouTubeSyncModal: React.FC<YouTubeSyncModalProps> = ({
  isOpen,
  onClose,
  syncState,
  onUpdateSync,
}) => {
  const { mode, triggerHaptic } = useApp();
  const isLove = mode === 'amor';

  const [searchQuery, setSearchQuery] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const [searchResults, setSearchResults] = useState<VideoSearchResult[]>(FEATURED_MG_TRACKS);
  const [isSearching, setIsSearching] = useState(false);

  // Busca na YouTube Data API v3 usando a chave estipulada
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    triggerHaptic('light');
    setIsSearching(true);

    try {
      const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${encodeURIComponent(
        searchQuery + ' musica mpb minas gerais'
      )}&type=video&key=${YOUTUBE_API_KEY}`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const formatted: VideoSearchResult[] = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
        }));
        setSearchResults(formatted);
      } else {
        // Fallback gracioso com curadoria
        setSearchResults(FEATURED_MG_TRACKS);
      }
    } catch {
      setSearchResults(FEATURED_MG_TRACKS);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTrack = (track: VideoSearchResult) => {
    triggerHaptic('success');
    onUpdateSync({
      video_id: track.id,
      title: track.title,
      artist: track.channel,
      thumbnail: track.thumbnail,
      is_playing: true,
      current_time: 0,
      updated_at: new Date().toISOString(),
    });
  };

  const handlePasteDirectUrl = () => {
    if (!directUrl.trim()) return;
    triggerHaptic('light');

    // Extrair ID do youtube se houver
    let videoId = directUrl;
    const match = directUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      videoId = match[1];
    }

    onUpdateSync({
      video_id: videoId,
      title: 'Música Selecionada',
      artist: 'YouTube Player',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
      is_playing: true,
      current_time: 0,
      updated_at: new Date().toISOString(),
    });
    setDirectUrl('');
  };

  const togglePlayback = () => {
    if (!syncState) return;
    triggerHaptic('light');
    onUpdateSync({
      ...syncState,
      is_playing: !syncState.is_playing,
      updated_at: new Date().toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-[#13131F] border border-white/15 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-hidden">
        {/* Topo do Bottom Sheet */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-2xl ${
                isLove ? 'bg-[#FF007F]/20 text-[#FF007F]' : 'bg-[#FFB700]/20 text-[#FFB700]'
              }`}
            >
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ouvir Música Juntos</h3>
              <p className="text-[10px] text-white/60">
                Sincronizado em tempo real pelo Supabase Realtime
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Voltar para a conversa"
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-2.5 py-2 text-[11px] font-bold text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </div>

        {/* Player Ativo Atual (se houver música tocando) */}
        {syncState && (
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <img
                src={syncState.thumbnail}
                alt={syncState.title}
                className="w-12 h-12 rounded-xl object-cover border border-white/15"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{syncState.title}</p>
                <p className="text-[10px] text-white/60 truncate">{syncState.artist}</p>
                <div className="flex items-center gap-1.5 text-[9px] text-[#FF55A3] mt-0.5">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>Tocando em sincronia para os dois</span>
                </div>
              </div>

              <button
                onClick={togglePlayback}
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  isLove
                    ? 'bg-[#FF007F] text-white shadow-[0_0_10px_#FF007F]'
                    : 'bg-[#FFB700] text-black shadow-[0_0_10px_#FFB700]'
                }`}
              >
                {syncState.is_playing ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>
            </div>

            {/* Iframe oficial do YouTube com sincronização */}
            <div className="w-full aspect-video rounded-xl overflow-hidden mt-1 bg-black">
              <iframe
                title="YouTube Sync Player"
                src={`https://www.youtube.com/embed/${syncState.video_id}?autoplay=1&enablejsapi=1&controls=1`}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Barra de Busca YouTube Data API v3 */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar música ou artista no YouTube..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A2B] border border-white/15 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-[#FF007F]"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className={`px-4 py-2 rounded-2xl text-xs font-bold text-white ${
              isLove ? 'bg-[#FF007F]' : 'bg-[#FFB700] text-black'
            }`}
          >
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {/* Campo opcional de Link direto */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ou cole o link direto do YouTube..."
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            className="flex-1 bg-[#1A1A2B] border border-white/10 rounded-xl px-3 py-1.5 text-[11px] text-white placeholder-white/30 outline-none"
          />
          <button
            type="button"
            onClick={handlePasteDirectUrl}
            className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-[11px] font-semibold hover:bg-white/20"
          >
            Tocar Link
          </button>
        </div>

        {/* Resultados da Busca / Trilhas Recomendadas de MG */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2 pt-1 max-h-56">
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
            Músicas Recomendadas para a Prosa
          </p>

          {searchResults.map((track) => (
            <div
              key={track.id}
              onClick={() => handleSelectTrack(track)}
              className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all border border-transparent hover:border-white/15"
            >
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold text-white truncate">{track.title}</p>
                <p className="text-[10px] text-white/60 truncate">{track.channel}</p>
              </div>
              <Play className="w-4 h-4 text-white/60 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
