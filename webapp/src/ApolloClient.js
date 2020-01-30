import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from 'apollo-boost';
import { getTokenFromLocalStorage } from './utils/helpers/local-storage.helper';

const authLink = new ApolloLink((operation, forward) => {
  const token = getTokenFromLocalStorage();

  if (token && token.authToken) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token.authToken}`,
      },
    });
  } else {
    operation.setContext({
      headers: {},
    });
  }

  return forward(operation);
});

const httpLink = new HttpLink({ uri: 'http://localhost:5000/graphql' });

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
