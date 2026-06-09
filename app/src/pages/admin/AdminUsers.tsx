import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  Ticket,
} from "lucide-react";

export default function AdminUsers() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [search, setSearch] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [ticketUser, setTicketUser] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Form states
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCountry, setFormCountry] = useState("");

  // Ticket form states
  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [entrance, setEntrance] = useState("");
  const [gate, setGate] = useState("");
  const [seat, setSeat] = useState("");
  const [row, setRow] = useState("");
  const [ticketCategory, setTicketCategory] = useState("");

  const { data: users, isLoading } = trpc.admin.listUsers.useQuery();

  const createUser = trpc.admin.createUser.useMutation({
    onSuccess: () => {
      utils.admin.listUsers.invalidate();
      setShowCreateDialog(false);
      resetForm();
    },
  });

  const updateUser = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
      utils.admin.listUsers.invalidate();
      setShowEditDialog(false);
      setEditingUser(null);
    },
  });

  const deleteUser = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      utils.admin.listUsers.invalidate();
      setDeleteConfirm(null);
    },
  });

  const createTicket = trpc.admin.adminCreateTicket.useMutation({
    onSuccess: () => {
      utils.admin.listAllTickets.invalidate();
      setShowTicketDialog(false);
      setTicketUser(null);
      resetTicketForm();
    },
  });

  const resetForm = () => {
    setFormEmail("");
    setFormPassword("");
    setFormFirstName("");
    setFormLastName("");
    setFormPhone("");
    setFormCountry("");
  };

  const resetTicketForm = () => {
    setEventName("");
    setVenue("");
    setMatchDate("");
    setMatchTime("");
    setEntrance("");
    setGate("");
    setSeat("");
    setRow("");
    setTicketCategory("");
  };

  const filteredUsers = (users || []).filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your app users
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Email *</Label>
                <Input
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="user@email.com"
                />
              </div>
              <div>
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Min 6 characters"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+1 234 567 890"
                />
              </div>
              <div>
                <Label>Country</Label>
                <Input
                  value={formCountry}
                  onChange={(e) => setFormCountry(e.target.value)}
                  placeholder="United States"
                />
              </div>
              <Button
                onClick={() =>
                  createUser.mutate({
                    email: formEmail,
                    password: formPassword,
                    firstName: formFirstName,
                    lastName: formLastName,
                    phone: formPhone,
                    country: formCountry,
                  })
                }
                disabled={createUser.isPending}
                className="w-full"
              >
                {createUser.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create User"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
          placeholder="Search users by email..."
          className="pl-10"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                ID
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Email
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Role
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Created
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" />
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-600">{user.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setFormEmail(user.email);
                          setFormFirstName(user.firstName || "");
                          setFormLastName(user.lastName || "");
                          setFormPhone(user.phone || "");
                          setFormCountry(user.country || "");
                          setShowEditDialog(true);
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => {
                          setTicketUser(user);
                          setShowTicketDialog(true);
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Create Ticket"
                      >
                        <Ticket size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(user.id)}
                        className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Email</Label>
              <Input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>First Name</Label>
                <Input
                  value={formFirstName}
                  onChange={(e) => setFormFirstName(e.target.value)}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={formLastName}
                  onChange={(e) => setFormLastName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
            </div>
            <div>
              <Label>Country</Label>
              <Input
                value={formCountry}
                onChange={(e) => setFormCountry(e.target.value)}
              />
            </div>
            <Button
              onClick={() =>
                updateUser.mutate({
                  id: editingUser.id,
                  data: {
                    email: formEmail,
                    firstName: formFirstName,
                    lastName: formLastName,
                    phone: formPhone,
                    country: formCountry,
                  },
                })
              }
              disabled={updateUser.isPending}
              className="w-full"
            >
              {updateUser.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Update User"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Ticket Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Create Ticket for {ticketUser?.email}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Event Name *</Label>
              <Input
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Team A vs Team B"
              />
            </div>
            <div>
              <Label>Venue *</Label>
              <Input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Boston Stadium"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Match Date *</Label>
                <Input
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  placeholder="e.g. 11 JUN 26"
                />
              </div>
              <div>
                <Label>Match Time *</Label>
                <Input
                  value={matchTime}
                  onChange={(e) => setMatchTime(e.target.value)}
                  placeholder="e.g. 14:00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Entrance</Label>
                <Input
                  value={entrance}
                  onChange={(e) => setEntrance(e.target.value)}
                  placeholder="e.g. E"
                />
              </div>
              <div>
                <Label>Gate</Label>
                <Input
                  value={gate}
                  onChange={(e) => setGate(e.target.value)}
                  placeholder="e.g. G"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Row</Label>
                <Input
                  value={row}
                  onChange={(e) => setRow(e.target.value)}
                  placeholder="e.g. 103"
                />
              </div>
              <div>
                <Label>Seat</Label>
                <Input
                  value={seat}
                  onChange={(e) => setSeat(e.target.value)}
                  placeholder="e.g. 331"
                />
              </div>
            </div>
            <div>
              <Label>Ticket Category</Label>
              <Input
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                placeholder="e.g. Suite Barstool"
              />
            </div>
            <Button
              onClick={() =>
                createTicket.mutate({
                  userId: ticketUser.id,
                  eventName,
                  venue,
                  matchDate,
                  matchTime,
                  entrance,
                  gate,
                  seat,
                  row,
                  ticketCategory,
                })
              }
              disabled={createTicket.isPending || !eventName || !venue || !matchDate || !matchTime}
              className="w-full"
            >
              {createTicket.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create Ticket"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this user? All their tickets will also
            be deleted. This action cannot be undone.
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
              onClick={() => deleteConfirm && deleteUser.mutate({ id: deleteConfirm })}
              disabled={deleteUser.isPending}
              className="flex-1"
            >
              {deleteUser.isPending ? (
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
