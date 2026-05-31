import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type {
  CollectionColor,
  CollectionResponse,
} from "@/features/collections/types/collection.type";

const COLLECTION_COLORS: CollectionColor[] = [
  "#F59E0B",
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#EF4444",
  "#EC4899",
];

type EditCollectionFormValues = {
  name: string;
  description: string | null;
  color: CollectionColor;
};

type EditCollectionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: CollectionResponse | null;
  isPending?: boolean;
  onSubmit: (data: EditCollectionFormValues) => void | Promise<void>;
};

type EditCollectionFormProps = {
  collection: CollectionResponse;
  isPending?: boolean;
  onCancel: () => void;
  onSubmit: (data: EditCollectionFormValues) => void | Promise<void>;
};

function EditCollectionForm({
  collection,
  isPending,
  onCancel,
  onSubmit,
}: EditCollectionFormProps) {
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(
    collection.description ?? "",
  );
  const [color, setColor] = useState<CollectionColor>(collection.color);

  const handleSubmit = async () => {
    await onSubmit({
      name: name.trim(),
      description: description.trim() || null,
      color,
    });
  };

  return (
    <>
      <FieldGroup className="gap-5 bg-white p-6 text-[#171717]">
        <Field className="gap-2">
          <FieldLabel className="text-sm font-medium text-[#404040]">
            Name
          </FieldLabel>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Collection name"
            className="
              h-11 rounded-[12px]
              border border-[#D6D3CF]
              bg-white px-4
              text-[#171717]
              placeholder:text-[#A3A3A3]
              focus-visible:border-[#171717]
              focus-visible:ring-0
            "
          />
        </Field>

        <Field className="gap-2">
          <FieldLabel className="text-sm font-medium text-[#404040]">
            Description
          </FieldLabel>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Collection description"
            className="
              h-11 rounded-[12px]
              border border-[#D6D3CF]
              bg-white px-4
              text-[#171717]
              placeholder:text-[#A3A3A3]
              focus-visible:border-[#171717]
              focus-visible:ring-0
            "
          />
        </Field>

        <Field className="gap-3">
          <FieldLabel className="text-sm font-medium text-[#404040]">
            Color
          </FieldLabel>

          <div className="flex flex-wrap gap-3">
            {COLLECTION_COLORS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setColor(item)}
                className={`
                  h-8 w-8 rounded-full border-2 transition
                  ring-offset-2 ring-offset-white
                  focus:outline-none focus:ring-2 focus:ring-[#171717]
                  ${color === item
                    ? "border-[#171717]"
                    : "border-transparent"
                  }
                `}
                style={{ backgroundColor: item }}
              />
            ))}
          </div>
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-3 border-t border-[#E5E5E5] bg-white px-6 py-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
          className="
            h-10 rounded-[12px]
            border border-[#D6D3CF]
            bg-white px-4
            text-sm font-medium text-[#171717]
            hover:bg-[#F5F5F5]
            hover:text-[#171717]
          "
        >
          Cancel
        </Button>

        <Button
          type="button"
          disabled={!name.trim() || isPending}
          onClick={handleSubmit}
          className="
            h-10 rounded-[12px]
            bg-[#171717] px-4
            text-sm font-medium text-white
            hover:bg-[#262626]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </>
  );
}

export function EditCollectionModal({
  open,
  onOpenChange,
  collection,
  isPending,
  onSubmit,
}: EditCollectionModalProps) {
  const handleClose = () => {
    if (isPending) return;
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
          return;
        }

        onOpenChange(true);
      }}
    >
      <DialogContent
        className="
          !w-[calc(100vw-32px)] !max-w-[520px]
          gap-0 overflow-hidden rounded-[16px]
          border border-[#E5E5E5]
          bg-white p-0 text-[#171717]
          shadow-[0_20px_60px_rgba(0,0,0,0.16)]

          [&_[data-slot=dialog-close]]:text-[#737373]
          [&_[data-slot=dialog-close]]:opacity-100
          [&_[data-slot=dialog-close]]:hover:bg-neutral-100
          [&_[data-slot=dialog-close]]:hover:text-[#171717]
        "
      >
        <DialogHeader className="border-b border-[#E5E5E5] bg-white px-6 py-5">
          <DialogTitle className="text-xl font-semibold text-[#171717]">
            Edit Collection
          </DialogTitle>
        </DialogHeader>

        {collection && (
          <EditCollectionForm
            key={collection.id}
            collection={collection}
            isPending={isPending}
            onCancel={handleClose}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}