import { useState } from "react";
import { trpc } from "@/providers/trpc";
import AdminLayout from "./AdminLayout";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AdminTickets() {
  const utils = trpc.useUtils();
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const { data: tickets, isLoading } = trpc.admin.listAllTickets.useQuery();

  const deleteTicket = trpc.admin.adminDeleteTicket.useMutation({
    onSuccess: () => {
      utils.admin.listAllTickets.invalidate();
      setDeleteConfirm(null);
    },
  });

  const filteredTickets = (tickets || []).filter(
    (t) =>
      t.eventName.toLowerCase().includes(search.toLowerCase()) ||
      t.venue.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Tickets</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage all tickets in the system
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tickets by event or venue..."
          className="pl-10"
        />
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                ID
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Event
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Venue
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Date & Time
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                User ID
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Type
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" />
                </td>
              </tr>
            ) : filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  No tickets found
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-600">{ticket.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {ticket.eventName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{ticket.venue}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {ticket.matchDate} {ticket.matchTime}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {ticket.userId}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        ticket.ticketType === "upcoming"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ticket.ticketType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        ticket.status === "active"
                          ? "bg-blue-100 text-blue-700"
                          : ticket.status === "used"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDeleteConfirm(ticket.id)}
                      className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this ticket? This action cannot be
            undone.
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirm && deleteTicket.mutate({ id: deleteConfirm })
              }
              disabled={deleteTicket.isPending}
              className="flex-1"
            >
              {deleteTicket.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
