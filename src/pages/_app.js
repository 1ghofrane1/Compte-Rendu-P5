import "@/styles/globals.css";
import Header from '@/components/Header'
import { Provider as JotaiProvider } from 'jotai';

export default function App({ Component, pageProps }) {
  return (
    <JotaiProvider>
      <Header />
      <Component {...pageProps} />;
    </JotaiProvider>
);
}
