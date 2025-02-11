import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./layout/Navbar";
import User from "./users/Users";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AddUser from "./users/AddUser";
import EditUser from "./users/EditUser";
import ViewUser from "./users/ViewUser";
import LoginForm from "./forms/LoginForm";
import RegisterForm from "./forms/RegisterForm";
import Home from "./pages/Home";
import Choose from "./pages/Choose";
import AddDevice from "./devices/AddDevice";
import EditDevice from "./devices/EditDevice";
import ViewDevice from "./devices/ViewDevice";
import ForgotPasswordForm from "./forms/ForgotPasswordForm";
import ResetPasswordForm from "./forms/ResetPasswordForm";
import UserProfile from "./pages/UserProfile";
import Footer from "./layout/Footer";
import DevicesPage from "./devices/Devices";
import PrivateRoute from "./PrivateRoute";
import Notifications from "./notifications/Notifications";
import ChatRoom from "./chat/ChatRoom";
import AdminChat from "./chat/AdminChat";

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const ChatRedirect = () => {
    if (userRole === "ADMIN") {
      return <Navigate to="/admin/chat" />;
    }
    return <Navigate to="/chat" />;
  };

  return (
      <div className="App">
        <Router>
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route exact path="/login" element={<LoginForm />} />
              <Route exact path="/register" element={<RegisterForm />} />
              <Route exact path="/home" element={<Home />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/chat" element={<ChatRoom />} />

              {/* Redirecționare bazată pe rol */}
              <Route path="/chat-redirect" element={<ChatRedirect />} />

              <Route element={<PrivateRoute isAuthenticated={isAuthenticated} userRole={userRole} />}>
                <Route exact path="/user" element={<User />} />
                <Route exact path="/adduser" element={<AddUser />} />
                <Route exact path="/edituser/:id" element={<EditUser />} />
                <Route exact path="/viewuser/:id" element={<ViewUser />} />
                <Route exact path="/admin" element={<Choose />} />
                <Route path="/device" element={<DevicesPage />} />
                <Route exact path="/adddevice" element={<AddDevice />} />
                <Route exact path="/editdevice/:id" element={<EditDevice />} />
                <Route exact path="/viewdevice/:id" element={<ViewDevice />} />
                <Route path="/admin/chat" element={<AdminChat />} />
              </Route>
            </Routes>
          </div>
          <Footer />
          {isAuthenticated && <Notifications />}
        </Router>
      </div>
  );
}

export default App;
