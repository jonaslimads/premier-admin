import * as React from 'react';
import { SxProps, Typography, Avatar } from '@mui/material';
import { memo } from 'react';

import { FieldProps, useRecordContext } from 'react-admin';
import { Store } from '../types';

interface Props extends FieldProps<Store> {
    size?: string;
    sx?: SxProps;
}

const StoreNameField = (props: Props) => {
    const { size = '25' } = props;
    const record = useRecordContext<Store>();
    return record ? (
        <Typography
            variant="body2"
            display="flex"
            flexWrap="nowrap"
            alignItems="center"
            component="div"
            sx={props.sx}
        >
            {record.name}
        </Typography>
    ) : null;
};

StoreNameField.defaultProps = {
    source: 'name',
    label: 'resources.stores.fields.name',
};

export default memo<Props>(StoreNameField);
