import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import './index.css';
import { Suspense } from 'react';
import { store } from './store';
import App from './App';
import { I18nextProvider } from './i18nextProvider';
import i18n from '../i18n';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Suspense fallback={<div>Loading...</div>}>
    <Router>
      <I18nextProvider i18n={i18n} defaultNS="translation">
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Provider>
      </I18nextProvider>
    </Router>
  </Suspense>
);
