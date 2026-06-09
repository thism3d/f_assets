import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { ChevronLeft, ChevronDown, Globe, Loader2 } from "lucide-react";

export default function TicketResale() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ticketId = Number(id);

  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("English");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [error, setError] = useState("");

  const { data: ticket } = trpc.tickets.getById.useQuery(
    { id: ticketId },
    { enabled: !!ticketId }
  );

  const resaleMutation = trpc.transactions.create.useMutation({
    onSuccess: () => {
      // Update ticket status
      navigate("/transactions");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleResale = () => {
    if (!recipientEmail) {
      setError("Please enter recipient email");
      return;
    }
    setError("");
    resaleMutation.mutate({
      ticketId,
      type: "resale",
      recipientEmail,
      message: message || undefined,
      language: language.toLowerCase().slice(0, 2),
    });
  };

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate(`/ticket/${ticketId}`)}
          className="p-1 -ml-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Resale/Exchange</h1>
      </div>

      <div className="px-4 pb-6">
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">
          You can resell or exchange your ticket to someone else directly within
          the app by following the steps below.
        </p>

        {/* Selected Ticket */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">
                {ticket.eventName}
              </p>
              <p className="text-xs text-gray-500">
                {ticket.matchDate} {ticket.matchTime} {ticket.venue}
              </p>
            </div>
            <ChevronDown size={18} className="text-gray-400" />
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Steps to follow
          </h3>

          {/* Step 1 - Recipient Email */}
          <div className="mb-4">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                1
              </span>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">
                  Resale recipient<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="Enter recipient email"
                  className="w-full mt-2 p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2 - Message */}
          <div className="mb-4">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                2
              </span>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={300}
                  placeholder="Add a message (optional)"
                  className="w-full mt-1 p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
                />
                <div className="text-right text-xs text-gray-400 mt-1">
                  {message.length}/300
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 - Language */}
          <div className="mb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <Globe size={18} className="text-green-500" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">
                  Language
                </label>
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="w-full mt-1 flex items-center justify-between p-3 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-colors"
                >
                  <p className="text-sm text-gray-900">{language}</p>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 flex-shrink-0 transition-transform ${
                      showLangDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showLangDropdown && (
                  <div className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {["English", "Spanish", "French", "German", "Portuguese"].map(
                      (lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setLanguage(lang);
                            setShowLangDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors"
                        >
                          {lang}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 mt-3">{error}</p>
        )}

        {/* Resale Button */}
        <button
          onClick={handleResale}
          disabled={resaleMutation.isPending}
          className="w-full mt-4 bg-blue-500 text-white py-3.5 rounded-xl font-medium text-base hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {resaleMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            "Submit for Resale/Exchange"
          )}
        </button>
      </div>
    </div>
  );
}
