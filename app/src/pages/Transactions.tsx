import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { trpc } from "@/providers/trpc";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

export default function Transactions() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useLocalAuth();
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

  const { data: transactions, isLoading } = trpc.transactions.list.useQuery(
    undefined,
    { enabled: !!user }
  );

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

  const filteredTransactions = (transactions || []).filter(
    (t) => t.status === activeTab
  );

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Transactions</h1>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-3 text-base font-medium transition-colors relative ${
              activeTab === "pending"
                ? "text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Pending
            {activeTab === "pending" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-3 text-base font-medium transition-colors relative ${
              activeTab === "completed"
                ? "text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Completed
            {activeTab === "completed" && (
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
        ) : filteredTransactions.length === 0 ? (
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
            <p className="text-base font-medium text-gray-700 text-center">
              {activeTab === "pending"
                ? "There are no pending transactions"
                : "There are no completed transactions"}
            </p>
          </div>
        ) : (
          /* Transaction List */
          <div className="space-y-3 pb-6">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-fade-in"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      tx.type === "send"
                        ? "bg-blue-100 text-blue-700"
                        : tx.type === "resale"
                        ? "bg-orange-100 text-orange-700"
                        : tx.type === "exchange"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-900 font-medium">
                  Ticket #{tx.ticketId}
                </p>
                {tx.recipientEmail && (
                  <p className="text-xs text-gray-500 mt-1">
                    To: {tx.recipientEmail}
                  </p>
                )}
                {tx.message && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {tx.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
