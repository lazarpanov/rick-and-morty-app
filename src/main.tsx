import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./i18n/config.ts";

import './index.css'
import App from './App.tsx'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

import { Provider } from './components/ui/provider.tsx';

export const client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql",
  cache: new InMemoryCache(),
});



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <Provider>
        <App />
      </Provider>
    </ApolloProvider>
  </StrictMode>
)
