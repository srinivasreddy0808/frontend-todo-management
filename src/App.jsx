import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Toaster } from "sonner";
import AppLayout from "./layout/AppLayout";
import Board from "./features/board/Board";
import Analytics from "./features/analytics/Analytics";
import Settings from "./features/settings/Settings";
import Register from "./features/authentication/Register";
import Login from "./features/authentication/Login";
import PublicTask from "./components/PublicTask";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  console.log("token in isAuthenticated", token);

  if (!token) return false;

  try {
    // Decode the token
    const decodedToken = jwtDecode(token);

    // Get the current time and the token's expiry time
    const currentTime = Date.now() / 1000; // Converting  milliseconds to seconds
    const expiryTime = decodedToken.exp; // Expiry time in seconds

    // Check if the token has expired
    return currentTime < expiryTime;
  } catch (error) {
    return false;
  }
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate to="/app/board" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="task/:taskId" element={<PublicTask />} />
          <Route
            path="app"
            element={
              isAuthenticated() ? (
                <AppLayout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route path="board" element={<Board />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "white",
            padding: "16px",
            borderRadius: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            color: "#334155",
            fontSize: "18px",
            fontWeight: "500",
            width: "auto",
            minWidth: "200px",
            border: "1px solid #48C1B5",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />
    </>
  );
}

export default App;
