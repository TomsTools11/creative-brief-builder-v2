// PDF styles for react-pdf
import { StyleSheet } from '@react-pdf/renderer';

// Color constants - dynamic colors will be passed at runtime
export const colors = {
  primary: '#0066ff',
  secondary: '#070d59',
  text: '#070d59',
  textLight: '#070d59B3', // 70% opacity
  textMuted: '#070d5999', // 60% opacity
  background: '#f8fafc',
  cardBackground: '#f1f3f8',
  white: '#ffffff',
  border: '#e2e8f0',
  green: '#22c55e',
  greenBg: '#dcfce7',
  greenText: '#166534',
  red: '#ef4444',
  redBg: '#fee2e2',
  redText: '#991b1b',
};

// Create base styles - optimized for landscape presentation format
export const baseStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: colors.white,
    padding: 50,
    paddingHorizontal: 60,
    fontFamily: 'Helvetica',
  },

  // Typography
  h1: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 16,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 12,
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 8,
  },
  h4: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 6,
  },
  labelUppercase: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  body: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 1.6,
  },
  small: {
    fontSize: 9,
    color: colors.textMuted,
  },

  // Layout
  section: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  col2: {
    width: '50%',
    paddingRight: 10,
  },
  col3: {
    width: '33.33%',
    paddingRight: 10,
  },
  col4: {
    width: '25%',
    paddingRight: 10,
  },

  // Cards/Boxes
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardBordered: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  cardElevated: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Lists
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 8,
    marginTop: 4,
  },

  // Dividers
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginVertical: 20,
  },

  // Cover page
  coverPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 18,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  coverYear: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // Section header - dark full-width divider (landscape optimized)
  sectionHeader: {
    backgroundColor: colors.secondary,
    padding: 50,
    paddingHorizontal: 60,
    marginBottom: 30,
    marginHorizontal: -60,
    marginTop: -50,
    minHeight: 100,
    justifyContent: 'center',
  },
  sectionHeaderText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
  },
  sectionHeaderAccent: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  sectionHeaderSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
  },

  // Two-tone title
  twoToneTitle: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  twoToneTitlePrimary: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  twoToneTitleAccent: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },

  // Hexagon color swatch (simulated with rounded shape)
  hexagonSwatch: {
    width: 60,
    height: 70,
    borderRadius: 8,
    marginBottom: 8,
  },
  colorSwatch: {
    width: 70,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  colorInfo: {
    marginTop: 4,
  },
  colorName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 4,
  },
  colorValue: {
    fontSize: 8,
    color: colors.textMuted,
    fontFamily: 'Courier',
  },

  // Quote
  quote: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    paddingLeft: 16,
    marginVertical: 16,
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.secondary,
    lineHeight: 1.5,
  },

  // Badge
  badge: {
    backgroundColor: `${colors.primary}1A`, // 10% opacity
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: 'bold',
  },
  badgePrimary: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgePrimaryText: {
    fontSize: 9,
    color: colors.white,
    fontWeight: 'bold',
  },

  // We Are / We Are Not section
  weAreSection: {
    backgroundColor: colors.greenBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  weAreNotSection: {
    backgroundColor: colors.redBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  weAreTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.greenText,
    marginBottom: 12,
  },
  weAreNotTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.redText,
    marginBottom: 12,
  },
  weAreItem: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },

  // Button styles section
  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  buttonPrimaryText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  buttonSecondaryText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: 'bold',
  },
  buttonTertiary: {
    paddingVertical: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  buttonTertiaryText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: 'bold',
  },

  // Table
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.textMuted,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  tableCell: {
    fontSize: 9,
    color: colors.textLight,
  },

  // Footer (landscape optimized)
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 60,
    right: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pageNumber: {
    fontSize: 9,
    color: colors.textMuted,
  },
});

export default baseStyles;
