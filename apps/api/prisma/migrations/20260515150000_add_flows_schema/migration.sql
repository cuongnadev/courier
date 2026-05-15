-- CreateEnum
CREATE TYPE "FlowStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FlowNodeType" AS ENUM ('API_REQUEST', 'CONDITION', 'LOOP', 'TRANSFORM', 'DELAY', 'SCRIPT');

-- CreateEnum
CREATE TYPE "FlowRunStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "FlowNodeRunStatus" AS ENUM ('PENDING', 'RUNNING', 'SKIPPED', 'SUCCESS', 'FAILED', 'CANCELED');

-- CreateTable
CREATE TABLE "flows" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "FlowStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_nodes" (
    "id" UUID NOT NULL,
    "flow_id" UUID NOT NULL,
    "type" "FlowNodeType" NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "position_x" INTEGER NOT NULL DEFAULT 0,
    "position_y" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flow_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_edges" (
    "id" UUID NOT NULL,
    "flow_id" UUID NOT NULL,
    "source_node_id" UUID NOT NULL,
    "target_node_id" UUID NOT NULL,
    "label" TEXT,
    "source_handle" TEXT,
    "target_handle" TEXT,
    "condition_expression" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flow_edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_node_api_requests" (
    "id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "request_id" UUID,
    "method" "HttpMethod" NOT NULL DEFAULT 'GET',
    "uri" TEXT NOT NULL,
    "timeout_ms" INTEGER NOT NULL DEFAULT 30000,
    "continue_on_error" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "flow_node_api_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_node_conditions" (
    "id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "expression" TEXT NOT NULL,

    CONSTRAINT "flow_node_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_node_loops" (
    "id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "items_expression" TEXT NOT NULL,
    "item_alias" TEXT NOT NULL DEFAULT 'item',
    "max_iterations" INTEGER,

    CONSTRAINT "flow_node_loops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_node_transforms" (
    "id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "expression" TEXT NOT NULL,

    CONSTRAINT "flow_node_transforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_node_delays" (
    "id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "duration_ms" INTEGER NOT NULL,

    CONSTRAINT "flow_node_delays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_node_scripts" (
    "id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'javascript',
    "source" TEXT NOT NULL,

    CONSTRAINT "flow_node_scripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_variables" (
    "id" UUID NOT NULL,
    "flow_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "type" "VariableType" NOT NULL DEFAULT 'DEFAULT',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "flow_variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_runs" (
    "id" UUID NOT NULL,
    "flow_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "user_id" UUID,
    "environment_id" UUID,
    "status" "FlowRunStatus" NOT NULL DEFAULT 'PENDING',
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "duration_ms" INTEGER,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flow_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_node_runs" (
    "id" UUID NOT NULL,
    "flow_run_id" UUID NOT NULL,
    "node_id" UUID,
    "request_run_id" UUID,
    "status" "FlowNodeRunStatus" NOT NULL DEFAULT 'PENDING',
    "input" TEXT,
    "output" TEXT,
    "error_message" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "duration_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flow_node_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "flows_workspace_id_idx" ON "flows"("workspace_id");

-- CreateIndex
CREATE INDEX "flows_workspace_id_sort_order_idx" ON "flows"("workspace_id", "sort_order");

-- CreateIndex
CREATE INDEX "flows_workspace_id_status_idx" ON "flows"("workspace_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "flows_workspace_id_name_key" ON "flows"("workspace_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "flow_nodes_id_flow_id_key" ON "flow_nodes"("id", "flow_id");

-- CreateIndex
CREATE INDEX "flow_nodes_flow_id_idx" ON "flow_nodes"("flow_id");

-- CreateIndex
CREATE INDEX "flow_nodes_flow_id_sort_order_idx" ON "flow_nodes"("flow_id", "sort_order");

-- CreateIndex
CREATE INDEX "flow_nodes_flow_id_type_idx" ON "flow_nodes"("flow_id", "type");

-- CreateIndex
CREATE INDEX "flow_edges_flow_id_idx" ON "flow_edges"("flow_id");

-- CreateIndex
CREATE INDEX "flow_edges_source_node_id_idx" ON "flow_edges"("source_node_id");

-- CreateIndex
CREATE INDEX "flow_edges_target_node_id_idx" ON "flow_edges"("target_node_id");

-- CreateIndex
CREATE INDEX "flow_edges_flow_id_sort_order_idx" ON "flow_edges"("flow_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "flow_edges_flow_id_source_node_id_target_node_id_source_handle_target_handle_key" ON "flow_edges"("flow_id", "source_node_id", "target_node_id", "source_handle", "target_handle");

-- CreateIndex
CREATE UNIQUE INDEX "flow_node_api_requests_node_id_key" ON "flow_node_api_requests"("node_id");

-- CreateIndex
CREATE INDEX "flow_node_api_requests_request_id_idx" ON "flow_node_api_requests"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "flow_node_conditions_node_id_key" ON "flow_node_conditions"("node_id");

-- CreateIndex
CREATE UNIQUE INDEX "flow_node_loops_node_id_key" ON "flow_node_loops"("node_id");

-- CreateIndex
CREATE UNIQUE INDEX "flow_node_transforms_node_id_key" ON "flow_node_transforms"("node_id");

-- CreateIndex
CREATE UNIQUE INDEX "flow_node_delays_node_id_key" ON "flow_node_delays"("node_id");

-- CreateIndex
CREATE UNIQUE INDEX "flow_node_scripts_node_id_key" ON "flow_node_scripts"("node_id");

-- CreateIndex
CREATE INDEX "flow_variables_flow_id_idx" ON "flow_variables"("flow_id");

-- CreateIndex
CREATE INDEX "flow_variables_flow_id_sort_order_idx" ON "flow_variables"("flow_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "flow_variables_flow_id_key_key" ON "flow_variables"("flow_id", "key");

-- CreateIndex
CREATE INDEX "flow_runs_flow_id_idx" ON "flow_runs"("flow_id");

-- CreateIndex
CREATE INDEX "flow_runs_workspace_id_idx" ON "flow_runs"("workspace_id");

-- CreateIndex
CREATE INDEX "flow_runs_user_id_idx" ON "flow_runs"("user_id");

-- CreateIndex
CREATE INDEX "flow_runs_environment_id_idx" ON "flow_runs"("environment_id");

-- CreateIndex
CREATE INDEX "flow_runs_created_at_idx" ON "flow_runs"("created_at");

-- CreateIndex
CREATE INDEX "flow_node_runs_flow_run_id_idx" ON "flow_node_runs"("flow_run_id");

-- CreateIndex
CREATE INDEX "flow_node_runs_node_id_idx" ON "flow_node_runs"("node_id");

-- CreateIndex
CREATE INDEX "flow_node_runs_request_run_id_idx" ON "flow_node_runs"("request_run_id");

-- CreateIndex
CREATE INDEX "flow_node_runs_created_at_idx" ON "flow_node_runs"("created_at");

-- AddForeignKey
ALTER TABLE "flows" ADD CONSTRAINT "flows_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_nodes" ADD CONSTRAINT "flow_nodes_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_edges" ADD CONSTRAINT "flow_edges_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_edges" ADD CONSTRAINT "flow_edges_source_node_id_flow_id_fkey" FOREIGN KEY ("source_node_id", "flow_id") REFERENCES "flow_nodes"("id", "flow_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_edges" ADD CONSTRAINT "flow_edges_target_node_id_flow_id_fkey" FOREIGN KEY ("target_node_id", "flow_id") REFERENCES "flow_nodes"("id", "flow_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_node_api_requests" ADD CONSTRAINT "flow_node_api_requests_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "flow_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_node_api_requests" ADD CONSTRAINT "flow_node_api_requests_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_node_conditions" ADD CONSTRAINT "flow_node_conditions_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "flow_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_node_loops" ADD CONSTRAINT "flow_node_loops_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "flow_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_node_transforms" ADD CONSTRAINT "flow_node_transforms_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "flow_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_node_delays" ADD CONSTRAINT "flow_node_delays_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "flow_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_node_scripts" ADD CONSTRAINT "flow_node_scripts_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "flow_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_variables" ADD CONSTRAINT "flow_variables_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_runs" ADD CONSTRAINT "flow_runs_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_runs" ADD CONSTRAINT "flow_runs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_runs" ADD CONSTRAINT "flow_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_runs" ADD CONSTRAINT "flow_runs_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_node_runs" ADD CONSTRAINT "flow_node_runs_flow_run_id_fkey" FOREIGN KEY ("flow_run_id") REFERENCES "flow_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_node_runs" ADD CONSTRAINT "flow_node_runs_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "flow_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_node_runs" ADD CONSTRAINT "flow_node_runs_request_run_id_fkey" FOREIGN KEY ("request_run_id") REFERENCES "request_runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
