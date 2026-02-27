ALTER TABLE "tasks" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "approvals_task_id_idx" ON "approvals" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "task_events_task_id_idx" ON "task_events" USING btree ("task_id");--> statement-breakpoint
CREATE OR REPLACE FUNCTION set_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint
DROP TRIGGER IF EXISTS tasks_set_updated_at ON "tasks";--> statement-breakpoint
CREATE TRIGGER tasks_set_updated_at
BEFORE UPDATE ON "tasks"
FOR EACH ROW
EXECUTE FUNCTION set_tasks_updated_at();