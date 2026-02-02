from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# models.py

class Event(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50)
    location = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    distance = models.CharField(max_length=50, blank=True, null=True)
    max_participants = models.IntegerField(blank=True, null=True)
    fee = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    image = models.ImageField(upload_to='events/', null=True, blank=True)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey('auth.User', null=True, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )
    approved_by = models.ForeignKey(
        'auth.User', null=True, blank=True, on_delete=models.SET_NULL, related_name='approved_events'
    )

    # 🆕 NEW FIELDS FOR OVERVIEW PAGE
    overview = models.TextField(blank=True)
    
    created_by = models.ForeignKey('auth.User', null=True, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    approved_by = models.ForeignKey(
        'auth.User', null=True, blank=True, on_delete=models.SET_NULL, related_name='approved_events'
    )

    def __str__(self):
        return self.name


#event - register.html form

class Registration(models.Model):
    
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    mobile = models.CharField(max_length=15)
    gender = models.CharField(max_length=10)
    event_name = models.CharField(max_length=200)
    amount = models.CharField(max_length=20, blank=True, null=True)
    emergency_contact = models.CharField(max_length=15)
    medical_condition = models.TextField(blank=True, null=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"