export function PreRequestScriptPanel() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#525252]">
        Write a script that runs before this request is sent.
      </p>

      <textarea
        spellCheck={false}
        defaultValue={`pm.environment.set("timestamp", Date.now());

const token = pm.environment.get("auth_token");
pm.request.headers.add({
  key: "Authorization",
  value: \`Bearer \${token}\`
});`}
        className="
          min-h-[360px] w-full resize-none rounded-[12px]
          border border-[#E5E5E5] bg-white p-4
          font-mono text-sm leading-6 text-[#171717]
          outline-none
          focus:border-amber-500
        "
      />
    </div>
  );
}