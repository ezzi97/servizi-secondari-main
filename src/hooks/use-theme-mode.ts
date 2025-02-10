import { useThemeMode } from 'src/theme/theme-provider';

export const useAppTheme = () => {
  const { toggleThemeMode, mode } = useThemeMode();
  
  return {
    toggleThemeMode,
    mode,
  };
}; 