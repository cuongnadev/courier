import { Copy } from "lucide-react";
import { useState } from "react";

import { JsonCodeBlock } from "./JsonCodeBlock";

const BODY_VIEW_TABS = ["Pretty", "Raw", "Preview"] as const;

type BodyViewTab = (typeof BODY_VIEW_TABS)[number];

const responseJson = `{
  "success": true,
  "data": {
    "id": "usr_123456789",
    "email": "user@example.com",
    "name": "Alex Johnson",
    "role": "admin",
    "verified": true,
    "createdAt": "2026-01-15T10:30:00Z",
    "settings": {
      "notifications": true,
      "theme": "dark",
      "language": "en"
    }
  },
  "meta": {
    "timestamp": "2026-03-19T14:30:15Z",
    "version": "1.0.0"
  }
}`;

export function ResponseTabs() {
  const [activeTab, setActiveTab] = useState<BodyViewTab>("Pretty");

  return (
    <div className="flex min-h-0 flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-2">
          {BODY_VIEW_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`
                rounded-md px-3 py-1.5 text-xs font-medium
                ${
                  activeTab === tab
                    ? "border border-[#E5E5E5] bg-white text-[#171717]"
                    : "text-[#525252] hover:bg-neutral-50"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="
            rounded-md p-1.5 text-[#737373]
            hover:bg-neutral-100 hover:text-[#171717]
          "
        >
          <Copy size={16} />
        </button>
      </div>

      <JsonCodeBlock value={responseJson} />
    </div>
  );
}