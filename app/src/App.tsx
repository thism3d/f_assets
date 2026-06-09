import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import MyTickets from "./pages/MyTickets";
import TicketDetail from "./pages/TicketDetail";
import TicketSend from "./pages/TicketSend";
import TicketResale from "./pages/TicketResale";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminLogs from "./pages/admin/AdminLogs";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* User app routes */}
      <Route path="/" element={<Navigate to="/tickets" replace />} />
      <Route path="/tickets" element={<MyTickets />} />
      <Route path="/ticket/:id" element={<TicketDetail />} />
      <Route path="/ticket/:id/send" element={<TicketSend />} />
      <Route path="/ticket/:id/resale" element={<TicketResale />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/more" element={<Profile />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/users/:id" element={<AdminUserDetail />} />
      <Route path="/admin/tickets" element={<AdminTickets />} />
      <Route path="/admin/logs" element={<AdminLogs />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
