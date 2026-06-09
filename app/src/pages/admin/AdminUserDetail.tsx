import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import AdminLayout from "./AdminLayout";
import { Loader2, ChevronLeft, Ticket, Clock } from "lucide-react";

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = Number(id);

  const { data: user, isLoading } = trpc.admin.getUser.useQuery({ id: userId });
  const { data: userTickets } = trpc.admin.getUserTickets.useQuery({
    userId,
  });
  const { data: logs } = trpc.admin.getUserLogs.useQuery({ userId });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-gray-500">User not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <button
        onClick={() => navigate("/admin/users")}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ChevronLeft size={18} />
        Back to Users
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {user.firstName} {user.lastName}
        </h1>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Info */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">User Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">ID</span>
              <span className="text-sm font-medium">{user.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">First Name</span>
              <span className="text-sm font-medium">
                {user.firstName || "-"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Last Name</span>
              <span className="text-sm font-medium">
                {user.lastName || "-"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Phone</span>
              <span className="text-sm font-medium">
                {user.phone || "-"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Country</span>
              <span className="text-sm font-medium">
                {user.country || "-"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Language</span>
              <span className="text-sm font-medium">
                {user.language || "en"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Role</span>
              <span className="text-sm font-medium">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.role}
                </span>
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-500">Created</span>
              <span className="text-sm font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* User's Tickets */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Ticket size={18} className="text-gray-600" />
            <h2 className="text-lg font-semibold">
              Tickets ({userTickets?.length || 0})
            </h2>
          </div>
          {(userTickets || []).length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              No tickets for this user
            </p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {userTickets?.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-3 bg-gray-50 rounded-lg text-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{ticket.eventName}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        ticket.ticketType === "upcoming"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ticket.ticketType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {ticket.matchDate} {ticket.matchTime} @ {ticket.venue}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {ticket.entrance && `Entrance ${ticket.entrance}`}
                    {ticket.gate && ` | Gate ${ticket.gate}`}
                    {ticket.seat && ` | Seat ${ticket.seat}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Logs */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-gray-600" />
            <h2 className="text-lg font-semibold">
              Activity Logs ({logs?.length || 0})
            </h2>
          </div>
          {(logs || []).length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              No activity logs for this user
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">
                      Action
                    </th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">
                      Resource
                    </th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">
                      Details
                    </th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs?.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="px-3 py-2">
                        <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-600">
                        {log.resource || "-"}
                      </td>
                      <td className="px-3 py-2 text-gray-600 max-w-xs truncate">
                        {log.details || "-"}
                      </td>
                      <td className="px-3 py-2 text-gray-500 text-xs">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
