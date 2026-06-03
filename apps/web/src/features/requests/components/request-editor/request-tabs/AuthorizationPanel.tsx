import { useState } from "react";

type AuthType = "NO_AUTH" | "BEARER_TOKEN" | "BASIC_AUTH" | "API_KEY";

export function AuthorizationPanel() {
  const [authType, setAuthType] = useState<AuthType>("NO_AUTH");

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-[#171717]">
          Authorization Type
        </label>

        <select
          value={authType}
          onChange={(event) => setAuthType(event.target.value as AuthType)}
          className="
            h-11 w-full rounded-[12px]
            border border-[#E5E5E5] bg-white px-4
            text-sm text-[#171717]
            outline-none
            focus:border-amber-500
          "
        >
          <option value="NO_AUTH">No Auth</option>
          <option value="BEARER_TOKEN">Bearer Token</option>
          <option value="BASIC_AUTH">Basic Auth</option>
          <option value="API_KEY">API Key</option>
        </select>
      </div>

      {authType === "BEARER_TOKEN" && (
        <Field label="Token" defaultValue="{{auth_token}}" />
      )}

      {authType === "BASIC_AUTH" && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Username" />
          <Field label="Password" type="password" />
        </div>
      )}

      {authType === "API_KEY" && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Key" defaultValue="x-api-key" />
          <Field label="Value" />
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#171717]">
        {label}
      </label>

      <input
        type={type}
        defaultValue={defaultValue}
        className="
          h-11 w-full rounded-[12px]
          border border-[#E5E5E5] bg-white px-4
          text-sm text-[#171717]
          outline-none
          focus:border-amber-500
        "
      />
    </div>
  );
}