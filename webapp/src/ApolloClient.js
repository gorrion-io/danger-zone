import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from 'apollo-boost';
import { AUTH_TOKEN } from './utils/constants/local-storage.const';

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN);

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

const httpLink = new HttpLink({ uri: 'http://localhost:5000/graphql' });

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
