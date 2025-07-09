import { StyleSheet } from 'react-native';
import colors from './colors';

export const theme = {
  colors: colors.dark,
  spacing: {
    xs: 6,
    sm: 12,
    md: 20,
    lg: 30,
    xl: 40,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  shadow: {
    sm: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screenContainer: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontFamily: 'monospace',
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.md,
    fontFamily: 'monospace',
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  secondaryButtonText: {
    color: theme.colors.accent,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    fontSize: 16,
    fontFamily: 'monospace',
  },
});