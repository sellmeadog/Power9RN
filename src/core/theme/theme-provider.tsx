import React, { createContext, FunctionComponent, useCallback, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { FullTheme, ReplaceTheme, Theme, ThemeConsumer, ThemeProvider } from 'react-native-elements';

import { P9_THEME_DARK } from './theme-dark';
import { P9_THEME_LIGHT } from './theme-light';

type P9ThemeState = [theme: Partial<FullTheme>, darkMode: boolean, toggleTheme: () => void];

const P9ThemeContext = createContext<P9ThemeState | undefined>(undefined);

const P9ThemeProvider_: FunctionComponent<{ theme: Theme; replaceTheme: ReplaceTheme }> = ({
  children,
  theme,
  replaceTheme,
}) => {
  const colorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');

  const toggleTheme = useCallback(() => {
    const darkMode_ = !darkMode;
    setDarkMode(darkMode_);
    replaceTheme(darkMode_ ? P9_THEME_DARK : P9_THEME_LIGHT);
  }, [darkMode, replaceTheme]);

  return <P9ThemeContext.Provider value={[theme, darkMode, toggleTheme]}>{children}</P9ThemeContext.Provider>;
};

export const P9ThemeProvider: FunctionComponent = ({ children }) => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider theme={colorScheme === 'dark' ? P9_THEME_DARK : P9_THEME_LIGHT}>
      <ThemeConsumer>
        {({ theme, replaceTheme }) => (
          <P9ThemeProvider_ theme={theme} replaceTheme={replaceTheme}>
            {children}
          </P9ThemeProvider_>
        )}
      </ThemeConsumer>
    </ThemeProvider>
  );
};

export const usePower9Theme = (): P9ThemeState => {
  const context = useContext(P9ThemeContext);

  if (context === undefined) {
    throw new Error('usePower9Theme must be called withing a P9ThemeProvider');
  }

  return context;
};
