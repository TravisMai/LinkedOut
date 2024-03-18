import React, { ElementType, PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie

interface IProps {
    layout: ElementType;
}

const PrivateRoute: React.FC<PropsWithChildren<IProps>> = (props) => {
    const { children, layout: Layout } = props;
    // tạo 1 list cho từng app trữ endpoint
    // check list + location suy ra role
    // const staffList = ['/student', '/staff', '/company'];
    // const studentList = ['/student', '/company'];
    const location = useLocation();

    // if (staffList.includes(location.pathname)) {
    //     const token = Cookies.get('token');
    //     // get api gì đó để check role của token
    //     // return true nếu role hợp lệ, ngược lại return false
    //     return <Navigate to="/login" />;
    // }

    const isValidToken = () => {
        const token = Cookies.get('token');
        // get api gì đó dể check token có hợp lệ không
        // return true nếu token hợp lệ, ngược lại return false
        return token && token !== '';
    };

    if (!isValidToken()) {
        const loginPath = `/login${location.pathname}`;
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    return <Layout>{children}</Layout>;
};

export { PrivateRoute };