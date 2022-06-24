import * as React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { Box, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { useCreatePath, NumberField, useListContext } from 'react-admin';
import { Link } from 'react-router-dom';

const GridList = () => {
    const { isLoading } = useListContext();
    return isLoading ? <LoadingGridList /> : <LoadedGridList />;
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

const LoadingGridList = () => {
    const { perPage } = useListContext();
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

const LoadedGridList = () => {
    const { data } = useListContext();
    const createPath = useCreatePath();

    if (!data) {
        return null
    }

    return (
        <ImageList rowHeight={180} cols={4} sx={{ m: 0 }}>
            {data.map(record => (
                <ImageListItem
                    component={Link}
                    key={record.id}
                    to={createPath({
                        resource: 'products',
                        id: record.id,
                        type: 'edit',
                    })}
                >
                    {record.attachments[0] &&
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
