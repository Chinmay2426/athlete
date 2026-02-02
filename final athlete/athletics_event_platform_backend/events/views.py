from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import Event

@login_required
def create_event(request):
    if request.method == 'POST':
        try:
            event = Event.objects.create(
                name=request.POST.get('name'),
                category=request.POST.get('category'),
                location=request.POST.get('location'),
                start_date=request.POST.get('start_date'),
                end_date=request.POST.get('end_date'),
                start_time=request.POST.get('start_time'),
                end_time=request.POST.get('end_time'),
                distance=request.POST.get('distance') or None,
                max_participants=request.POST.get('max_participants') or None,
                fee=request.POST.get('fee') or None,
                description=request.POST.get('description'),
                image=request.FILES.get('image'),  # ✅ THIS is your banner
                created_by=request.user,
                status='PENDING'
            )
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse({'status': 'error', 'message': 'Invalid request'})

# Super Admin view to see pending events
@login_required
def super_admin_events(request):
    pending_events = Event.objects.filter(status='PENDING')
    return render(request, 'super_admin_events.html', {'events': pending_events})


#event - register.html
# views.py


from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse,HttpResponse
from .models import Registration

@csrf_exempt
def register_event(request):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'error': 'Invalid request method'})

    event_name = request.POST.get('event_name')
    first_name = request.POST.get('first_name')
    last_name = request.POST.get('last_name')
    email = request.POST.get('email')
    mobile = request.POST.get('mobile')
    gender = request.POST.get('gender')
    amount = request.POST.get('amount')
    emergency_contact = request.POST.get('emergency_contact')
    medical_condition = request.POST.get('medical_condition')

    if not event_name or not first_name or not email:
        return JsonResponse({'status': 'error', 'error': 'Missing required fields'})

    registration = Registration.objects.create(
        event_name=event_name,
        first_name=first_name,
        last_name=last_name,
        email=email,
        mobile=mobile,
        gender=gender,
        amount=amount or 0,
        emergency_contact=emergency_contact,
        medical_condition=medical_condition
    )

    # Return registration ID
    return JsonResponse({'status': 'success', 'reg_id': registration.id})


#event - register.html
from django.shortcuts import render, redirect
from .models import Registration

def registration_page(request):
    if request.method == "POST":
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        email = request.POST.get("email")
        mobile = request.POST.get("mobile")
        gender = request.POST.get("gender")
        event_name = request.POST.get("event_name")
        amount = request.POST.get("amount") or 0
        emergency_contact = request.POST.get("emergency_contact")
        medical_condition = request.POST.get("medical_condition", "")

        registration = Registration.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            mobile=mobile,
            gender=gender,
            event_name=event_name,
            amount=amount,
            emergency_contact=emergency_contact,
            medical_condition=medical_condition
        )

        # Redirect to thank you page with registration id
        return redirect("thank-you", reg_id=registration.id)


    return render(request, "events/register.html")

    

def thankyou(request):
    return render(request, 'events/thankyou.html')


def download_receipt(request, reg_id):
    # Fetch registration
    try:
        reg = Registration.objects.get(id=reg_id)
        content = f"""
        Receipt for {reg.first_name} {reg.last_name}
        Event: {reg.event_name}
        Amount Paid: {reg.amount}
        """
        response = HttpResponse(content, content_type='text/plain')
        response['Content-Disposition'] = f'attachment; filename="receipt_{reg_id}.txt"'
        return response
    except Registration.DoesNotExist:
        return HttpResponse("Receipt not found", status=404)


# views.py
from django.http import JsonResponse
from .models import Event

# CSRF exempt if calling from live server
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def api_create_event(request):
    if request.method == 'POST':
        try:
            event = Event.objects.create(
                name=request.POST.get('name'),
                category=request.POST.get('category'),
                location=request.POST.get('location'),
                start_date=request.POST.get('start_date'),
                end_date=request.POST.get('end_date'),
                start_time=request.POST.get('start_time'),
                end_time=request.POST.get('end_time'),
                distance=request.POST.get('distance') or None,
                max_participants=request.POST.get('max_participants') or None,
                fee=request.POST.get('fee') or None,
                description=request.POST.get('description'),
                image=request.FILES.get('image'),
                created_by=None  # no login for now
            )
            return JsonResponse({'status': 'success', 'event_id': event.id})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})



def create_event_page(request):
    return render(request, 'event.html')


#pending events
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Event
@api_view(["GET"])
def pending_events(request):
    events = Event.objects.filter(status="PENDING")

    return Response([
        {
            "id": e.id,
            "title": e.name,                    # ✔ from form
            "date": e.start_date,               # ✔ model field
            "maxParticipants": e.max_participants,
            "price": e.fee,
            "currency": "USD",
            "imageUrl": e.image.url if e.image else "",
        }
        for e in events
    ])

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Event

# APPROVE EVENT
@api_view(["POST"])
def approve_event(request, id):
    try:
        event = Event.objects.get(id=id)
        event.status = "APPROVED"
        event.save()
        return Response({"status": "APPROVED"})
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=404)


# REJECT EVENT
@api_view(["POST"])
def reject_event(request, id):
    try:
        event = Event.objects.get(id=id)
        event.status = "REJECTED"
        event.save()
        return Response({"status": "REJECTED"})
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=404)


# @api_view(["GET"])
# def approved_events(request):
#     events = Event.objects.filter(status="APPROVED")

#     return Response([
#         {
#             "id": e.id,
#             "title": e.name,
#             "date": e.start_date,
#             "location": e.location,
#             "maxParticipants": e.max_participants,
#             "price": e.fee,
#             "imageUrl": e.image.url if e.image else "",

#         }
#         for e in events
#      ])


@api_view(["GET"])
def approved_events(request):
    events = Event.objects.filter(status="APPROVED")

    return Response([
        {
            "id": e.id,
            "title": e.name,
            "description": e.description,
            "date": e.start_date,
            "location": e.location,
            "distance": e.distance,
            "price": e.fee,
            "maxParticipants": e.max_participants,
            "participants": 0,  # later you can count registrations
            "organizer": e.created_by.username if e.created_by else "Event Organizer",
            "registrationDeadline": e.end_date,
            "imageUrl": request.build_absolute_uri(e.image.url) if e.image else "",
        }
        for e in events
    ])



#serializers
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer

class ApprovedEventsAPIView(APIView):
    def get(self, request):
        events = Event.objects.filter(status='APPROVED')
        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)
