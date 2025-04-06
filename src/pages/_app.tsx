import type { AppProps } from 'next/app';
import AuthGuard from '../components/AuthGuard';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthGuard>
      <Component {...pageProps} />
    </AuthGuard>
  );
}

export default MyApp; 