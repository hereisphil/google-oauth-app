import { Navigate, Outlet } from "react-router";
import { useToken } from "./useToken";

export const PrivateRoute = ({ redirectPath }: { redirectPath: string }) => {
    const { user } = useToken();
    return user ? <Outlet /> : <Navigate to={redirectPath} replace />;
};
