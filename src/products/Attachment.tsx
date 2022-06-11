import * as React from 'react';
import { Box, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { Link } from 'react-router-dom';
import { useCreatePath, useRecordContext } from 'react-admin';
import { Product } from '../types';
import { useColsForWidth } from './GridList';

const AttachmentList = () => {
    const record = useRecordContext<Product>();
    if (!record) {
        return null
    };

    const name = record.name;
    const attachments = record.attachments;
    const cols = useColsForWidth();

    return (
        <ImageList rowHeight={180} cols={cols} sx={{ m: 0 }}>
            {attachments.map((attachment: string, index: number) => (
                <ImageListItem key={index}>
                    <img src={attachment} alt={name} style={{ objectFit: 'contain' }} />
                </ImageListItem>
            ))}
        </ImageList>
    );
};

export default AttachmentList;
