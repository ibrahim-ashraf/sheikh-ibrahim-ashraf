export const lightTheme = {
  colors: {
    primary: '#FF0000',
    background: '#FFFFFF',
    surface: '#F8F8F8',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
    card: '#FFFFFF',
  },
};

export const darkTheme = {
  colors: {
    primary: '#FF0000',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    border: '#333333',
    card: '#242424',
  },
};

export type Theme = typeof lightTheme;
