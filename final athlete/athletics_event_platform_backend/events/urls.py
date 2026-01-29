from django.urls import path
from . import views
from .views import (
    pending_events,
    approved_events,
    approve_event,
    register_event,
    reject_event,
)

urlpatterns = [
    path('api/create-event/', views.api_create_event, name='api_create_event'),
    path('events/create/', views.create_event_page, name='create_event_page'),  # <- new

    path('super-admin/events/', views.super_admin_events, name='super-admin-events'),

    path('register/', views.registration_page, name='registration_page'),
    path('api/register-event/', views.register_event, name='register-event'),

    path('thankyou/',views.thankyou,name='thankyou'),
    path('thank-you/<int:reg_id>/', views.thankyou, name='thank-you'),
    path('download-receipt/<int:reg_id>/', views.download_receipt, name='download_receipt'),

    path("api/pending-events/", views.pending_events, name="pending_events"),
    path("api/events/<int:event_id>/approve/", views.approve_event),
    path("api/events/<int:event_id>/reject/", views.reject_event),

    path("pending-events/", pending_events),
    path("approved-events/", approved_events),
    path("events/<int:id>/approve/", approve_event),
    path("events/<int:id>/reject/", reject_event),

    #path('api/approved-events/', views.approved_events, name='approved-events'),

]
    
