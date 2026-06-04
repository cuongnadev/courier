import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";

import { CheckCircleIcon, ChevronDownIcon } from "@/components/common/icons";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

import { useCollections } from "@/features/collections/hooks";
import { useCreateRequest } from "@/features/requests/hooks";
import { RequestMethodSelect } from "@/features/requests/components/request-editor/request-tabs";
import {
  createRequestSchema,
  type CreateRequestFormValues,
} from "@/features/requests/schemas/create-request.schema";
import { useCurrentWorkspace } from "@/features/workspaces/hooks/use-current-workspace";

type CreateRequestModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId?: string | null;
};

export function CreateRequestModal({
  open,
  onOpenChange,
  workspaceId,
}: CreateRequestModalProps) {
  const navigate = useNavigate();
  const { currentWorkspaceId } = useCurrentWorkspace();

  const selectedWorkspaceId = workspaceId ?? currentWorkspaceId;
  const { data: collections = [] } = useCollections(selectedWorkspaceId);
  const createRequestMutation = useCreateRequest();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateRequestFormValues>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      name: "",
      method: "GET",
      uri: "",
      description: "",
      collectionId: "",
    },
  });

  const selectedMethod = useWatch({
    control,
    name: "method",
  });
  const selectedCollectionId = useWatch({
    control,
    name: "collectionId",
  });
  const selectedCollection =
    collections.find((collection) => collection.id === selectedCollectionId) ??
    null;

  useEffect(() => {
    if (!open || selectedCollectionId || collections.length === 0) return;

    setValue("collectionId", collections[0].id, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [collections, open, selectedCollectionId, setValue]);

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!selectedWorkspaceId) return;

    const request = await createRequestMutation.mutateAsync({
      workspaceId: selectedWorkspaceId,
      collectionId: values.collectionId,
      data: {
        name: values.name,
        method: values.method,
        uri: values.uri,
        description: values.description?.trim() || null,
      },
    });

    handleClose();

    void navigate({
      to: "/workspaces/$workspaceId/collections/$collectionId/requests/$requestId",
      params: {
        workspaceId: selectedWorkspaceId,
        collectionId: values.collectionId,
        requestId: request.id,
      },
    });
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
          !w-[calc(100vw-32px)] !max-w-[760px]
          gap-0 rounded-[16px]
          border border-[#E5E5E5]
          bg-white p-0 shadow-lg

          [&_[data-slot=dialog-close]]:right-6
          [&_[data-slot=dialog-close]]:top-6
          [&_[data-slot=dialog-close]]:text-[#737373]
          [&_[data-slot=dialog-close]]:hover:bg-neutral-100
          [&_[data-slot=dialog-close]]:hover:text-[#171717]
        "
      >
        <DialogHeader className="border-b border-[#E5E5E5] p-6">
          <DialogTitle className="text-xl font-semibold text-[#171717]">
            Create Request
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <FieldGroup className="gap-5 p-6">
            <Field className="gap-2">
              <FieldLabel htmlFor="request-name" className="text-[#404040]">
                Request Name *
              </FieldLabel>

              <Input
                id="request-name"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="Get User Profile"
                aria-invalid={!!errors.name}
                {...register("name")}
                className="
                  h-11.5 rounded-[12px]
                  border border-[#D6D3CF]
                  bg-transparent px-4 py-2.5
                  text-[#171717]
                  placeholder:text-[#1C191780]
                  focus-visible:border-[#FE9A00]
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
              <FieldLabel className="text-[#404040]">Request *</FieldLabel>

              <div className="flex gap-3">
                <RequestMethodSelect
                  value={selectedMethod ?? "GET"}
                  onValueChange={(method) =>
                    setValue("method", method, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />

                <Input
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="https://api.example.com/users/me"
                  aria-invalid={!!errors.uri}
                  {...register("uri")}
                  className="
                    h-11 flex-1 rounded-[12px]
                    border border-[#D6D3CF]
                    bg-transparent px-4
                    text-sm text-[#171717]
                    placeholder:text-[#1C191780]
                    focus-visible:border-[#FE9A00]
                    focus-visible:ring-2
                    focus-visible:ring-amber-500
                  "
                />
              </div>

              {errors.uri && (
                <FieldDescription className="text-red-500">
                  {errors.uri.message}
                </FieldDescription>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel
                htmlFor="request-description"
                className="text-[#404040]"
              >
                Description
              </FieldLabel>

              <textarea
                id="request-description"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="Optional description..."
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
            </Field>

            <Field className="gap-2">
              <FieldLabel className="text-[#404040]">
                Save to Collection
              </FieldLabel>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!selectedWorkspaceId || collections.length === 0}
                    className="
                      h-11.5 w-full justify-between rounded-[12px]
                      border border-[#D6D3CF]
                      bg-white px-4 shadow-none
                      text-sm font-medium text-[#171717]

                      hover:bg-[#F5F5F5]
                      hover:text-[#171717]

                      data-[state=open]:bg-[#F5F5F5]

                      focus:ring-0
                      focus:outline-none

                      focus-visible:ring-2
                      focus-visible:ring-amber-500
                    "
                  >
                    <span className="truncate">
                      {selectedCollection?.name ??
                        (collections.length === 0
                          ? "No collections available"
                          : "Select collection")}
                    </span>

                    <ChevronDownIcon iconColor="#171717" />
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
                  {collections.map((collection) => (
                    <DropdownMenuItem
                      key={collection.id}
                      onClick={() =>
                        setValue("collectionId", collection.id, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
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
                      <span className="truncate text-sm font-medium">
                        {collection.name}
                      </span>

                      {collection.id === selectedCollectionId && (
                        <DropdownMenuShortcut>
                          <CheckCircleIcon />
                        </DropdownMenuShortcut>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {errors.collectionId && (
                <FieldDescription className="text-red-500">
                  {errors.collectionId.message}
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
              disabled={
                !selectedWorkspaceId ||
                collections.length === 0 ||
                createRequestMutation.isPending
              }
              className="
                h-10 rounded-[12px]
                bg-[#FE9A00] text-[#171717]
                hover:bg-amber-400
              "
            >
              {createRequestMutation.isPending
                ? "Creating..."
                : "Create Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
