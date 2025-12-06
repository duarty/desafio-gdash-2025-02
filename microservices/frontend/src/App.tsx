import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./presentation/layouts/main-layout";
import { LoginPage } from "./presentation/pages/login-page";
import { DashboardPage } from "./presentation/pages/dashboard-page";
import { UsersPage } from "./presentation/pages/users-page";
import { InsightsPage } from "./presentation/pages/insights-page";
import { ProtectedRoute } from "./presentation/components/protected-route";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/insights" element={<InsightsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
