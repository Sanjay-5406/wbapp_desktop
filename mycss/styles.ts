export const navStyles: Record<string, React.CSSProperties> = {
  navbar: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: '20px 40px',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.15)',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },

  siteName: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#0c5eac',
    margin: 0, 
  },

  rightContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px', 
  },

  // Base style for all links
  linkDefault: {
    color: '#94a3b8', // Muted slate gray
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 500,
    transition: 'color 0.3s ease',
  },

  // Active state style override
  linkActive: {
    color: '#6366f1', // Vibrant Indigo/Purple (or use #ffffff for pure white)
    fontWeight: 700,  // Bolder text weight
  }
};
