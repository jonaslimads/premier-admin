import { GetListResult, GetOneResult } from 'ra-core';

// import { GraphQlResource } from './graphQlResource';
// import { CATEGORIES } from './categories';
import { PRODUCTS } from './products';
// import { REVIEWS } from './reviews';

export const transformParams = (name: string, params: any): any => {
    const newParams: { [key: string]: string | number | any } = { filter: {} };

    // temp
    newParams.filter['vendorId'] = '332807312191';

    const pagination = params.pagination;
    if (pagination && pagination.page && pagination.perPage && pagination.page > 0 && pagination.perPage > 0) {
        newParams.first = pagination.perPage;
    }
    if (params.sort) {
        newParams.sort = params.sort;
    }
    if (params.id) {
        newParams.id = params.id;
    }
    if (params.meta) {
        newParams.meta = params.meta;
    }
    if (params.target && params.id) {
        newParams.filter[params.target] = params.id;
    }
    if (params.data) {
        newParams.data = params.data;
    }
    if (params.previousData) {
        newParams.previousData = params.previousData;
    }
    return newParams;
}

export const mapGetListResult = (resource: string, response: any): GetListResult<any> => {
    const data = response.data.data;
    const result = {
        data: data.edges.map((edge: any) => {
            let node = edge.node;
            let result = { ...node };
            if (resource === PRODUCTS && edge.categoryId) {
                result.categoryId = edge.categoryId;
            }
            return result;
        }),
        total: data.total,
        pageInfo: data.pageInfo
    }
    return result;
};

export const mapGetManyReferenceResult = (resource: string, response: any): GetListResult<any> => {
    const data = response.data.data;
    const result = {
        data: data.edges.map((edge: any) => {
            let node = edge.node;
            let result = { ...node };
            if (resource === PRODUCTS && edge.categoryId) {
                result.categoryId = edge.categoryId;
            }
            return result;
        }),
        total: data.total,
        pageInfo: data.pageInfo
    }
    return result;
};

export const mapGetOneResult = (resource: string, response: any): GetOneResult<any> => {
    const data = response.data.data;
    if (resource === PRODUCTS) {
        data.categoryId = data.Category.id;
    }
    return { data: data };
}

export const mapMutation = (resource: string, response: any): any => {
    return { data: response.data }
}