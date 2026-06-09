import { trpc } from "@/providers/trpc";
import AdminLayout from "./AdminLayout";
import { Users, Ticket, Calendar, Clock } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = trpc.admin.getStats.useQuery();

  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Tickets",
      value: stats?.totalTickets ?? 0,
      icon: Ticket,
      color: "bg-green-500",
    },
    {
      title: "Upcoming Tickets",
      value: stats?.upcomingTickets ?? 0,
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      title: "Past Tickets",
      value: stats?.pastTickets ?? 0,
      icon: Clock,
      color: "bg-orange-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your ticket management system
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
            >
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.title}</p>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
