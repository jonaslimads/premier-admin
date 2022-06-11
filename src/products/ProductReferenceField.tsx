import * as React from 'react';
import { ReferenceField, ReferenceFieldProps, TextField } from 'react-admin';
import { onRealData } from '../dataProvider';


const PRODUCT_ID = onRealData('id', 'product_id');
const REFERENCE = onRealData('name', 'reference');

interface Props {
    source?: string;
}

const ProductReferenceField = (
    props: Props &
        Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>
) => (
    <ReferenceField
        label="Product"
        source={PRODUCT_ID}
        reference="products"
        {...props}
    >
        <TextField source={REFERENCE} />
    </ReferenceField>
);

ProductReferenceField.defaultProps = {
    source: PRODUCT_ID,
};

export default ProductReferenceField;
