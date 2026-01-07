import React, { useState } from 'react';

// ===== DESIGN TOKENS =====
const tokens = {
  colors: {
    primary: '#7C3AED',
    primaryDark: '#6D28D9',
    secondary: '#D946EF',
    accent: '#22D3EE',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    bgDark: '#0F0F1A',
    bgSurface: '#1A1A2E',
    bgCard: '#252542',
    textPrimary: '#F8FAFC',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #7C3AED 0%, #D946EF 100%)',
    accent: 'linear-gradient(135deg, #D946EF 0%, #22D3EE 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #22D3EE 100%)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    full: '9999px',
  },
  shadows: {
    sm: '0 2px 8px rgba(0,0,0,0.1)',
    md: '0 4px 16px rgba(0,0,0,0.15)',
    lg: '0 8px 32px rgba(0,0,0,0.2)',
    primary: '0 4px 14px rgba(124, 58, 237, 0.4)',
  }
};

// ===== STYLES =====
const styles = {
  // Container
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    background: tokens.colors.bgDark,
    minHeight: '100vh',
    color: tokens.colors.textPrimary,
    padding: '40px',
  },
  
  // Section
  section: {
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '24px',
  },
  
  // Grid
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '24px',
  },
  
  // Color Swatch
  colorSwatch: {
    width: '120px',
    textAlign: 'center',
  },
  colorBox: {
    width: '100%',
    height: '80px',
    borderRadius: tokens.borderRadius.lg,
    marginBottom: '8px',
  },
  colorName: {
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '2px',
  },
  colorValue: {
    fontSize: '11px',
    color: tokens.colors.textMuted,
  },
  
  // Buttons
  btn: {
    padding: '16px 32px',
    borderRadius: tokens.borderRadius.lg,
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  btnPrimary: {
    background: tokens.gradients.primary,
    color: 'white',
    boxShadow: tokens.shadows.primary,
  },
  btnSecondary: {
    background: 'transparent',
    color: tokens.colors.primary,
    border: `2px solid ${tokens.colors.primary}`,
  },
  btnGhost: {
    background: 'transparent',
    color: tokens.colors.textSecondary,
  },
  btnSmall: {
    padding: '10px 20px',
    fontSize: '14px',
    borderRadius: tokens.borderRadius.md,
  },
  
  // Cards
  card: {
    background: tokens.colors.bgCard,
    borderRadius: tokens.borderRadius.xl,
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  
  // Event Card
  eventCard: {
    background: tokens.colors.bgCard,
    borderRadius: tokens.borderRadius.xl,
    overflow: 'hidden',
    width: '200px',
  },
  eventImage: {
    height: '100px',
    background: tokens.gradients.accent,
  },
  eventInfo: {
    padding: '16px',
  },
  eventName: {
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  eventMeta: {
    fontSize: '13px',
    color: tokens.colors.textSecondary,
  },
  
  // Person Card
  personCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: tokens.colors.bgCard,
    borderRadius: tokens.borderRadius.lg,
    padding: '16px',
    width: '100%',
    maxWidth: '400px',
  },
  avatar: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: tokens.gradients.primary,
    flexShrink: 0,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '2px',
  },
  personHandle: {
    fontSize: '13px',
    color: tokens.colors.textSecondary,
  },
  personMeta: {
    fontSize: '12px',
    color: tokens.colors.accent,
    marginTop: '4px',
  },
  
  // Check-in Card
  checkinCard: {
    background: tokens.gradients.primary,
    borderRadius: tokens.borderRadius.xl,
    padding: '24px',
    color: 'white',
    maxWidth: '350px',
    position: 'relative',
    overflow: 'hidden',
  },
  checkinLabel: {
    fontSize: '11px',
    opacity: 0.8,
    letterSpacing: '0.05em',
    marginBottom: '8px',
  },
  checkinTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  checkinMeta: {
    fontSize: '13px',
    opacity: 0.85,
    marginBottom: '16px',
  },
  checkinPeople: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarStack: {
    display: 'flex',
  },
  avatarSmall: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: tokens.colors.bgCard,
    border: '2px solid rgba(255,255,255,0.3)',
    marginLeft: '-10px',
  },
  peopleCount: {
    fontSize: '15px',
    fontWeight: '600',
  },
  
  // Input
  input: {
    background: tokens.colors.bgCard,
    border: 'none',
    borderRadius: tokens.borderRadius.md,
    padding: '14px 16px',
    fontSize: '15px',
    color: tokens.colors.textPrimary,
    width: '100%',
    maxWidth: '300px',
    outline: 'none',
  },
  searchInput: {
    background: tokens.colors.bgCard,
    border: 'none',
    borderRadius: tokens.borderRadius.md,
    padding: '14px 16px 14px 44px',
    fontSize: '15px',
    color: tokens.colors.textPrimary,
    width: '100%',
    maxWidth: '300px',
    outline: 'none',
  },
  
  // Badge
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: tokens.borderRadius.full,
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeSuccess: {
    background: 'rgba(16, 185, 129, 0.15)',
    color: tokens.colors.success,
  },
  badgePrimary: {
    background: tokens.gradients.primary,
    color: 'white',
  },
  badgeAccent: {
    background: tokens.gradients.accent,
    color: 'white',
  },
  
  // Notification Badge
  notificationBadge: {
    background: tokens.colors.error,
    color: 'white',
    minWidth: '20px',
    height: '20px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 6px',
  },
  
  // Tab Bar
  tabBar: {
    display: 'flex',
    background: tokens.colors.bgSurface,
    borderRadius: tokens.borderRadius.xl,
    padding: '8px',
    gap: '4px',
    maxWidth: '400px',
  },
  tabItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '10px',
    borderRadius: tokens.borderRadius.md,
    fontSize: '11px',
    color: tokens.colors.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabItemActive: {
    color: tokens.colors.primary,
    background: 'rgba(124, 58, 237, 0.1)',
  },
  tabIcon: {
    fontSize: '20px',
  },
  
  // Logo
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    background: tokens.gradients.primary,
    borderRadius: tokens.borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: tokens.shadows.primary,
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '800',
    background: tokens.gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  
  // Match Celebration
  matchContainer: {
    textAlign: 'center',
    padding: '40px',
    background: tokens.colors.bgSurface,
    borderRadius: tokens.borderRadius.xxl,
    maxWidth: '350px',
  },
  matchEmoji: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  matchAvatars: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  matchAvatar: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    background: tokens.gradients.primary,
  },
  matchHeart: {
    fontSize: '28px',
  },
  matchTitle: {
    fontSize: '28px',
    fontWeight: '800',
    background: tokens.gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  matchSubtitle: {
    color: tokens.colors.textSecondary,
    fontSize: '14px',
    marginBottom: '28px',
  },
};

