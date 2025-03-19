import type { ErrorInfo, ReactNode } from 'react';

import { Component } from 'react';

import { Stack, Button, Typography } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Stack spacing={2} alignItems="center" sx={{ p: 4 }}>
          <Typography variant="h5">Qualcosa è andato storto</Typography>
          <Button 
            variant="contained" 
            onClick={() => this.setState({ hasError: false })}
          >
            Riprova
          </Button>
        </Stack>
      );
    }

    return this.props.children;
  }
} 