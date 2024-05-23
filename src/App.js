import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Layout } from "./Components/Layout/index";
import {
  Home,
  Venues,
  Profile,
  Venue,
  Contact,
  CreateVenuePage,
} from "./Pages/index.jsx";
import { AuthFormToggle } from "./Auth/AuthFormToggle";
import { AuthProvider } from "./Auth/index";
import { PrivateRoute } from "./Auth/Wrapper/index.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthFormToggle />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venue/:id" element={<Venue />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/createVenue"
              element={
                <PrivateRoute>
                  <CreateVenuePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
