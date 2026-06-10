import { Plus, X } from "lucide-react";

import { Button, Checkbox, Input } from "@courier/ui-kit";

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
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 shrink-0">
        <h3 className="text-sm font-semibold text-[#171717]">{title}</h3>
      </div>

      <div className="min-h-0 flex-1 overflow-auto pr-1 dashboard-scrollbar">
        {items.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-6 text-sm text-[#737373]">
            {emptyText}
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="
                  grid grid-cols-[24px_minmax(0,1fr)_minmax(0,1fr)_36px]
                  items-center gap-2
                "
              >
                <Checkbox
                  checked={item.enabled}
                  onCheckedChange={(checked) =>
                    updateItem(item.id, "enabled", checked === true)
                  }
                  className="border-[#D4D4D4]"
                />

                <Input
                  value={item.key}
                  onChange={(event) =>
                    updateItem(item.id, "key", event.target.value)
                  }
                  placeholder="Key"
                  className="
                    h-10 rounded-[10px] border-[#E5E5E5]
                    bg-white px-3 text-sm text-[#171717]
                    placeholder:text-[#A3A3A3]
                    shadow-none
                    focus-visible:border-amber-500
                    focus-visible:ring-0
                  "
                />

                <Input
                  value={item.value}
                  onChange={(event) =>
                    updateItem(item.id, "value", event.target.value)
                  }
                  placeholder="Value"
                  className="
                    h-10 rounded-[10px] border-[#E5E5E5]
                    bg-white px-3 text-sm text-[#171717]
                    placeholder:text-[#A3A3A3]
                    shadow-none
                    focus-visible:border-amber-500
                    focus-visible:ring-0
                  "
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="
                    h-9 w-9 rounded-[10px]
                    text-[#A3A3A3]
                    hover:bg-red-50 hover:text-red-600
                    focus-visible:ring-0
                    focus-visible:ring-offset-0
                  "
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 shrink-0">
        <Button
          type="button"
          variant="ghost"
          onClick={addItem}
          className="
            h-8 rounded-[8px] px-0
            text-sm font-medium text-orange-600
            hover:bg-transparent hover:text-orange-500
            focus-visible:ring-0
            focus-visible:ring-offset-0
          "
        >
          <Plus size={15} />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
