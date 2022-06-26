import gql from 'graphql-tag';

import { mapGetOneResult, mapMutation, mapGetManyReferenceResult, mapGetListResult, transformParams } from './mappers';
import { GraphQlResource } from './graphQlResource';

export const PRODUCTS = 'products';

export class ProductsGraphQl extends GraphQlResource {
    constructor() {
        super(PRODUCTS)
    }

    public getList(params: any): Promise<any> {
        console.warn(params);
        return this.runQuery(
            gql`
                query GetListProducts($filter: JSONObject, $sort: [OrderBy], $after: String, $before: String, $first: Int, $last: Int) {
                    data: products(filter: $filter, sort: $sort, after: $after, before: $before, first: $first, last: $last) {
                        edges {
                            node {
                                id
                                name
                                slug
                                currency
                                price
                                attachments
                                attributes
                            }
                            categoryId
                        }
                        pageInfo {
                            hasNextPage
                            hasPreviousPage
                        }
                        total
                    }
                }
            `,
            params,
            mapGetListResult
        );
    }

    public getOne(params: any): Promise<any> {
        return this.runQuery(
            gql`
                query GetOneProduct($id: String!) {
                    data: product(id: $id) {
                        id
                        name
                        description
                        slug
                        currency
                        price
                        attachments
                        attributes
                        Category: category {
                            id
                        }
                        store {
                            id
                        }
                        Reviews: reviews {
                            id
                        }
                    }
                }
            `,
            params,
            mapGetOneResult);
    }


    public updateOne(params: any): Promise<any> {
        const { data, previousData } = params;

        const id = params.id;
        const variables: string[] = ['$id: String!'];
        const mutationData: any = { id };

        let updateName = '';
        let updateDescription = '';
        let updateSlug = '';
        let updateCategoryId = '';

        if (data.name !== previousData.name) {
            variables.push('$name: String!');
            mutationData['name'] = data.name;
            updateName = `
                updateProductName(
                    command: {
                        id: $id,
                        name: $name
                    }
                )
            `;
        }
        if (data.description !== previousData.description) {
            variables.push('$description: String!');
            mutationData['description'] = data.description;
            updateDescription = `
                updateProductDescription(
                    command: {
                        id: $id,
                        description: $description
                    }
                )
            `;
        }
        if (data.slug !== previousData.slug) {
            variables.push('$slug: String!');
            mutationData['slug'] = data.slug;
            updateSlug = `
                updateProductSlug(
                    command: {
                        id: $id,
                        slug: $slug
                    }
                )
            `;
        }
        if (data.categoryId !== previousData.categoryId) {
            if (previousData.categoryId !== '') {
                variables.push('$categoryId: String!');
                variables.push('$storeId: String!');
                mutationData['categoryId'] = data.categoryId;
                mutationData['storeId'] = data.store.id;
                updateCategoryId = `
                    categorizeProduct(
                        command: {
                            id: $id,
                            storeId: $storeId,
                            categoryId: $categoryId,
                        }
                    )
                `;
            } else {
                //  TODO uncategorize
            }
        }

        const mutation = `
            mutation UpdateProduct(${variables.join(',')}) {
                ${updateName}
                ${updateDescription}
                ${updateSlug}
                ${updateCategoryId}
            }
        `;

        return this.runQuery(gql`${mutation}`, mutationData, mapMutation({ id }));
    }
}