import '../styles/globals.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { client } from '../apollo';
import Header from '../components/header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Header />
      <div className="pt-16 lg:w-lg lg:px-0 lg:m-auto px-6 min-h-screen">
        <Component {...pageProps} />
      </div>
      <ToastContainer />
    </ApolloProvider>
  );
}
export default MyApp;
