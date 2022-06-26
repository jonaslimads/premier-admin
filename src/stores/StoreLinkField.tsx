import * as React from 'react';
import { Link, FieldProps, useRecordContext, TextField } from 'react-admin';

import { Store } from '../types';

const StoreLinkField = (props: FieldProps<Store>) => {
    const record = useRecordContext<Store>();
    if (!record) {
        return null;
    }
    return (
        <Link to={`/stores/${record.id}`}>
            <TextField source="name" />
        </Link>
    );
};

StoreLinkField.defaultProps = {
    source: 'name',
};

export default StoreLinkField;
