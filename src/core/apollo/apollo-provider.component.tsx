import React, { FunctionComponent } from 'react';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://api-mobile-app.azurewebsites.net/api/graph',
});

export const P9ApolloProvider: FunctionComponent = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
