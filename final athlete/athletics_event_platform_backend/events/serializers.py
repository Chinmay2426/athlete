# serializers.py
from rest_framework import serializers
from .models import Event

class ApprovedEventSerializer(serializers.ModelSerializer):
    imageUrl = serializers.ImageField(source='image', read_only=True)

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'description',
            'date',
            'location',
            'imageUrl',
            'price',
            'participants',
            'maxParticipants',
            'distance',
            'organizer',
            'registrationDeadline'
        ]

        
class EventSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None
