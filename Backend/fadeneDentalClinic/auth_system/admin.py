from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    # Only show these fields in the list view
    list_display = ('id', 'username', 'role', 'security_question')
    search_fields = ('username', 'role')
    readonly_fields = ('password', 'security_answer') 
    
    fieldsets = (
        (None, {
            'fields': ('username', 'password', 'role')
        }),
        ('Security Information', {
            'fields': ('security_question', 'security_answer'),
        }),
    )
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if obj: 
           
            form.base_fields['password'].disabled = True
            form.base_fields['security_answer'].disabled = True
        return form
