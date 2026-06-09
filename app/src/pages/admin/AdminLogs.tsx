import { trpc } from "@/providers/trpc";
import AdminLayout from "./AdminLayout";
import { Loader2, Clock, User, FileText } from "lucide-react";

export default function AdminLogs() {
  const { data: logs, isLoading } = trpc.admin.listLogs.useQuery();

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-sm text-gray-500 mt-1">
          View all user activity logs
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                ID
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                User
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Action
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Resource
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Details
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                IP Address
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" />
                </td>
              </tr>
            ) : (logs || []).length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No logs found
                </td>
              </tr>
            ) : (
              logs?.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-600">{log.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-400" />
                      <span className="text-gray-900">
                        {log.userEmail || `User #${log.userId}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-gray-400" />
                      {log.resource || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                    {log.details || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {log.ipAddress || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
