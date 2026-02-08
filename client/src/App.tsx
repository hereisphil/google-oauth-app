import { Route, Routes } from "react-router";
import { Home } from "./pages/Home.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { UserInfoPage } from "./pages/UserInfoPage.tsx";
import { PrivateRoute } from "./utils/PrivateRoute.tsx";
import { useToken } from "./utils/useToken.ts";

function App() {
    const { token } = useToken();

    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            {/* PRIVATE ROUTES: */}
            <Route
                element={
                    <PrivateRoute redirectPath="/login" isAllowed={!!token} />
                }
            >
                <Route path="/user-info" element={<UserInfoPage />} />
            </Route>
        </Routes>
    );
}

export default App;
