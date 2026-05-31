import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircleIcon, ChevronDownIcon } from "@/components/common/icons";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { COLLECTION_COLORS } from "@/constants/collection";

import { mapWorkspaceHeader } from "@/features/workspaces/utils/map-workspace";

import {
  createCollectionSchema,
  type CreateCollectionFormValues,
} from "@/features/collections/schemas/create-collection.schema";

import { useCreateCollection } from "@/features/collections/hooks/use-create-collection";
import { useCurrentWorkspace } from "@/features/workspaces/hooks/use-current-workspace";

type CreateCollectionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId?: string;
};

export function CreateCollectionModal({
  open,
  onOpenChange,
  workspaceId,
}: CreateCollectionModalProps) {
  const {
    workspaces,
    currentWorkspace,
    currentWorkspaceId
  } = useCurrentWorkspace();

  const workspaceItems = workspaces.map(mapWorkspaceHeader);

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<
    string | undefined
  >(workspaceId ?? currentWorkspaceId);

  useEffect(() => {
    if (open) {
      setSelectedWorkspaceId(workspaceId ?? currentWorkspaceId);
    }
  }, [open, workspaceId, currentWorkspaceId]);

  const selectedWorkspace =
    workspaceItems.find((workspace) => workspace.id === selectedWorkspaceId) ??
    (currentWorkspace ? mapWorkspaceHeader(currentWorkspace) : null);

  const createCollectionMutation = useCreateCollection(selectedWorkspaceId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateCollectionFormValues>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      name: "",
      description: "",
      color: COLLECTION_COLORS[0],
    },
  });

  const selectedColor = watch("color");

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = handleSubmit(async (values) => {
    await createCollectionMutation.mutateAsync(values);
    handleClose();
  });

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
          gap-0 rounded-[16px]
          border border-[#E5E5E5]
          bg-white p-0 shadow-lg

          [&_[data-slot=dialog-close]]:text-[#525252]
          [&_[data-slot=dialog-close]]:hover:bg-neutral-100
          [&_[data-slot=dialog-close]]:hover:text-[#171717]
        "
      >
        <DialogHeader className="border-b border-[#E5E5E5] p-6">
          <DialogTitle className="text-xl font-semibold text-[#171717]">
            Create Collection
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <FieldGroup className="gap-5 p-6">
            <Field className="gap-2">
              <FieldLabel className="text-[#404040]">Workspace</FieldLabel>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="
                      h-11.5 w-full justify-between rounded-[12px]
                      border border-[#D6D3CF]
                      bg-white px-4 shadow-none
                      text-neutral-900

                      hover:bg-[#F5F5F5]
                      hover:text-neutral-900

                      data-[state=open]:bg-[#F5F5F5]

                      focus:ring-0
                      focus:outline-none

                      focus-visible:ring-2
                      focus-visible:ring-amber-500
                    "
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[linear-gradient(135deg,#1C1917_0%,#1E2939_100%)] text-xs font-semibold uppercase text-white">
                        {selectedWorkspace?.short ?? "?"}
                      </div>

                      <span className="truncate text-sm font-medium text-neutral-800">
                        {selectedWorkspace?.name ?? "Select workspace"}
                      </span>
                    </div>

                    <ChevronDownIcon iconColor="#A1A1A1" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="
                    w-[var(--radix-dropdown-menu-trigger-width)]
                    rounded-xl border border-[#E5E5E5]
                    bg-white p-2 text-neutral-900
                    shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                  "
                >
                  {workspaceItems.map((workspace) => (
                    <DropdownMenuItem
                      key={workspace.id}
                      onClick={() => setSelectedWorkspaceId(workspace.id)}
                      className="
                        flex cursor-pointer items-center justify-between
                        rounded-lg px-3 py-2 text-neutral-800 outline-none

                        hover:bg-[#F5F5F5]
                        hover:text-neutral-900

                        focus:bg-[#F5F5F5]
                        focus:text-neutral-900

                        data-[highlighted]:bg-[#F5F5F5]
                        data-[highlighted]:text-neutral-900
                      "
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-neutral-900 text-xs font-semibold text-white">
                          {workspace.short}
                        </div>

                        <span className="truncate text-sm font-medium">
                          {workspace.name}
                        </span>
                      </div>

                      {workspace.id === selectedWorkspace?.id && (
                        <DropdownMenuShortcut>
                          <CheckCircleIcon />
                        </DropdownMenuShortcut>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {!selectedWorkspaceId && (
                <FieldDescription className="text-red-500">
                  Workspace is required.
                </FieldDescription>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="name" className="text-[#404040]">
                Collection Name *
              </FieldLabel>

              <Input
                id="name"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="My API Collection"
                aria-invalid={!!errors.name}
                {...register("name")}
                className="
                  h-11.5 rounded-[12px]
                  border border-[#D6D3CF]
                  bg-transparent px-4 py-2.5
                  text-[#171717]
                  placeholder:text-[#1C191780]
                  focus-visible:ring-2
                  focus-visible:ring-amber-500
                "
              />

              {errors.name && (
                <FieldDescription className="text-red-500">
                  {errors.name.message}
                </FieldDescription>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="description" className="text-[#404040]">
                Description
              </FieldLabel>

              <textarea
                id="description"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="Optional description for this collection..."
                aria-invalid={!!errors.description}
                {...register("description")}
                className="
                  h-23.5 w-full resize-none rounded-[12px]
                  border border-[#D4D4D4]
                  bg-transparent px-4 py-3
                  text-sm text-[#171717]
                  outline-none
                  placeholder:text-[#1C191780]
                  focus:border-[#FE9A00]
                  focus-visible:ring-2
                  focus-visible:ring-amber-500
                "
              />

              {errors.description && (
                <FieldDescription className="text-red-500">
                  {errors.description.message}
                </FieldDescription>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel className="text-[#404040]">
                Collection Color
              </FieldLabel>

              <div className="flex items-center gap-3">
                {COLLECTION_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      setValue("color", color, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    className={`
                      h-10 w-10 rounded-[12px] border-2
                      transition-all duration-200
                      hover:scale-110 hover:shadow-md
                      active:scale-95

                      ${selectedColor === color
                        ? "border-[#171717] ring-2 ring-black/10"
                        : "border-transparent"
                      }
                    `}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>

              {errors.color && (
                <FieldDescription className="text-red-500">
                  {errors.color.message}
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>

          <div className="flex justify-end gap-3 border-t border-[#E5E5E5] px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-10 rounded-[12px]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!selectedWorkspaceId || createCollectionMutation.isPending}
              className="
                h-10 rounded-[12px]
                bg-[#FE9A00] text-[#171717]
                hover:bg-amber-400
              "
            >
              {createCollectionMutation.isPending
                ? "Creating..."
                : "Create Collection"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}