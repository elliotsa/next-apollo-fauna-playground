import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createHttpLink} from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';

import {ApolloProvider} from 'react-apollo';

const client = new ApolloClient({
  link: createHttpLink({
    uri: '/api/graphql',
    fetch,
  }),
  cache: new InMemoryCache(),
});

const ALL_USERS = gql`
  query allUsers {
    allUsers {
      data {
        first_name
        last_name
        _id
      }
    }
  }
`;

function Page() {
  const {loading, error, data} = useQuery(ALL_USERS);
  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;
  return <pre>{JSON.stringify(data)}</pre>;
}

export default () => {
  return (
    <ApolloProvider client={client}>
      <Page />
    </ApolloProvider>
  );
};
