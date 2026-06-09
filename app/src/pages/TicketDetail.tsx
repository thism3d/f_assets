import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Loader2, ChevronLeft, Accessibility, MapPin, Calendar } from "lucide-react";

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ticketId = Number(id);

  const { data: ticket, isLoading } = trpc.tickets.getById.useQuery(
    { id: ticketId },
    { enabled: !!ticketId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Ticket not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate("/tickets")}
          className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <span className="text-sm text-gray-500">Ticket {ticket.id} of 5</span>
      </div>

      {/* Dots indicator */}
      <div className="flex items-center justify-center gap-1.5 py-2 bg-white">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === 1 ? "bg-gray-800" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      <div className="px-4 pb-6">
        {/* QR Code Section */}
        <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
          <div className="flex justify-center mb-2">
            {ticket.qrCode ? (
              <img
                src={ticket.qrCode}
                alt="Ticket QR Code"
                className="w-48 h-48 object-contain"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-40 h-40">
                  <rect width="200" height="200" fill="white" />
                  {/* Simplified QR pattern */}
                  <rect x="10" y="10" width="50" height="50" fill="black" rx="4" />
                  <rect x="15" y="15" width="40" height="40" fill="white" rx="2" />
                  <rect x="20" y="20" width="30" height="30" fill="black" rx="2" />
                  
                  <rect x="140" y="10" width="50" height="50" fill="black" rx="4" />
                  <rect x="145" y="15" width="40" height="40" fill="white" rx="2" />
                  <rect x="150" y="20" width="30" height="30" fill="black" rx="2" />
                  
                  <rect x="10" y="140" width="50" height="50" fill="black" rx="4" />
                  <rect x="15" y="145" width="40" height="40" fill="white" rx="2" />
                  <rect x="20" y="150" width="30" height="30" fill="black" rx="2" />
                  
                  {/* Data modules */}
                  {Array.from({ length: 20 }).map((_, i) =>
                    Array.from({ length: 20 }).map((_, j) => {
                      if (
                        (i < 7 && j < 7) ||
                        (i > 12 && j < 7) ||
                        (i < 7 && j > 12)
                      )
                        return null;
                      const seed = (i * 31 + j * 17) % 3;
                      if (seed === 0) {
                        return (
                          <rect
                            key={`${i}-${j}`}
                            x={10 + i * 7}
                            y={10 + j * 7}
                            width="6"
                            height="6"
                            fill="black"
                            rx="1"
                          />
                        );
                      }
                      return null;
                    })
                  )}
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Ticket Details Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {/* FIFA World Cup Logo */}
          <div className="flex items-center justify-center mb-4">
            {ticket.isDisabledAccess ? (
              <div className="flex items-center gap-2">
                <Accessibility size={20} className="text-gray-500" />
              </div>
            ) : null}
          </div>

          <div className="text-center mb-4">
            <p className="text-xs font-bold tracking-widest text-gray-900">FIFA</p>
            <p className="text-sm font-bold tracking-wider text-gray-900">WORLD CUP</p>
            <p className="text-[10px] text-gray-500">2026</p>
          </div>

          {/* Match Title */}
          <h2 className="text-lg font-bold text-center text-gray-900 mb-4">
            {ticket.eventName}
          </h2>

          {/* Date & Venue */}
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Calendar size={13} />
              <span>
                {ticket.matchDate}, {ticket.matchTime}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-5">
            <MapPin size={13} />
            <span>{ticket.venue}</span>
          </div>

          {/* Seat Info Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {ticket.entrance && (
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Entrance</p>
                <p className="text-sm font-semibold text-gray-900">{ticket.entrance}</p>
              </div>
            )}
            {ticket.hospitalityArea && (
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Hospitality Area</p>
                <p className="text-sm font-semibold text-gray-900">{ticket.hospitalityArea}</p>
              </div>
            )}
            {ticket.gate && (
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Gate</p>
                <p className="text-sm font-semibold text-gray-900">{ticket.gate}</p>
              </div>
            )}
            {ticket.suite && (
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Suite</p>
                <p className="text-sm font-semibold text-gray-900">{ticket.suite}</p>
              </div>
            )}
            {ticket.row && (
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Row</p>
                <p className="text-sm font-semibold text-gray-900">{ticket.row}</p>
              </div>
            )}
            {ticket.seat && (
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Seat</p>
                <p className="text-sm font-semibold text-gray-900">{ticket.seat}</p>
              </div>
            )}
          </div>

          {/* Dotted separator */}
          <div className="border-t border-dashed border-gray-300 my-4" />

          {/* Category Info */}
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Ticket Category</p>
              <p className="font-medium text-gray-900">{ticket.ticketCategory || "Standard"}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase">Price Category</p>
              <p className="font-medium text-gray-900">{ticket.priceCategory || "Category 1"}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigate(`/ticket/${ticket.id}/send`)}
            className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium text-sm hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
          <button
            onClick={() => navigate(`/ticket/${ticket.id}/resale`)}
            className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium text-sm hover:bg-blue-600 transition-colors"
          >
            Resale/Exchange
          </button>
        </div>
      </div>
    </div>
  );
}
