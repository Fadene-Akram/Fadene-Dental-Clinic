from django.core.management.base import BaseCommand
from django.utils.timezone import now
from notes.models import Task

class Command(BaseCommand):
    help = 'Deletes tasks that have reached their due date'

    def handle(self, *args, **kwargs):
        today = now().date()
        expired_tasks = Task.objects.filter(due_date__lt=today)
        count, _ = expired_tasks.delete()
        
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} expired task(s)'))
