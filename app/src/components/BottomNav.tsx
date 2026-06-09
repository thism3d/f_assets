import { Link, useLocation } from "react-router";
import { Ticket, ArrowLeftRight, Menu } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    {
      path: "/tickets",
      label: "My tickets",
      icon: Ticket,
    },
    {
      path: "/transactions",
      label: "Transactions",
      icon: ArrowLeftRight,
    },
    {
      path: "/more",
      label: "More",
      icon: Menu,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = path.startsWith(tab.path);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center w-20 h-full transition-colors ${
                isActive
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div
                className={`p-1.5 rounded-full mb-0.5 ${
                  isActive ? "bg-gray-200" : ""
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
              </div>
              <span className={`text-[10px] ${isActive ? "font-semibold" : ""}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
