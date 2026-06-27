import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TripsPage from "./pages/TripsPage";
import ProtectedRoute from "./ProtectedRoute";
import NewTripPage from "./pages/NewTripPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
            <Route
                path="/trips"
                element={
                    <ProtectedRoute>
                        <TripsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/trips/new"
                element={
                    <ProtectedRoute>
                        <NewTripPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;