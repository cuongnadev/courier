import type {
  RawBodyLanguage,
  RequestBodyType,
  ApiRequestDetailResponse,
} from "@/features/requests/types/request.type";

type BodyMode = "JSON" | "FORM_DATA" | "RAW";

type BodyPanelProps = {
  request: ApiRequestDetailResponse;

  bodyType: RequestBodyType;
  rawBodyLanguage: RawBodyLanguage;
  rawBody: string | null;

  onBodyChange: (data: {
    bodyType?: RequestBodyType;
    rawBodyLanguage?: RawBodyLanguage;
    rawBody?: string | null;
  }) => void;
};

function getBodyMode(bodyType: RequestBodyType): BodyMode {
  if (bodyType === "FORM_DATA" || bodyType === "X_WWW_FORM_URLENCODED") {
    return "FORM_DATA";
  }

  if (bodyType === "RAW" || bodyType === "GRAPHQL") {
    return "RAW";
  }

  return "JSON";
}

export function BodyPanel({
  bodyType,
  rawBodyLanguage,
  rawBody,
  onBodyChange,
}: BodyPanelProps) {
  const bodyMode = getBodyMode(bodyType);

  const setBodyMode = (mode: BodyMode) => {
    if (mode === "JSON") {
      onBodyChange({
        bodyType: "RAW",
        rawBodyLanguage: "JSON",
      });
      return;
    }

    if (mode === "FORM_DATA") {
      onBodyChange({
        bodyType: "FORM_DATA",
      });
      return;
    }

    onBodyChange({
      bodyType: "RAW",
      rawBodyLanguage,
    });
  };

  return (
    <div className="flex h-full min-h-[420px] flex-col">
      <div className="mb-4 flex items-center gap-4 text-sm text-[#171717]">
        {(["JSON", "FORM_DATA", "RAW"] as BodyMode[]).map((mode) => (
          <label key={mode} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="request-body-mode"
              checked={bodyMode === mode}
              onChange={() => setBodyMode(mode)}
            />
            {mode === "FORM_DATA" ? "Form Data" : mode === "RAW" ? "Raw" : "JSON"}
          </label>
        ))}
      </div>

      {bodyMode === "FORM_DATA" ? (
        <div className="rounded-[12px] border border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-6 text-sm text-[#737373]">
          Form data fields will be loaded here.
        </div>
      ) : (
        <textarea
          spellCheck={false}
          value={rawBody ?? ""}
          onChange={(event) =>
            onBodyChange({
              rawBody: event.target.value,
            })
          }
          className="
            min-h-[360px] flex-1 resize-none rounded-[12px]
            border border-[#E5E5E5] bg-white p-4
            font-mono text-sm leading-6 text-[#171717]
            outline-none
            focus:border-amber-500
          "
        />
      )}
    </div>
  );
}