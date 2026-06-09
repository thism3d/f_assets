import { useNavigate } from "react-router";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import AppLayout from "@/components/AppLayout";
import {
  UserCircle,
  Globe,
  Ticket,
  Trash2,
  Link2,
  HelpCircle,
  LogOut,
  ChevronRight,
  Loader2,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useLocalAuth();

  if (isLoading) {
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

  const menuSections = [
    {
      items: [
        { icon: UserCircle, label: "My profile", clickable: false },
        { icon: Globe, label: "Language", clickable: false },
      ],
    },
    {
      items: [
        { icon: Ticket, label: "Ticket(s) submitted for resale/exchange", clickable: false },
        { icon: Trash2, label: "Deleted", clickable: false },
      ],
    },
    {
      items: [
        { icon: Link2, label: "More information", clickable: false },
        { icon: HelpCircle, label: "Support details", clickable: false },
      ],
    },
  ];

  return (
    <AppLayout>
      <div className="pt-6">
        {/* Scrolling Email Header */}
        <div className="overflow-hidden mb-6 px-4">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-3xl font-bold text-gray-900">
              {user.email}
            </span>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="space-y-4 px-4 pb-6">
          {menuSections.map((section, sectionIdx) => (
            <div
              key={sectionIdx}
              className="bg-gray-100 rounded-2xl overflow-hidden"
            >
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={itemIdx}
                    className={`flex items-center gap-3 px-4 py-3.5 ${
                      itemIdx < section.items.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <Icon size={22} className="text-gray-700 flex-shrink-0" />
                    <span className="flex-1 text-sm text-gray-900">
                      {item.label}
                    </span>
                    <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          ))}

          {/* Log Out Section */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-gray-200 transition-colors"
            >
              <LogOut size={22} className="text-gray-700 flex-shrink-0" />
              <span className="flex-1 text-sm text-gray-900">Log Out</span>
              <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* CSS for marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </AppLayout>
  );
}
