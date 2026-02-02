from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'category',
        'status',
        'created_by',
        'approved_by',
        'start_date'
    )
    list_filter = ('status', 'category')
    search_fields = ('name', 'location')
    actions = ['approve_events', 'reject_events']

    def approve_events(self, request, queryset):
        queryset.update(status='approved', approved_by=request.user)

    def reject_events(self, request, queryset):
        queryset.update(status='rejected', approved_by=request.user)

    approve_events.short_description = "Approve selected events"
    reject_events.short_description = "Reject selected events"


#event form - register.html
from django.contrib import admin
from .models import Registration

class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'mobile', 'gender', 
                    'event_name', 'amount', 'emergency_contact', 'medical_condition', 'registered_at')
    ordering = ('registered_at',)
    list_filter = ('gender', 'event_name', 'registered_at')
    
admin.site.register(Registration, EventRegistrationAdmin)
