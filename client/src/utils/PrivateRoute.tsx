import { Navigate, Outlet } from "react-router";

export const PrivateRoute = ({
    isAllowed,
    redirectPath,
}: {
    isAllowed: boolean;
    redirectPath: string;
}) => {
    return isAllowed ? <Outlet /> : <Navigate to={redirectPath} replace />;
};
