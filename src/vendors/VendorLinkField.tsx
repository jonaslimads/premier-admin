import * as React from 'react';
import { Link, FieldProps, useRecordContext, TextField } from 'react-admin';

import { Vendor } from '../types';

const VendorLinkField = (props: FieldProps<Vendor>) => {
    const record = useRecordContext<Vendor>();
    if (!record) {
        return null;
    }
    return (
        <Link to={`/vendors/${record.id}`}>
            <TextField source="name" />
        </Link>
    );
};

VendorLinkField.defaultProps = {
    source: 'name',
};

export default VendorLinkField;
