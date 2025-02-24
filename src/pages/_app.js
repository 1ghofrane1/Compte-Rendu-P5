import "@/styles/globals.css";
import Header from '@/components/Header'
import { Provider as JotaiProvider } from 'jotail';

export default function App({ Component, pageProps }) {
  return (
    <JotailProvider>
      <Header />
      <Component {...pageProps} />;
    </JotailProvider>
);
}
