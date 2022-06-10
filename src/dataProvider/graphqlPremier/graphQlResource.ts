import { ApolloClient, NormalizedCacheObject, OperationVariables } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';


type RunQueryType = <T = any, TVariables = OperationVariables>(
    query: DocumentNode | TypedDocumentNode<T, TVariables>,
    variables: any,
    mapper: (resource: string, response: any) => any) => Promise<any>;

export abstract class GraphQlResource {
    resource: string;
    client: ApolloClient<NormalizedCacheObject> | null;

    constructor(resource: string) {
        this.resource = resource;
        this.client = null;
    }

    public setClient(client: ApolloClient<NormalizedCacheObject>) {
        this.client = client;
    }

    public runQuery: RunQueryType = <T = any, TVariables = OperationVariables>(
        query: DocumentNode | TypedDocumentNode<T, TVariables>,
        variables: any,
        mapper: (resource: string, response: any) => any) => {
        if (this.client === null) {
            return Promise.reject({ error: 'No Apollo client set' });
        } else {
            return this.client.query({
                query,
                variables,
            }).then(response => Promise.resolve(mapper(this.resource, response))).catch(error => Promise.reject(error));
        }

    }
}