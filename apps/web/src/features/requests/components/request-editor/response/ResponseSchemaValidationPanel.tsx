import { AlertTriangle, XCircle } from "lucide-react";

export function ResponseSchemaValidationPanel() {
  return (
    <div className="space-y-5">
      <div className="rounded-[12px] border border-red-200 bg-red-50 p-5">
        <div className="flex items-center gap-3 text-red-700">
          <XCircle size={20} />

          <div>
            <h3 className="text-lg font-semibold">Schema Validation Failed</h3>
            <p className="mt-1 text-sm">2 errors found, 1 warning</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#171717]">
          <XCircle size={18} className="text-red-600" />
          Errors
        </h3>

        <ValidationCard
          tone="error"
          path="$.data.settings"
          badge="timezone"
          message="Required field 'timezone' is missing"
          expected="string"
          actual="undefined"
        />

        <ValidationCard
          tone="error"
          path="$.data.role"
          badge="role"
          message="Invalid enum value. Expected one of: admin, editor, viewer"
          expected="admin | editor | viewer"
          actual="superadmin"
        />
      </section>

      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#171717]">
          <AlertTriangle size={18} className="text-amber-500" />
          Warnings
        </h3>

        <ValidationCard
          tone="warning"
          path="$.data"
          badge="lastLogin"
          message="Optional field 'lastLogin' is missing. Consider adding for better tracking."
          expected="optional datetime"
          actual="missing"
        />
      </section>
    </div>
  );
}

type ValidationCardProps = {
  tone: "error" | "warning";
  path: string;
  badge: string;
  message: string;
  expected: string;
  actual: string;
};

function ValidationCard({
  tone,
  path,
  badge,
  message,
  expected,
  actual,
}: ValidationCardProps) {
  const isError = tone === "error";

  return (
    <div
      className={`
        rounded-[12px] border p-4
        ${isError ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}
      `}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-sm font-semibold text-[#171717]">
          {path}
        </span>

        <span
          className={`
            rounded px-2 py-1 text-xs font-semibold
            ${isError ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}
          `}
        >
          {badge}
        </span>
      </div>

      <p className={isError ? "text-sm text-red-700" : "text-sm text-amber-700"}>
        {message}
      </p>

      <div className="mt-3 flex gap-8 font-mono text-xs">
        <span className={isError ? "text-red-700" : "text-amber-700"}>
          Expected: {expected}
        </span>

        <span className={isError ? "text-red-700" : "text-amber-700"}>
          Actual: {actual}
        </span>
      </div>
    </div>
  );
}