import * as React from 'react';
import { SxProps, Typography, Avatar } from '@mui/material';
import { memo } from 'react';

import { FieldProps, useRecordContext } from 'react-admin';
import { Store } from '../types';

interface Props extends FieldProps<Store> {
    size?: string;
    sx?: SxProps;
}

const SellerNameField = (props: Props) => {
    const { size = '25' } = props;
    const record = useRecordContext<Store>();
    const seller = record.seller;
    return record ? (
        <Typography
            variant="body2"
            display="flex"
            flexWrap="nowrap"
            alignItems="center"
            component="div"
            sx={props.sx}
        >
            <Avatar
                src={`${seller.attributes['avatar']}`}
                style={{ width: parseInt(size, 10), height: parseInt(size, 10) }}
                sx={{
                    mr: 1,
                    mt: -0.5,
                    mb: -0.5,
                }}
            />
            {seller.name}
        </Typography>
    ) : null;
};

SellerNameField.defaultProps = {
    source: 'seller.name',
    label: 'resources.stores.sellers.fields.name',
};

export default memo<Props>(SellerNameField);
