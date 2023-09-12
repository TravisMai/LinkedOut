import React, { ElementType, PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface IProps {
    layout: ElementType;
}

const PrivateRoute: React.FC<PropsWithChildren<IProps>> = (props) => {
    const { children, layout: Layout } = props;
    const { pathname } = useLocation();


    return<Layout>{children}</Layout>
};

export { PrivateRoute };
