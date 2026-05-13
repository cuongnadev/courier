-- CreateEnum
CREATE TYPE "UserGender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS');

-- CreateEnum
CREATE TYPE "RequestBodyType" AS ENUM ('NONE', 'RAW', 'FORM_DATA', 'X_WWW_FORM_URLENCODED', 'GRAPHQL', 'BINARY');

-- CreateEnum
CREATE TYPE "BodyParamType" AS ENUM ('TEXT', 'FILE');

-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('NONE', 'INHERIT', 'BEARER_TOKEN', 'BASIC', 'API_KEY');

-- CreateEnum
CREATE TYPE "ApiKeyLocation" AS ENUM ('HEADER', 'QUERY');

-- CreateEnum
CREATE TYPE "RawBodyLanguage" AS ENUM ('TEXT', 'JSON', 'XML', 'HTML', 'JAVASCRIPT');

-- CreateEnum
CREATE TYPE "VariableType" AS ENUM ('DEFAULT', 'SECRET');

-- CreateEnum
CREATE TYPE "RequestRunStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "age" INTEGER,
    "gender" "UserGender" NOT NULL DEFAULT 'MALE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "owner_id" UUID NOT NULL,
    "active_environment_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_members" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "WorkspaceRole" NOT NULL DEFAULT 'EDITOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" UUID NOT NULL,
    "collection_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "method" "HttpMethod" NOT NULL DEFAULT 'GET',
    "uri" TEXT NOT NULL,
    "body_type" "RequestBodyType" NOT NULL DEFAULT 'NONE',
    "raw_body_language" "RawBodyLanguage" NOT NULL DEFAULT 'JSON',
    "raw_body" TEXT,
    "graphql_query" TEXT,
    "graphql_variables" TEXT,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_auth" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "type" "AuthType" NOT NULL DEFAULT 'NONE',
    "bearer_token" TEXT,
    "username" TEXT,
    "password" TEXT,
    "api_key_name" TEXT,
    "api_key_value" TEXT,
    "api_key_location" "ApiKeyLocation",

    CONSTRAINT "request_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_headers" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "request_headers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_query_params" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "request_query_params_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_path_params" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "request_path_params_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_body_params" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "type" "BodyParamType" NOT NULL DEFAULT 'TEXT',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "request_body_params_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_cookies" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT,
    "domain" TEXT,
    "path" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "request_cookies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environments" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "environments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environment_variables" (
    "id" UUID NOT NULL,
    "environment_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "initial_value" TEXT,
    "type" "VariableType" NOT NULL DEFAULT 'DEFAULT',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "environment_variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_variables" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "type" "VariableType" NOT NULL DEFAULT 'DEFAULT',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "workspace_variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_variables" (
    "id" UUID NOT NULL,
    "collection_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "type" "VariableType" NOT NULL DEFAULT 'DEFAULT',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "collection_variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_examples" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status_code" INTEGER,
    "response_body" TEXT,
    "response_time_ms" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "request_examples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_example_headers" (
    "id" UUID NOT NULL,
    "example_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "request_example_headers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_runs" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "request_id" UUID,
    "user_id" UUID,
    "environment_id" UUID,
    "method" "HttpMethod" NOT NULL,
    "uri" TEXT NOT NULL,
    "status" "RequestRunStatus" NOT NULL DEFAULT 'PENDING',
    "status_code" INTEGER,
    "duration_ms" INTEGER,
    "request_body" TEXT,
    "response_body" TEXT,
    "response_size" INTEGER,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_run_headers" (
    "id" UUID NOT NULL,
    "run_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "request_run_headers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_run_response_headers" (
    "id" UUID NOT NULL,
    "run_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "request_run_response_headers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "workspaces_active_environment_id_idx" ON "workspaces"("active_environment_id");

-- CreateIndex
CREATE INDEX "workspaces_owner_id_idx" ON "workspaces"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_owner_id_name_key" ON "workspaces"("owner_id", "name");

-- CreateIndex
CREATE INDEX "workspace_members_user_id_idx" ON "workspace_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_members_workspace_id_user_id_key" ON "workspace_members"("workspace_id", "user_id");

-- CreateIndex
CREATE INDEX "collections_workspace_id_idx" ON "collections"("workspace_id");

-- CreateIndex
CREATE INDEX "collections_workspace_id_sort_order_idx" ON "collections"("workspace_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "collections_workspace_id_name_key" ON "collections"("workspace_id", "name");

-- CreateIndex
CREATE INDEX "requests_collection_id_idx" ON "requests"("collection_id");

-- CreateIndex
CREATE INDEX "requests_collection_id_sort_order_idx" ON "requests"("collection_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "request_auth_request_id_key" ON "request_auth"("request_id");

-- CreateIndex
CREATE INDEX "request_headers_request_id_idx" ON "request_headers"("request_id");

-- CreateIndex
CREATE INDEX "request_headers_request_id_sort_order_idx" ON "request_headers"("request_id", "sort_order");

-- CreateIndex
CREATE INDEX "request_query_params_request_id_idx" ON "request_query_params"("request_id");

-- CreateIndex
CREATE INDEX "request_query_params_request_id_sort_order_idx" ON "request_query_params"("request_id", "sort_order");

-- CreateIndex
CREATE INDEX "request_path_params_request_id_idx" ON "request_path_params"("request_id");

-- CreateIndex
CREATE INDEX "request_path_params_request_id_sort_order_idx" ON "request_path_params"("request_id", "sort_order");

-- CreateIndex
CREATE INDEX "request_body_params_request_id_idx" ON "request_body_params"("request_id");

-- CreateIndex
CREATE INDEX "request_body_params_request_id_sort_order_idx" ON "request_body_params"("request_id", "sort_order");

-- CreateIndex
CREATE INDEX "request_cookies_request_id_idx" ON "request_cookies"("request_id");

-- CreateIndex
CREATE INDEX "request_cookies_request_id_sort_order_idx" ON "request_cookies"("request_id", "sort_order");

-- CreateIndex
CREATE INDEX "environments_workspace_id_idx" ON "environments"("workspace_id");

-- CreateIndex
CREATE INDEX "environments_workspace_id_sort_order_idx" ON "environments"("workspace_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "environments_workspace_id_name_key" ON "environments"("workspace_id", "name");

-- CreateIndex
CREATE INDEX "environment_variables_environment_id_idx" ON "environment_variables"("environment_id");

-- CreateIndex
CREATE INDEX "environment_variables_environment_id_sort_order_idx" ON "environment_variables"("environment_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "environment_variables_environment_id_key_key" ON "environment_variables"("environment_id", "key");

-- CreateIndex
CREATE INDEX "workspace_variables_workspace_id_idx" ON "workspace_variables"("workspace_id");

-- CreateIndex
CREATE INDEX "workspace_variables_workspace_id_sort_order_idx" ON "workspace_variables"("workspace_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_variables_workspace_id_key_key" ON "workspace_variables"("workspace_id", "key");

-- CreateIndex
CREATE INDEX "collection_variables_collection_id_idx" ON "collection_variables"("collection_id");

-- CreateIndex
CREATE INDEX "collection_variables_collection_id_sort_order_idx" ON "collection_variables"("collection_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "collection_variables_collection_id_key_key" ON "collection_variables"("collection_id", "key");

-- CreateIndex
CREATE INDEX "request_examples_request_id_idx" ON "request_examples"("request_id");

-- CreateIndex
CREATE INDEX "request_examples_request_id_sort_order_idx" ON "request_examples"("request_id", "sort_order");

-- CreateIndex
CREATE INDEX "request_example_headers_example_id_idx" ON "request_example_headers"("example_id");

-- CreateIndex
CREATE INDEX "request_runs_workspace_id_idx" ON "request_runs"("workspace_id");

-- CreateIndex
CREATE INDEX "request_runs_request_id_idx" ON "request_runs"("request_id");

-- CreateIndex
CREATE INDEX "request_runs_user_id_idx" ON "request_runs"("user_id");

-- CreateIndex
CREATE INDEX "request_runs_environment_id_idx" ON "request_runs"("environment_id");

-- CreateIndex
CREATE INDEX "request_runs_created_at_idx" ON "request_runs"("created_at");

-- CreateIndex
CREATE INDEX "request_run_headers_run_id_idx" ON "request_run_headers"("run_id");

-- CreateIndex
CREATE INDEX "request_run_response_headers_run_id_idx" ON "request_run_response_headers"("run_id");

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_active_environment_id_fkey" FOREIGN KEY ("active_environment_id") REFERENCES "environments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_auth" ADD CONSTRAINT "request_auth_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_headers" ADD CONSTRAINT "request_headers_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_query_params" ADD CONSTRAINT "request_query_params_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_path_params" ADD CONSTRAINT "request_path_params_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_body_params" ADD CONSTRAINT "request_body_params_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_cookies" ADD CONSTRAINT "request_cookies_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environments" ADD CONSTRAINT "environments_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_variables" ADD CONSTRAINT "environment_variables_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_variables" ADD CONSTRAINT "workspace_variables_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_variables" ADD CONSTRAINT "collection_variables_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_examples" ADD CONSTRAINT "request_examples_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_example_headers" ADD CONSTRAINT "request_example_headers_example_id_fkey" FOREIGN KEY ("example_id") REFERENCES "request_examples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_runs" ADD CONSTRAINT "request_runs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_runs" ADD CONSTRAINT "request_runs_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_runs" ADD CONSTRAINT "request_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_runs" ADD CONSTRAINT "request_runs_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_run_headers" ADD CONSTRAINT "request_run_headers_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "request_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_run_response_headers" ADD CONSTRAINT "request_run_response_headers_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "request_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
