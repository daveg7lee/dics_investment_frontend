import {
  ApolloClient,
  InMemoryCache,
  makeVar,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { LOCALSTORAGE_TOKEN } from './constants';

let token;

export const logUserOut = () => {
  localStorage.removeItem(LOCALSTORAGE_TOKEN);
  window.location.href = '/';
};

if (process.browser) {
  token = localStorage.getItem(LOCALSTORAGE_TOKEN);
}
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'http://localhost:4000/graphql'
      : 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-jwt': authTokenVar() || '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({}),
});
