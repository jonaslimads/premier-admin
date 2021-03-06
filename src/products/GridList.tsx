import * as React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { Box, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { useCreatePath, NumberField, useGetList, useListController, ListControllerResult } from 'react-admin';
import { Link } from 'react-router-dom';

import { Product } from '../types';

interface Props {
    storeId?: string;
    products?: Product[];
}

const listProducts = (props: Props): ListControllerResult<Product> => {
    const { storeId } = props;
    return useListController({
        resource: 'products',
        filter: { storeId },
    })
}

const GridList = (props: Props) => {
    const { storeId, products } = props;

    if (products) {
        return <LoadedGridList products={products} />
    }

    if (!storeId) {
        return null;
    }

    const { isLoading, data } = listProducts(props);
    return isLoading ? <LoadingGridList storeId={storeId} /> : <LoadedGridList products={data} />;
};

export const useColsForWidth = () => {
    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.up('sm'));
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const lg = useMediaQuery(theme.breakpoints.up('lg'));
    const xl = useMediaQuery(theme.breakpoints.up('xl'));
    // there are all dividers of 24, to have full rows on each page
    if (xl) return 8;
    if (lg) return 6;
    if (md) return 4;
    if (sm) return 3;
    return 2;
};

const times = (nbChildren: number, fn: (key: number) => any) =>
    Array.from({ length: nbChildren }, (_, key) => fn(key));

const LoadingGridList = (props: Props) => {
    const { perPage } = listProducts(props);
    const cols = useColsForWidth();
    return (
        <ImageList rowHeight={180} cols={cols} sx={{ m: 0 }}>
            {times(perPage, key => (
                <ImageListItem key={key}>
                    <Box bgcolor="grey.300" height="100%" />
                </ImageListItem>
            ))}
        </ImageList>
    );
};

const LoadedGridList = (props: Props) => {
    const { products = [] } = props;

    const createPath = useCreatePath();
    const cols = useColsForWidth();

    return (
        <ImageList rowHeight={180} cols={cols} sx={{ m: 0 }}>
            {products.map(record => (
                <ImageListItem
                    component={Link}
                    key={record.id}
                    to={createPath({
                        resource: 'products',
                        id: record.id,
                        type: 'edit',
                    })}
                >
                    {record.attachments && record.attachments[0] &&
                        <img src={record.attachments[0]} alt={record.name} style={{ objectFit: 'contain' }} />
                    }
                    <ImageListItemBar
                        title={record.name}
                        subtitle={
                            <span>
                                <NumberField
                                    source="price"
                                    record={record}
                                    color="inherit"
                                    options={{
                                        style: 'currency',
                                        currency: 'USD',
                                    }}
                                    sx={{
                                        display: 'inline',
                                        fontSize: '1em',
                                    }}
                                />
                            </span>
                        }
                        sx={{
                            background:
                                'linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0) 100%)',
                        }}
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
};

export default GridList;
