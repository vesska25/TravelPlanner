import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TripsPage from "./pages/TripsPage";
import ProtectedRoute from "./ProtectedRoute";
import NewTripPage from "./pages/NewTripPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./Navbar";
import EditTripPage from "./pages/EditTripPage";
import TripDetailPage from "./pages/TripDetailPage";
import Profile from "./pages/Profile";
import { AuthProvider } from "./AuthContext";
import AllPlacesMapPage from "./pages/AllPlacesMapPage";
import Footer from "./Footer";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
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
                        path="/trips/:id/edit"
                        element={
                            <ProtectedRoute>
                                <EditTripPage />
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
                    <Route
                        path="/trips/:id"
                        element={
                            <ProtectedRoute>
                                <TripDetailPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/map"
                        element={
                            <ProtectedRoute>
                                <AllPlacesMapPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
                <Footer />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;