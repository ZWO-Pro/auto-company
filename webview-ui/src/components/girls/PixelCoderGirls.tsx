import React, { useState, useEffect } from 'react';
import '../../styles/pixel-coder-girls.css';

interface CoderGirl {
  id: string;
  name: string;
  title: string;
  specialty: string;
  race: 'vampire' | 'daemon' | 'elf' | 'shadow' | 'succubus';
  level: number;
  mood: 'focused' | 'thinking' | 'celebrating' | 'debugging';
  stats: {
    speed: number;
    precision: number;
    creativity: number;
    debugging: number;
  };
}

export const PixelCoderGirls: React.FC = () => {
  const [coderGirls] = useState<CoderGirl[]>([
    {
      id: 'girl-1',
      name: 'Elvira',
      title: 'Dark Code Enchantress',
      specialty: 'Full-Stack Sorcery',
      race: 'vampire',
      level: 18,
      mood: 'focused',
      stats: { speed: 95, precision: 98, creativity: 92, debugging: 96 },
    },
    {
      id: 'girl-2',
      name: 'Nyx',
      title: 'Shadow Developer',
      specialty: 'Backend Witchcraft',
      race: 'shadow',
      level: 16,
      mood: 'thinking',
      stats: { speed: 92, precision: 94, creativity: 88, debugging: 95 },
    },
    {
      id: 'girl-3',
      name: 'Lilith',
      title: 'Infernal Architect',
      specialty: 'DevOps & Infrastructure',
      race: 'daemon',
      level: 19,
      mood: 'celebrating',
      stats: { speed: 98, precision: 92, creativity: 85, debugging: 94 },
    },
    {
      id: 'girl-4',
      name: 'Seraphine',
      title: 'Celestial Frontend Mage',
      specialty: 'UI/UX Enchantment',
      race: 'elf',
      level: 17,
      mood: 'debugging',
      stats: { speed: 90, precision: 96, creativity: 99, debugging: 93 },
    },
    {
      id: 'girl-5',
      name: 'Succina',
      title: 'Temptress of Code',
      specialty: 'AI/ML Sorcery',
      race: 'succubus',
      level: 20,
      mood: 'focused',
      stats: { speed: 94, precision: 97, creativity: 96, debugging: 98 },
    },
  ]);

  const [selectedGirl, setSelectedGirl] = useState<CoderGirl>(coderGirls[0]);
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(f => (f + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pixel-coder-girls-container">
      <header className="girls-header">
        <h1>💖 Pixel Coder Girls - Elite Development Squad</h1>
        <p>Dark Fantasy Software Engineering Masters</p>
      </header>

      <div className="girls-showcase">
        {/* Team Grid */}
        <div className="girls-grid">
          {coderGirls.map(girl => (
            <div
              key={girl.id}
              className={`girl-card ${selectedGirl.id === girl.id ? 'selected' : ''}`}
              onClick={() => setSelectedGirl(girl)}
            >
              <div className="girl-visual">
                <PixelCoderGirlAvatar girl={girl} frame={animationFrame} />
              </div>
              <div className="girl-info">
                <h3 className="girl-name">{girl.name}</h3>
                <p className="girl-title">{girl.title}</p>
                <div className="level-badge">Lv. {girl.level}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Profile */}
        {selectedGirl && (
          <div className="girl-profile">
            <div className="profile-visual">
              <PixelCoderGirlLarge girl={selectedGirl} frame={animationFrame} />
            </div>

            <div className="profile-details">
              <h2>{selectedGirl.name} 💜</h2>
              <p className="profile-title">{selectedGirl.title}</p>
              <p className="profile-specialty">Specialty: {selectedGirl.specialty}</p>

              <div className="stats-section">
                <h4>⚡ Coding Stats</h4>
                <div className="stat-bar">
                  <span className="stat-label">Speed</span>
                  <div className="stat-track">
                    <div className="stat-fill" style={{ width: `${selectedGirl.stats.speed}%` }} />
                  </div>
                  <span className="stat-value">{selectedGirl.stats.speed}%</span>
                </div>
                <div className="stat-bar">
                  <span className="stat-label">Precision</span>
                  <div className="stat-track">
                    <div className="stat-fill" style={{ width: `${selectedGirl.stats.precision}%` }} />
                  </div>
                  <span className="stat-value">{selectedGirl.stats.precision}%</span>
                </div>
                <div className="stat-bar">
                  <span className="stat-label">Creativity</span>
                  <div className="stat-track">
                    <div className="stat-fill" style={{ width: `${selectedGirl.stats.creativity}%` }} />
                  </div>
                  <span className="stat-value">{selectedGirl.stats.creativity}%</span>
                </div>
                <div className="stat-bar">
                  <span className="stat-label">Debugging</span>
                  <div className="stat-track">
                    <div className="stat-fill" style={{ width: `${selectedGirl.stats.debugging}%` }} />
                  </div>
                  <span className="stat-value">{selectedGirl.stats.debugging}%</span>
                </div>
              </div>

              <div className="mood-section">
                <h4>Current Mood</h4>
                <div className={`mood-badge ${selectedGirl.mood}`}>
                  {getMoodEmoji(selectedGirl.mood)} {selectedGirl.mood.toUpperCase()}
                </div>
              </div>

              <div className="abilities-section">
                <h4>🔮 Special Abilities</h4>
                <ul className="abilities-list">
                  <li>✨ Code Transmutation</li>
                  <li>💻 Debug Intuition</li>
                  <li>🎨 Design Mastery</li>
                  <li>⚙️ System Architecture</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface PixelAvatarProps {
  girl: CoderGirl;
  frame: number;
}

const PixelCoderGirlAvatar: React.FC<PixelAvatarProps> = ({ girl, frame }) => {
  const getAvatarStyle = (race: string) => {
    const styles: Record<string, string> = {
      vampire: 'bg-gradient(135deg, #e74c3c, #8b0000)',
      daemon: 'bg-gradient(135deg, #8b00ff, #4b0082)',
      elf: 'bg-gradient(135deg, #2ecc71, #27ae60)',
      shadow: 'bg-gradient(135deg, #2c3e50, #1a252f)',
      succubus: 'bg-gradient(135deg, #e91e63, #c2185b)',
    };
    return styles[race] || styles.vampire;
  };

  return (
    <svg viewBox="0 0 64 80" className="pixel-avatar">
      {/* Head */}
      <rect x="20" y="8" width="24" height="24" fill="#f4a79d" />
      
      {/* Hair */}
      <rect x="16" y="4" width="32" height="8" fill={girl.race === 'vampire' ? '#2c1011' : '#1a1a1a'} />
      
      {/* Eyes */}
      <circle cx="26" cy="16" r="2" fill="#ff0000" opacity="0.8" />
      <circle cx="38" cy="16" r="2" fill="#ff0000" opacity="0.8" />
      
      {/* Mouth */}
      <line x1="26" y1="20" x2="38" y2="20" stroke="#000" strokeWidth="1" />
      
      {/* Body */}
      <rect x="18" y="32" width="28" height="28" fill={girl.race === 'vampire' ? '#8b0000' : '#1a1a2e'} />
      
      {/* Arms */}
      <rect x="8" y="36" width="10" height="20" fill="#f4a79d" />
      <rect x="46" y="36" width="10" height="20" fill="#f4a79d" />
      
      {/* Legs */}
      <rect x="22" y="60" width="8" height="16" fill="#000" />
      <rect x="34" y="60" width="8" height="16" fill="#000" />
      
      {/* Animation effect */}
      {frame % 2 === 0 && (
        <circle cx="32" cy="32" r="35" fill="none" stroke="#ffd700" strokeWidth="0.5" opacity="0.3" />
      )}
    </svg>
  );
};

const PixelCoderGirlLarge: React.FC<PixelAvatarProps> = ({ girl, frame }) => {
  const getColorScheme = (race: string) => {
    const schemes: Record<string, { primary: string; secondary: string; accent: string }> = {
      vampire: { primary: '#8b0000', secondary: '#e74c3c', accent: '#ff0000' },
      daemon: { primary: '#4b0082', secondary: '#8b00ff', accent: '#ff00ff' },
      elf: { primary: '#27ae60', secondary: '#2ecc71', accent: '#39ff14' },
      shadow: { primary: '#1a1a2e', secondary: '#2c3e50', accent: '#95a5a6' },
      succubus: { primary: '#c2185b', secondary: '#e91e63', accent: '#ff69b4' },
    };
    return schemes[race] || schemes.vampire;
  };

  const colors = getColorScheme(girl.race);
  const isAnimating = frame % 4 < 2;

  return (
    <svg viewBox="0 0 128 160" className="pixel-avatar-large">
      {/* Background glow */}
      <circle cx="64" cy="80" r="100" fill={colors.primary} opacity="0.1" />
      
      {/* Head */}
      <rect x="40" y="16" width="48" height="48" fill="#f4a79d" stroke={colors.accent} strokeWidth="2" />
      
      {/* Hair - Elegant */}
      <rect x="32" y="8" width="64" height="16" fill={colors.primary} stroke={colors.accent} strokeWidth="1" />
      
      {/* Eyes - Mystical */}
      <circle cx="48" cy="32" r="4" fill={colors.accent} />
      <circle cx="80" cy="32" r="4" fill={colors.accent} />
      <circle cx="50" cy="30" r="1.5" fill="#000" />
      <circle cx="82" cy="30" r="1.5" fill="#000" />
      
      {/* Lips - Seductive */}
      <path d="M 64 44 Q 55 48 50 46" stroke={colors.secondary} strokeWidth="2" fill="none" />
      <path d="M 64 44 Q 73 48 78 46" stroke={colors.secondary} strokeWidth="2" fill="none" />
      
      {/* Body - Elegant */}
      <rect x="36" y="64" width="56" height="48" fill={colors.primary} stroke={colors.accent} strokeWidth="2" />
      
      {/* Torso detail */}
      <line x1="40" y1="72" x2="88" y2="72" stroke={colors.accent} strokeWidth="1" opacity="0.5" />
      
      {/* Arms - Graceful */}
      <rect x="16" y="72" width="20" height="40" fill="#f4a79d" stroke={colors.accent} strokeWidth="2" />
      <rect x="92" y="72" width="20" height="40" fill="#f4a79d" stroke={colors.accent} strokeWidth="2" />
      
      {/* Hands */}
      <circle cx="26" cy="112" r="6" fill="#f4a79d" stroke={colors.accent} strokeWidth="1" />
      <circle cx="102" cy="112" r="6" fill="#f4a79d" stroke={colors.accent} strokeWidth="1" />
      
      {/* Legs - Elegant */}
      <rect x="44" y="112" width="16" height="40" fill="#1a1a1a" stroke={colors.accent} strokeWidth="2" />
      <rect x="68" y="112" width="16" height="40" fill="#1a1a1a" stroke={colors.accent} strokeWidth="2" />
      
      {/* Shoes */}
      <rect x="42" y="152" width="20" height="8" fill={colors.secondary} stroke={colors.accent} strokeWidth="1" />
      <rect x="66" y="152" width="20" height="8" fill={colors.secondary} stroke={colors.accent} strokeWidth="1" />
      
      {/* Glowing aura animation */}
      {isAnimating && (
        <circle cx="64" cy="80" r="110" fill="none" stroke={colors.accent} strokeWidth="1" opacity="0.4" />
      )}
      
      {/* Energy effect */}
      <line x1="20" y1="60" x2="30" y2="50" stroke={colors.accent} strokeWidth="1" opacity="0.6" />
      <line x1="108" y1="60" x2="98" y2="50" stroke={colors.accent} strokeWidth="1" opacity="0.6" />
    </svg>
  );
};

function getMoodEmoji(mood: string): string {
  const moods: Record<string, string> = {
    focused: '🎯',
    thinking: '🤔',
    celebrating: '🎉',
    debugging: '🐛',
  };
  return moods[mood] || '😊';
}

export default PixelCoderGirls;