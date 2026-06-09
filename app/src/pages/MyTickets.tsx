import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import AppLayout from "@/components/AppLayout";
import { Loader2 } from "lucide-react";

export default function MyTickets() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useLocalAuth();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const { data: tickets, isLoading } = trpc.tickets.list.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const filteredTickets = (tickets || []).filter(
    (t) => t.ticketType === activeTab
  );

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My ticket(s)</h1>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 text-base font-medium transition-colors relative ${
              activeTab === "upcoming"
                ? "text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Upcoming match(es)
            {activeTab === "upcoming" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`pb-3 text-base font-medium transition-colors relative ${
              activeTab === "past"
                ? "text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Past match(es)
            {activeTab === "past" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : filteredTickets.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-12 h-12 text-gray-400"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <path d="M9 6v12M15 6v12" strokeDasharray="2 2" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-3">
              No ticket(s) found
            </p>
            <p className="text-sm text-gray-500 text-center leading-relaxed max-w-xs">
              There are no tickets associated with your email address. Please
              allow some time for your ticket(s) to appear in the app and ensure
              you are logged in with the same email address used for your FIFA
              ticketing account. If not, log out and sign back in with the
              correct email address.
            </p>
            <div className="mt-6 flex items-start gap-3 max-w-xs">
              <div className="w-8 h-8 flex-shrink-0 mt-1">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-gray-400" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M3 8h18" />
                  <circle cx="12" cy="14" r="2" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                If you purchased tickets via FIFA.com/tickets and need
                assistance, please check our FAQs.
              </p>
            </div>
          </div>
        ) : (
          /* Ticket Cards */
          <div className="space-y-4 pb-6">
            {filteredTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => navigate(`/ticket/${ticket.id}`)}
                className="w-full text-left animate-fade-in"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  {/* Ticket Banner - Colorful top */}
                  <div className="relative h-24 overflow-hidden">
                    <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                      <rect width="400" height="100" fill="#FF4136" />
                      <circle cx="80" cy="50" r="60" fill="#FF6B35" opacity="0.8" />
                      <circle cx="200" cy="30" r="50" fill="#2ECC40" opacity="0.7" />
                      <circle cx="320" cy="60" r="55" fill="#0074D9" opacity="0.7" />
                      <circle cx="150" cy="70" r="40" fill="#B10DC9" opacity="0.5" />
                    </svg>
                    {/* Date Badge */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-lg px-2.5 py-1.5 text-center shadow-sm">
                      <div className="text-xs text-gray-600 uppercase">{ticket.matchDate.split(" ")[0]}</div>
                      <div className="text-lg font-bold text-gray-900 leading-tight">
                        {ticket.matchDate.split(" ")[1]}
                      </div>
                      <div className="text-[10px] text-gray-500">{ticket.matchTime}</div>
                    </div>
                  </div>
                  {/* Ticket Info */}
                  <div className="p-3">
                    <p className="font-semibold text-gray-900 text-sm">
                      {ticket.eventName}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">{ticket.venue}</p>
                      <div className="flex items-center gap-1 text-gray-400">
                        <span className="text-xs">1</span>
                        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
                          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                          <polyline points="16 6 12 2 8 6" />
                          <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
