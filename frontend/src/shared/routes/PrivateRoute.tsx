import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getJwtToken, validateJwtToken } from "../utils/authUtils";

interface IProps {
  children: React.ReactElement;
}

export default function PrivateRoute(props: IProps) {
  const { children } = props;
  const location = useLocation();
  const role = location.pathname.split("/")[1];
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchValidation = async () => {
      const jwtToken = getJwtToken();
      if (jwtToken) {
        const isValid = await validateJwtToken(jwtToken, role);
        setIsValidToken(isValid);
      }
      setLoading(false);
    };

    fetchValidation();
  }, [role]);

  if (loading) {
    return null; // or Loading indicator
  }

  if (!getJwtToken()) {
    const loginPath = `/login/${role}`;
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (isValidToken) {
    return children;
  } else {
    const loginPath = `/login/${role}`;
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }
}
