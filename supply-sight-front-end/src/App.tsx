import React from 'react';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client/react';

import apolloClient from './config/apollo-client.ts';

import { store } from './store';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
      <Layout>
        <Dashboard />
      </Layout>
      </ApolloProvider>
    </Provider>
  );
}

export default App;