import { ArrowUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex items-center gap-2">
        <Button variant="outline">Courier</Button>
        <Button variant="outline" size="icon" aria-label="Submit">
            <ArrowUpIcon />
        </Button>
      </div>
    </div>
  );
}