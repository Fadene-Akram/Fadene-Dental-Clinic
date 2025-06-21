from django_cron import CronJobBase, Schedule
from django.utils.timezone import now
from notes.models import Task

class DeleteExpiredTasksCronJob(CronJobBase):
    RUN_EVERY_MINS = 1440  # Every day
    schedule = Schedule(run_every_mins=RUN_EVERY_MINS, run_at_times=['00:00'])  # Run at midnight every day
    code = 'notes.delete_expired_tasks'  # Unique code for job

    def do(self):
        today = now().date()
        expired_tasks = Task.objects.filter(due_date__lte=today)
        count, _ = expired_tasks.delete()
        print(f"Deleted {count} expired tasks.")