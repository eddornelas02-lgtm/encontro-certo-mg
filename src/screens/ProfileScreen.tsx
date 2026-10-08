import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  Camera,
  Plus,
  Trash2,
  MapPin,
  Check,
  Edit3,
  Coffee,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Mode, MG_CITIES, MG_CITY_REGION_MAP } from '@/types';

export const ProfileScreen: React.FC = () => {
  const {
    userLoveProfile,
    userFriendProfile,
    updateProfile,
    currentCity,
    setCurrentCity,
    triggerHaptic,
  } = useApp();

  // 3. SELETOR DE ABAS NO TOPO: Amor (Padrão) vs Amizade
  const [activeProfileTab, setActiveProfileTab] = useState<Mode>('amor');
  const isLoveTab = activeProfileTab === 'amor';

  // Perfil em edição de acordo com a aba
  const profile = isLoveTab ? userLoveProfile : userFriendProfile;

  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState(profile.bio);
  const [cityInput, setCityInput] = useState(profile.city);
  const [nameInput, setNameInput] = useState(profile.name);
  const [ageInput, setAgeInput] = useState(profile.age);

  // Sincronizar inputs ao mudar de aba
  const handleTabChange = (targetMode: Mode) => {
    triggerHaptic('light');
    setActiveProfileTab(targetMode);
    const targetProf = targetMode === 'amor' ? userLoveProfile : userFriendProfile;
    setBioInput(targetProf.bio);
    setCityInput(targetProf.city);
    setNameInput(targetProf.name);
    setAgeInput(targetProf.age);
  };

  // Upload/Adição de Foto (Simulando galeria Android integrada a bucket 'profile-pictures')
  const handleAddPhoto = () => {
    if (profile.photos.length >= 6) return;
    triggerHaptic('light');

    // Exemplos variados e estéticos de fotos
    const demoPhotos = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    ];

    const nextPhoto = demoPhotos[profile.photos.length % demoPhotos.length];
    const newPhotos = [...profile.photos, nextPhoto];
    updateProfile(activeProfileTab, { photos: newPhotos });
  };

  const handleRemovePhoto = (index: number) => {
    if (profile.photos.length <= 1) return;
    triggerHaptic('warning');
    const newPhotos = profile.photos.filter((_, idx) => idx !== index);
    updateProfile(activeProfileTab, { photos: newPhotos });
  };

  const handleSaveProfile = () => {
    triggerHaptic('success');
    const region = MG_CITY_REGION_MAP[cityInput] || 'Minas Gerais';
    updateProfile(activeProfileTab, {
      name: nameInput,
      age: Number(ageInput),
      city: cityInput,
      region,
      bio: bioInput.slice(0, 500),
    });
    setCurrentCity(cityInput);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar select-none px-4 pt-1 pb-28">
      {/* 1. SELETOR DE ABAS COM BRILHO NEON E ANIMAÇÃO FLUIDA */}
      <div className="py-2 flex items-center justify-center">
        <div className="w-full bg-[#13131F] p-1.5 rounded-3xl border border-white/10 flex items-center shadow-lg">
          <button
            onClick={() => handleTabChange('amor')}
            className={`flex-1 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-300 ${
              isLoveTab
                ? 'bg-gradient-to-r from-[#FF007F] to-[#FF2A85] text-white shadow-[0_0_16px_rgba(255,0,127,0.7)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLoveTab ? 'fill-current' : ''}`} />
            <span>Perfil de Amor (Padrão)</span>
          </button>

          <button
            onClick={() => handleTabChange('amizade')}
            className={`flex-1 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-300 ${
              !isLoveTab
                ? 'bg-gradient-to-r from-[#FFB700] to-[#FF8800] text-black shadow-[0_0_16px_rgba(255,183,0,0.7)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Perfil de Amizade</span>
          </button>
        </div>
      </div>

      {/* Nota explicativa de arquitetura independente */}
      <div className="px-1 py-1 text-center">
        <p className="text-[10px] text-white/50">
          * Cada modo é 100% independente: gerencie fotos e bio exclusivas para Amor ou Amizade.
        </p>
      </div>

      {/* 2. GRID 2x3 DE FOTOS (EXATAMENTE ATÉ 6 FOTOS) */}
      <div className="mt-3">
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#FF55A3]" />
            Fotos do Perfil ({profile.photos.length}/6)
          </h3>
          <span className="text-[10px] text-white/50">Galeria e Câmera Android</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {Array.from({ length: 6 }).map((_, index) => {
            const photoUrl = profile.photos[index];

            if (photoUrl) {
              return (
                <div
                  key={index}
                  className="aspect-[3/4] relative rounded-2xl overflow-hidden border border-white/15 group shadow-md"
                >
                  <img
                    src={photoUrl}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Badge de Foto Principal */}
                  {index === 0 && (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 text-[9px] font-bold text-white backdrop-blur-sm">
                      Principal
                    </span>
                  )}

                  {/* Botão de excluir foto */}
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute bottom-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white/80 hover:text-red-400 active:scale-90 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            }

            // Slot vazio com botão de adicionar foto
            return (
              <button
                key={index}
                onClick={handleAddPhoto}
                className="aspect-[3/4] rounded-2xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center gap-1 text-white/40 hover:text-white transition-all active:scale-95"
              >
                <Plus className="w-6 h-6" />
                <span className="text-[9px] font-medium">Adicionar</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DADOS DO PERFIL & BIO ÚNICA POR MODO */}
      <div className="mt-5 p-4 rounded-3xl bg-[#141422] border border-white/10 flex flex-col gap-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white">
            Informações do Perfil de {isLoveTab ? 'Amor' : 'Amizade'}
          </h3>

          <button
            onClick={() => {
              triggerHaptic('light');
              if (isEditing) {
                handleSaveProfile();
              } else {
                setIsEditing(true);
              }
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              isEditing
                ? 'bg-emerald-500 text-black font-bold'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </>
            )}
          </button>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[10px] text-white/60 block mb-1">Seu Nome</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-[#1C1C2C] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-white/60 block mb-1">Idade</label>
                <input
                  type="number"
                  value={ageInput}
                  onChange={(e) => setAgeInput(Number(e.target.value))}
                  className="w-full bg-[#1C1C2C] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/60 block mb-1">Cidade em MG</label>
                <select
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="w-full bg-[#1C1C2C] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  {MG_CITIES.map((c) => (
                    <option key={c} value={c} className="bg-[#12121a]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-white/60">
                  Bio Única ({isLoveTab ? 'Amor' : 'Amizade'})
                </label>
                <span className="text-[9px] text-white/40">{bioInput.length}/500</span>
              </div>
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                maxLength={500}
                className="w-full bg-[#1C1C2C] border border-white/15 rounded-xl p-3 text-xs text-white outline-none h-24 resize-none focus:border-[#FF007F]"
                placeholder="Conte sobre sua rotina, o que busca e seus cantinhos favoritos em Minas Gerais..."
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pt-1">
            <div>
              <h2 className="text-xl font-bold text-white">
                {profile.name}, {profile.age}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-white/70 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF007F]" />
                <span className="font-semibold text-white">{profile.city}</span>
                <span className="text-white/40">• {profile.region}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                Sua Bio ({isLoveTab ? 'Modo Amor' : 'Modo Amizade'})
              </span>
              <p className="text-xs text-white/90 leading-relaxed mt-1">{profile.bio}</p>
            </div>
          </div>
        )}
      </div>

      {/* Aconchego e Garantia de Privacidade em MG */}
      <div className="mt-4 p-4 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-[#FF55A3] shrink-0" />
        <div>
          <h4 className="text-xs font-bold text-white">Presença Segura e Real</h4>
          <p className="text-[10px] text-white/60 leading-relaxed">
            Seus perfis em MG são protegidos e auditados sem bots ou contas automáticas.
          </p>
        </div>
      </div>
    </div>
  );
};
