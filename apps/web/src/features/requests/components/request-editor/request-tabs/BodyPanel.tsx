import { Braces, FileText, TableProperties, WandSparkles } from "lucide-react";

import {
  Button,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@courier/ui-kit";

import type {
  RawBodyLanguage,
  RequestBodyType,
} from "@/features/requests/types/request.type";

type BodyMode = "JSON" | "FORM_DATA" | "RAW";

type BodyPanelProps = {
  bodyType: RequestBodyType;
  rawBodyLanguage: RawBodyLanguage;
  rawBody: string | null;

  onBodyChange: (data: {
    bodyType?: RequestBodyType;
    rawBodyLanguage?: RawBodyLanguage;
    rawBody?: string | null;
  }) => void;
};

const BODY_MODES: {
  value: BodyMode;
  label: string;
  icon: React.ElementType;
}[] = [
  {
    value: "JSON",
    label: "JSON",
    icon: Braces,
  },
  {
    value: "FORM_DATA",
    label: "Form Data",
    icon: TableProperties,
  },
  {
    value: "RAW",
    label: "Raw",
    icon: FileText,
  },
];

const RAW_LANGUAGES = [
  "TEXT",
  "JSON",
  "XML",
  "HTML",
  "JAVASCRIPT",
] as const satisfies readonly RawBodyLanguage[];

function getBodyMode(
  bodyType: RequestBodyType,
  rawBodyLanguage: RawBodyLanguage,
): BodyMode {
  if (bodyType === "FORM_DATA" || bodyType === "X_WWW_FORM_URLENCODED") {
    return "FORM_DATA";
  }

  if (bodyType === "RAW" && rawBodyLanguage !== "JSON") {
    return "RAW";
  }

  return "JSON";
}

function safeFormatJson(value: string) {
  if (!value.trim()) return value;

  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export function BodyPanel({
  bodyType,
  rawBodyLanguage,
  rawBody,
  onBodyChange,
}: BodyPanelProps) {
  const bodyMode = getBodyMode(bodyType, rawBodyLanguage);
  const bodyValue = rawBody ?? "";

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
      rawBodyLanguage: rawBodyLanguage === "JSON" ? "TEXT" : rawBodyLanguage,
    });
  };

  const formatJson = () => {
    onBodyChange({
      bodyType: "RAW",
      rawBodyLanguage: "JSON",
      rawBody: safeFormatJson(bodyValue),
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <RadioGroup
        value={bodyMode}
        onValueChange={(value) => setBodyMode(value as BodyMode)}
        className="mb-4 flex shrink-0 items-center gap-2"
      >
        {BODY_MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = bodyMode === mode.value;

          return (
            <label
              key={mode.value}
              className={`
                flex h-9 cursor-pointer items-center gap-2 rounded-[10px]
                border px-3 text-sm font-medium transition-colors
                ${
                  isActive
                    ? "border-amber-300 bg-amber-50 text-amber-700"
                    : "border-[#E5E5E5] bg-white text-[#525252] hover:border-[#D4D4D4] hover:bg-[#FAFAFA] hover:text-[#171717]"
                }
              `}
            >
              <RadioGroupItem
                value={mode.value}
                className="
                  size-4 border-[#D4D4D4]
                  text-amber-500
                  focus-visible:ring-2
                  focus-visible:ring-amber-200
                  focus-visible:ring-offset-0
                  data-[state=checked]:border-amber-500
                "
              />

              <Icon size={15} />

              <span>{mode.label}</span>
            </label>
          );
        })}
      </RadioGroup>

      <div className="min-h-0 flex-1">
        {bodyMode === "FORM_DATA" ? (
          <div className="flex h-full min-h-[360px] flex-col rounded-[12px] border border-dashed border-[#E5E5E5] bg-[#FAFAFA]">
            <div className="flex shrink-0 items-center justify-between border-b border-dashed border-[#E5E5E5] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#171717]">
                  Form Data
                </p>
                <p className="mt-0.5 text-xs text-[#737373]">
                  Key-value fields will be rendered here.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="
                  h-8 rounded-[9px]
                  border-[#E5E5E5] bg-white
                  text-xs font-semibold text-[#525252]
                  shadow-none
                  hover:bg-[#F5F5F5] hover:text-[#171717]
                  focus-visible:ring-2
                  focus-visible:ring-amber-200
                  focus-visible:ring-offset-0
                "
              >
                Add field
              </Button>
            </div>

            <div className="flex flex-1 items-center justify-center p-6 text-sm text-[#737373]">
              Form data fields will be loaded here.
            </div>
          </div>
        ) : bodyMode === "JSON" ? (
          <div className="flex h-full min-h-[360px] flex-col overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-white">
            <div className="flex shrink-0 items-center justify-between border-b border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-[8px] bg-amber-50 text-amber-600">
                  <Braces size={15} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#171717]">
                    JSON Body
                  </p>
                  <p className="text-xs text-[#737373]">
                    Sent as application/json.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={formatJson}
                className="
                  h-8 rounded-[9px]
                  border-[#E5E5E5] bg-white
                  text-xs font-semibold text-[#525252]
                  shadow-none
                  hover:bg-amber-50 hover:text-amber-700
                  focus-visible:ring-2
                  focus-visible:ring-amber-200
                  focus-visible:ring-offset-0
                "
              >
                <WandSparkles size={14} />
                Format JSON
              </Button>
            </div>

            <Textarea
              spellCheck={false}
              value={bodyValue}
              onChange={(event) =>
                onBodyChange({
                  bodyType: "RAW",
                  rawBodyLanguage: "JSON",
                  rawBody: event.target.value,
                })
              }
              placeholder={`{ 
  "title": "Courier test request",
  "body": "Hello from Courier",
  "userId": 1
}`}
              className="
                h-full min-h-0 flex-1 resize-none rounded-none border-0 bg-white p-4
                font-mono text-sm leading-6 text-[#171717]
                shadow-none outline-none
                placeholder:text-[#A3A3A3]
                focus-visible:ring-1
                focus-visible:ring-inset
                focus-visible:ring-amber-400
                focus-visible:ring-offset-0
                overflow-auto dashboard-scrollbar
              "
            />
          </div>
        ) : (
          <div className="flex h-full min-h-[360px] flex-col overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-white">
            <div className="flex shrink-0 items-center justify-between border-b border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-[8px] bg-neutral-100 text-[#525252]">
                  <FileText size={15} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#171717]">
                    Raw Body
                  </p>
                  <p className="text-xs text-[#737373]">
                    Plain text or custom raw payload.
                  </p>
                </div>
              </div>

              <Select
                value={rawBodyLanguage === "JSON" ? "TEXT" : rawBodyLanguage}
                onValueChange={(value) =>
                  onBodyChange({
                    bodyType: "RAW",
                    rawBodyLanguage: value as RawBodyLanguage,
                  })
                }
              >
                <SelectTrigger
                  className="
                    !h-8 min-h-8 w-[135px] rounded-[9px]
                    border-[#E5E5E5] bg-white px-3
                    text-xs font-semibold text-[#525252]
                    shadow-none
                    hover:bg-[#F5F5F5]
                    focus:ring-2
                    focus:ring-amber-200
                    focus:ring-offset-0
                  "
                >
                  <SelectValue placeholder="Language" />
                </SelectTrigger>

                <SelectContent
                  align="end"
                  sideOffset={6}
                  className="
                    rounded-[10px] border-[#E5E5E5] bg-white p-1
                    shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                  "
                >
                  {RAW_LANGUAGES.filter((language) => language !== "JSON").map(
                    (language) => (
                      <SelectItem
                        key={language}
                        value={language}
                        className="
                        h-8 cursor-pointer rounded-[8px]
                        px-3 pr-8
                        text-xs font-semibold
                        outline-none
                        transition-colors

                        !text-[#525252]

                        hover:!bg-amber-50
                        hover:!text-[#171717]

                        focus:!bg-amber-50
                        focus:!text-[#171717]

                        data-[highlighted]:!bg-amber-50
                        data-[highlighted]:!text-[#171717]

                        data-[state=checked]:!bg-amber-100
                        data-[state=checked]:!text-[#171717]

                        [&>span]:!text-inherit
                        [&_span]:!text-inherit
                        [&_svg]:!text-[#171717]
                      "
                      >
                        {language}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <Textarea
              spellCheck={false}
              value={bodyValue}
              onChange={(event) =>
                onBodyChange({
                  bodyType: "RAW",
                  rawBodyLanguage:
                    rawBodyLanguage === "JSON" ? "TEXT" : rawBodyLanguage,
                  rawBody: event.target.value,
                })
              }
              placeholder="Write raw request body here..."
              className="
                h-full min-h-0 flex-1 resize-none rounded-none border-0 bg-white p-4
                font-mono text-sm leading-6 text-[#171717]
                shadow-none outline-none
                placeholder:text-[#A3A3A3]
                focus-visible:ring-1
                focus-visible:ring-inset
                focus-visible:ring-amber-400
                focus-visible:ring-offset-0
                overflow-auto dashboard-scrollbar
              "
            />
          </div>
        )}
      </div>
    </div>
  );
}
