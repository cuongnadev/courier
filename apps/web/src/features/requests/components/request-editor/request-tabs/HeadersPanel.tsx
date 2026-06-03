import type { RunRequestHeaderPayload } from "@/features/requests/types/request-run-payload.type";

import { KeyValueEditor, type KeyValueItem } from "./KeyValueEditor";

type HeadersPanelProps = {
  headers: RunRequestHeaderPayload[];
  onHeadersChange: (headers: RunRequestHeaderPayload[]) => void;
};

export function HeadersPanel({
  headers,
  onHeadersChange,
}: HeadersPanelProps) {
  const items: KeyValueItem[] = headers.map((header, index) => ({
    id: `${header.key}-${index}`,
    key: header.key,
    value: header.value,
    enabled: header.enabled,
  }));

  return (
    <KeyValueEditor
      title="Request Headers"
      items={items}
      onChange={(nextItems) =>
        onHeadersChange(
          nextItems.map((item) => ({
            key: item.key,
            value: item.value,
            enabled: item.enabled,
          })),
        )
      }
      addLabel="Add Header"
      emptyText="No headers added."
    />
  );
}