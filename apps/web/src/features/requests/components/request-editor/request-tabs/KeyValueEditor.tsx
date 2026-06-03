import { Plus, X } from "lucide-react";

export type KeyValueItem = {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
};

type KeyValueEditorProps = {
  title: string;
  items: KeyValueItem[];
  onChange: (items: KeyValueItem[]) => void;
  addLabel: string;
  emptyText: string;
};

export function KeyValueEditor({
  title,
  items,
  onChange,
  addLabel,
  emptyText,
}: KeyValueEditorProps) {
  const updateItem = (
    id: string,
    field: keyof Pick<KeyValueItem, "key" | "value" | "enabled">,
    value: string | boolean,
  ) => {
    onChange(
      items.map((item) =>
        item.id === id
          ? {
            ...item,
            [field]: value,
          }
          : item,
      ),
    );
  };

  const addItem = () => {
    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        key: "",
        value: "",
        enabled: true,
      },
    ]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[#171717]">{title}</h3>

      {items.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-6 text-sm text-[#737373]">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[32px_1fr_1fr_32px] items-center gap-2"
            >
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(event) =>
                  updateItem(item.id, "enabled", event.target.checked)
                }
              />

              <input
                value={item.key}
                onChange={(event) =>
                  updateItem(item.id, "key", event.target.value)
                }
                placeholder="Key"
                className="h-10 rounded-[10px] border border-[#E5E5E5] px-3 text-sm outline-none focus:border-amber-500"
              />

              <input
                value={item.value}
                onChange={(event) =>
                  updateItem(item.id, "value", event.target.value)
                }
                placeholder="Value"
                className="h-10 rounded-[10px] border border-[#E5E5E5] px-3 text-sm outline-none focus:border-amber-500"
              />

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[#A3A3A3] hover:bg-red-50 hover:text-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-500"
      >
        <Plus size={15} />
        {addLabel}
      </button>
    </div>
  );
}