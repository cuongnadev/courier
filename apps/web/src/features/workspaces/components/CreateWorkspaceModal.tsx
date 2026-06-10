import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Button,
  Input,
} from "@courier/ui-kit";

import { useCreateWorkspace } from "@/features/workspaces/hooks/use-create-workspace";
import {
  createWorkspaceSchema,
  type CreateWorkspaceFormValues,
} from "@/features/workspaces/schemas/create-workspace.schema";

import { ROUTE_TO } from "@/constants/route-paths";

type CreateWorkspaceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateWorkspaceModal({
  open,
  onOpenChange,
}: CreateWorkspaceModalProps) {
  const navigate = useNavigate();
  const createWorkspaceMutation = useCreateWorkspace();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = handleSubmit(async (values) => {
    const workspace = await createWorkspaceMutation.mutateAsync(values);

    handleClose();

    void navigate({
      to: ROUTE_TO.WORKSPACE_DASHBOARD,
      params: {
        workspaceId: workspace.id,
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
            Create Workspace
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <FieldGroup className="gap-5 p-6">
            <Field className="gap-2">
              <FieldLabel htmlFor="workspace-name" className="text-[#404040]">
                Workspace Name *
              </FieldLabel>

              <Input
                id="workspace-name"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="Engineering Team"
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
              <FieldLabel
                htmlFor="workspace-description"
                className="text-[#404040]"
              >
                Description
              </FieldLabel>

              <textarea
                id="workspace-description"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="Optional description for this workspace..."
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
              disabled={createWorkspaceMutation.isPending}
              className="
                h-10 rounded-[12px]
                bg-[#FE9A00] text-[#171717]
                hover:bg-amber-400
              "
            >
              {createWorkspaceMutation.isPending
                ? "Creating..."
                : "Create Workspace"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
