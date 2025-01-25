import { provideApollo } from 'apollo-angular';
import { inject } from '@angular/core';
import { HttpLink } from 'apollo-angular/http';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { InMemoryCache, split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql/index';

export const graphqlProvider = provideApollo(() => {
  const httpLink = inject(HttpLink);// Create an http link:
  const http = httpLink.create({
    uri: 'http://localhost:3000/graphql',
  });

  const ws = new GraphQLWsLink(
    createClient({
      url: 'ws://localhost:3000/graphql',
    }),
  );

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === Kind.OPERATION_DEFINITION &&
        definition.operation === OperationTypeNode.SUBSCRIPTION
      );
    },
    ws,
    http,
  );

  return {
    link,
    cache: new InMemoryCache(),
  };
});
