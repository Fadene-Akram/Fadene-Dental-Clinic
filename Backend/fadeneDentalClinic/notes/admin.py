
from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'status', 'due_date', 'created_at', 'updated_at')
    list_filter = ('status', 'due_date')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Task Information', {
            'fields': ('title', 'description', 'status')
        }),
        ('Date Information', {
            'fields': ('due_date', 'created_at', 'updated_at')
        }),
        ('Appearance', {
            'fields': ('color',),
            'classes': ('collapse',)
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        """Make created_at and updated_at read-only."""
        if obj:  # Editing an existing object
            return self.readonly_fields
        return ()  # When creating a new object