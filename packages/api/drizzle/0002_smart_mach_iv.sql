CREATE TYPE "public"."approval_action" AS ENUM('run', 'deploy', 'terraform_apply');--> statement-breakpoint
CREATE TYPE "public"."approval_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."task_mode" AS ENUM('manual', 'auto');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('queued', 'running', 'succeeded', 'failed', 'cancelled');--> statement-breakpoint
ALTER TABLE "approvals" ALTER COLUMN "action" SET DATA TYPE "public"."approval_action" USING "action"::"public"."approval_action";--> statement-breakpoint
ALTER TABLE "approvals" ALTER COLUMN "status" SET DATA TYPE "public"."approval_status" USING "status"::"public"."approval_status";--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "mode" SET DATA TYPE "public"."task_mode" USING "mode"::"public"."task_mode";--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DATA TYPE "public"."task_status" USING "status"::"public"."task_status";