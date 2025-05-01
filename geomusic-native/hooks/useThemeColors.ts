import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const useThemeColors = () => {
  const theme = useColorScheme() ?? 'light';
  return Colors[theme];
};

export default useThemeColors;
