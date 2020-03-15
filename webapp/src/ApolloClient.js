import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from 'apollo-boost';
import { setContext } from 'apollo-link-context';
import { AUTH_TOKEN, REFRESH_TOKEN } from './utils/constants/local-storage.const';
import { openErrorNotification } from './utils/notifications';
import { getTokenObjectToSave, isHalfLife } from './utils/helpers/auth-token.helper';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const serverUri = 'http://localhost:5000/graphql';
const wsServerUri = 'ws://localhost:5000/graphql';

const fetchRefreshToken = async (refreshToken) => {
  try {
    const fetchResult = await fetch(serverUri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation {
          token(getToken: {grantType: RefreshToken, refreshToken: "${refreshToken}" })
          {
            ...on Token{
              token
              refreshToken
            }
            ...on ErrorResponse{
              message
            }
          }
        }
    `,
      }),
    });

    const res = await fetchResult.json();
    if (res.errors && res.errors.message) {
      openErrorNotification('Something went wrong. Please retresh the page.');
    }

    localStorage.setItem(AUTH_TOKEN, JSON.stringify(getTokenObjectToSave(res.data.token.token)));
    localStorage.setItem(REFRESH_TOKEN, JSON.stringify(getTokenObjectToSave(res.data.token.refreshToken)));
  } catch (e) {
    openErrorNotification('Something went wrong. Please retresh the page.');
  }
};

const refreshTokenLink = setContext(
  () =>
    new Promise((success) => {
      const authToken = JSON.parse(localStorage.getItem(AUTH_TOKEN));
      const refreshToken = JSON.parse(localStorage.getItem(REFRESH_TOKEN));

      if (authToken && isHalfLife(authToken)) {
        fetchRefreshToken(refreshToken.token).then(() => success());
      } else {
        success();
      }
    }),
);

const authLink = new ApolloLink((operation, forward) => {
  const authToken = JSON.parse(localStorage.getItem(AUTH_TOKEN));

  if (authToken && authToken.token) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${authToken.token}`,
      },
    });
  } else {
    operation.setContext({
      headers: {},
    });
  }

  return forward(operation);
});

const httpLink = new HttpLink({ uri: serverUri });

const wsLink = new WebSocketLink({
  uri: wsServerUri,
  options: {
    reconnect: true,
    connectionParams: () => {
      const authToken = JSON.parse(localStorage.getItem(AUTH_TOKEN));
      return {
        authorization: `Bearer ${authToken.token}`,
      };
    },
  },
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  ApolloLink.from([refreshTokenLink, wsLink]),
  ApolloLink.from([refreshTokenLink, authLink, httpLink]),
);

export const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});
