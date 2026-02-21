import { Route, Routes } from "react-router";
import { Dashboard } from "./pages/Dashboard.tsx";
import { Home } from "./pages/Home.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { UserInfoPage } from "./pages/UserInfoPage.tsx";
import { PrivateRoute } from "./utils/PrivateRoute.tsx";

function App() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            {/* PRIVATE ROUTES: */}
            <Route element={<PrivateRoute redirectPath="/login" />}>
                <Route path="/user-info" element={<UserInfoPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    );
}

export default App;
