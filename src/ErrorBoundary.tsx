import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          position: 'fixed', inset: 0, background: '#0a0f1e',
          color: '#fff', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '24px', fontFamily: 'monospace', textAlign: 'center',
        }}>
          <div style={{ fontSize: '18px', marginBottom: '16px', color: '#ff6b6b' }}>
            App failed to load
          </div>
          <div style={{
            background: '#1a2744', padding: '16px', borderRadius: '8px',
            fontSize: '13px', maxWidth: '100%', wordBreak: 'break-word',
            color: '#f0a0a0', lineHeight: 1.5,
          }}>
            {this.state.error.message}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