// ===== COMPONENT: Design System Showcase =====
export default function DesignSystem() {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={{ marginBottom: '60px' }}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>📍</div>
          <span style={styles.logoText}>CheckMate</span>
        </div>
        <p style={{ color: tokens.colors.textSecondary, marginTop: '16px', fontSize: '18px' }}>
          Design System v1.0
        </p>
      </div>

      {/* Colors */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Cores</h2>
        <div style={styles.grid}>
          <div style={styles.colorSwatch}>
            <div style={{ ...styles.colorBox, background: tokens.colors.primary }} />
            <div style={styles.colorName}>Primary</div>
            <div style={styles.colorValue}>#7C3AED</div>
          </div>
          <div style={styles.colorSwatch}>
            <div style={{ ...styles.colorBox, background: tokens.colors.secondary }} />
            <div style={styles.colorName}>Secondary</div>
            <div style={styles.colorValue}>#D946EF</div>
          </div>
          <div style={styles.colorSwatch}>
            <div style={{ ...styles.colorBox, background: tokens.colors.accent }} />
            <div style={styles.colorName}>Accent</div>
            <div style={styles.colorValue}>#22D3EE</div>
          </div>
          <div style={styles.colorSwatch}>
            <div style={{ ...styles.colorBox, background: tokens.colors.success }} />
            <div style={styles.colorName}>Success</div>
            <div style={styles.colorValue}>#10B981</div>
          </div>
          <div style={styles.colorSwatch}>
            <div style={{ ...styles.colorBox, background: tokens.colors.error }} />
            <div style={styles.colorName}>Error</div>
            <div style={styles.colorValue}>#EF4444</div>
          </div>
        </div>
        
        <h3 style={{ ...styles.sectionTitle, marginTop: '32px' }}>Gradientes</h3>
        <div style={styles.grid}>
          <div style={styles.colorSwatch}>
            <div style={{ ...styles.colorBox, background: tokens.gradients.primary, width: '180px' }} />
            <div style={styles.colorName}>Primary Gradient</div>
          </div>
          <div style={styles.colorSwatch}>
            <div style={{ ...styles.colorBox, background: tokens.gradients.accent, width: '180px' }} />
            <div style={styles.colorName}>Accent Gradient</div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Botões</h2>
        <div style={{ ...styles.grid, gap: '16px' }}>
          <button style={{ ...styles.btn, ...styles.btnPrimary }}>
            📍 Fazer Check-in
          </button>
          <button style={{ ...styles.btn, ...styles.btnSecondary }}>
            Ver Perfil
          </button>
          <button style={{ ...styles.btn, ...styles.btnGhost }}>
            Cancelar
          </button>
        </div>
        <div style={{ ...styles.grid, gap: '16px', marginTop: '16px' }}>
          <button style={{ ...styles.btn, ...styles.btnPrimary, ...styles.btnSmall }}>
            Conectar
          </button>
          <button style={{ ...styles.btn, ...styles.btnSecondary, ...styles.btnSmall }}>
            Ver mais
          </button>
        </div>
      </div>

      {/* Badges */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Badges</h2>
        <div style={{ ...styles.grid, gap: '12px' }}>
          <span style={{ ...styles.badge, ...styles.badgeSuccess }}>
            🟢 Online
          </span>
          <span style={{ ...styles.badge, ...styles.badgePrimary }}>
            ✨ Novo
          </span>
          <span style={{ ...styles.badge, ...styles.badgeAccent }}>
            💜 Match!
          </span>
          <span style={styles.notificationBadge}>3</span>
          <span style={styles.notificationBadge}>99+</span>
        </div>
      </div>

      {/* Cards */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Cards</h2>
        
        {/* Check-in Card */}
        <div style={{ marginBottom: '24px' }}>
          <div style={styles.checkinCard}>
            <div style={styles.checkinLabel}>📍 VOCÊ ESTÁ EM</div>
            <div style={styles.checkinTitle}>Tech Meetup SP</div>
            <div style={styles.checkinMeta}>Há 45 min · 🌐 Público</div>
            <div style={styles.checkinPeople}>
              <div style={styles.avatarStack}>
                <div style={{ ...styles.avatarSmall, marginLeft: 0 }} />
                <div style={styles.avatarSmall} />
                <div style={styles.avatarSmall} />
                <div style={styles.avatarSmall} />
              </div>
              <span style={styles.peopleCount}>👥 47 pessoas</span>
            </div>
          </div>
        </div>
        
        {/* Event Cards */}
        <div style={{ ...styles.grid, marginBottom: '24px' }}>
          <div style={styles.eventCard}>
            <div style={styles.eventImage} />
            <div style={styles.eventInfo}>
              <div style={styles.eventName}>Tech Meetup SP</div>
              <div style={styles.eventMeta}>📍 1.2km · 👥 47 pessoas</div>
            </div>
          </div>
          <div style={styles.eventCard}>
            <div style={{ ...styles.eventImage, background: tokens.gradients.success }} />
            <div style={styles.eventInfo}>
              <div style={styles.eventName}>Yoga no Parque</div>
              <div style={styles.eventMeta}>📍 800m · 👥 23 pessoas</div>
            </div>
          </div>
        </div>
        
        {/* Person Card */}
        <div style={styles.personCard}>
          <div style={styles.avatar} />
          <div style={styles.personInfo}>
            <div style={styles.personName}>Ana Beatriz</div>
            <div style={styles.personHandle}>@anabeatriz · Há 30min</div>
            <div style={styles.personMeta}>🤝 5 conexões em comum</div>
          </div>
          <span style={{ color: tokens.colors.textSecondary, fontSize: '20px' }}>→</span>
        </div>
      </div>

      {/* Inputs */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Inputs</h2>
        <div style={{ ...styles.grid, gap: '16px' }}>
          <input 
            type="text" 
            placeholder="Nome completo" 
            style={styles.input}
          />
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Buscar evento ou local..." 
              style={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Tab Bar</h2>
        <div style={styles.tabBar}>
          {['🏠 Home', '🔍 Explorar', '➕', '💬 Inbox', '👤 Perfil'].map((tab, i) => (
            <div 
              key={i}
              style={{ 
                ...styles.tabItem, 
                ...(activeTab === i ? styles.tabItemActive : {})
              }}
              onClick={() => setActiveTab(i)}
            >
              <span style={styles.tabIcon}>{tab.split(' ')[0]}</span>
              {tab.split(' ')[1] && <span>{tab.split(' ')[1]}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Match Celebration */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Match Celebration</h2>
        <div style={styles.matchContainer}>
          <div style={styles.matchEmoji}>🎉</div>
          <div style={styles.matchAvatars}>
            <div style={styles.matchAvatar} />
            <div style={styles.matchHeart}>💜</div>
            <div style={{ ...styles.matchAvatar, background: tokens.gradients.accent }} />
          </div>
          <h2 style={styles.matchTitle}>É um Match!</h2>
          <p style={styles.matchSubtitle}>
            Você e Ana se conectaram no<br/>Tech Meetup SP
          </p>
          <button style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', justifyContent: 'center' }}>
            📸 Abrir Instagram
          </button>
        </div>
      </div>

      {/* Typography */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Tipografia</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Display - 36px ExtraBold
          </span>
          <span style={{ fontSize: '28px', fontWeight: '700' }}>
            Title - 28px Bold
          </span>
          <span style={{ fontSize: '22px', fontWeight: '600' }}>
            Subtitle - 22px SemiBold
          </span>
          <span style={{ fontSize: '18px', fontWeight: '600' }}>
            Section - 18px SemiBold
          </span>
          <span style={{ fontSize: '16px' }}>
            Body - 16px Regular
          </span>
          <span style={{ fontSize: '14px', color: tokens.colors.textSecondary }}>
            Small - 14px Regular
          </span>
          <span style={{ fontSize: '12px', color: tokens.colors.textMuted, letterSpacing: '0.01em' }}>
            Caption - 12px Medium
          </span>
        </div>
      </div>
    </div>
  );
}
