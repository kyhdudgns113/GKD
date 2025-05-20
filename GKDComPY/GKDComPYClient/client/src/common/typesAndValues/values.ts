export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const positionValue = (posVal: number) => {
  switch (posVal) {
    case 0:
      return 'SP1'
    case 1:
      return 'SP2'
    case 2:
      return 'SP3'
    case 3:
      return 'SP4'
    case 4:
      return 'SP5'

    case 5:
      return 'RP1'
    case 6:
      return 'RP2'
    case 7:
      return 'RP3'
    case 8:
      return 'RP4'
    case 9:
      return 'RP5'

    case 10:
      return 'CP'

    case 11:
      return 'DH'
    case 12:
      return 'C'
    case 13:
      return '1B'
    case 14:
      return '2B'
    case 15:
      return '3B'
    case 16:
      return 'SS'
    case 17:
      return 'LF'
    case 18:
      return 'CF'
    case 19:
      return 'RF'

    case 20:
      return 'ET1'
    case 21:
      return 'ET2'
    case 22:
      return 'ET3'
    case 23:
      return 'ET4'
    case 24:
      return 'ET5'

    default:
      return 'XX'
  }
}

export const SAKURA_BORDER = '#F0B8B8'
export const SAKURA_BG = '#F8E8E0'
export const SAKURA_BG_70 = '#F0D8D8'
export const SAKURA_TEXT = '#F89890'

export const [PINK100, PINK200, PINK300] = ['#FCE7F3', '#FCE7F3', '#F9A8D4']
export const [PINK400, PINK500, PINK600] = ['#F472B6', '#EC4899', '#DB2777']
export const [PINK700, PINK800, PINK900] = ['#BE185D', '#9D174D', '#831843']

export const [RED100, RED200, RED300] = ['#FEE2E2', '#FECACA', '#FCA5A5']
export const [RED400, RED500, RED600] = ['#F87171', '#EF4444', '#DC2626']
export const [RED700, RED800, RED900] = ['#B91C1C', '#991B1B', '#7F1D1D']

export const [YELLOW100, YELLOW200, YELLOW300] = ['#FEF9C3', '#FEF08A', '#FDE047']
export const [YELLOW400, YELLOW500, YELLOW600] = ['#FACC15', '#EAB308', '#CA8A04']
export const [YELLOW700, YELLOW800, YELLOW900] = ['#A16207', '#854D0E', '#713F12']

export const [GREEN100, GREEN200, GREEN300] = ['#DCFCE7', '#BBF7D0', '#86EFAC']
export const [GREEN400, GREEN500, GREEN600] = ['#4ADE80', '#22C55E', '#16A34A']
export const [GREEN700, GREEN800, GREEN900] = ['#15803D', '#166534', '#14532D']

export const [BLUE100, BLUE200, BLUE300] = ['#DBEAFE', '#BFDBFE', '#93C5FD']
export const [BLUE400, BLUE500, BLUE600] = ['#60A5FA', '#3B82F6', '#2563EB']
export const [BLUE700, BLUE800, BLUE900] = ['#1D4ED8', '#1E40AF', '#1E3A8A']

export const [PURPLE100, PURPLE200, PURPLE300] = ['#F3E8FF', '#E9D5FF', '#D8B4FE']
export const [PURPLE400, PURPLE500, PURPLE600] = ['#C084FC', '#A855F7', '#93333EA']
export const [PURPLE700, PURPLE800, PURPLE900] = ['#7E22CE', '#6B21A8', '#581C87']

export const [GRAY100, GRAY200, GRAY300] = ['#F3F4F6', '#E5E7EB', '#D1D5DB']
export const [GRAY400, GRAY500, GRAY600] = ['#9CA3AF', '#6B7280', '#4B5563']
export const [GRAY700, GRAY800, GRAY900] = ['#374151', '#1F2937', '#111827']
