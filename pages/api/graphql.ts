import {ApolloServer} from 'apollo-server-micro';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {makeRemoteExecutableSchema, introspectSchema} from 'graphql-tools';
import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';

const FAUNA_DB = getConfig().serverRuntimeConfig.FAUNA_DB_TOKEN;

const httpLink = createHttpLink({
  uri: 'https://graphql.fauna.com/graphql',
  fetch,
});

const authLink = setContext((_, {headers}) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${FAUNA_DB}`,
    },
  };
});

const link = authLink.concat(httpLink);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const server = new ApolloServer({
    schema: makeRemoteExecutableSchema({
      schema: await introspectSchema(link),
      link,
    }),
    context(ctx) {
      return ctx;
    },
  });
  const handler = server.createHandler({path: '/api/graphql'});
  return handler(req, res);
};
