import { useState } from "react";

import { KeyValueEditor, type KeyValueItem } from "./KeyValueEditor";

export function ParamsPanel() {
  const [params, setParams] = useState<KeyValueItem[]>([
    {
      id: "param-1",
      key: "page",
      value: "1",
      enabled: true,
    },
    {
      id: "param-2",
      key: "limit",
      value: "20",
      enabled: true,
    },
  ]);

  return (
    <KeyValueEditor
      title="Query Params"
      items={params}
      onChange={setParams}
      addLabel="Add Param"
      emptyText="No query params added."
    />
  );
}