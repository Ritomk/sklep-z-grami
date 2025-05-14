from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Publisher
from rest_framework import viewsets
from .serializers import GameSerializer
from .models import Game

# Create your views here.
@api_view(['GET'])
def hello(request):
    return Response({"msg": "Test"})

@api_view(['GET'])
def get_publishers(request):
    publishers = Publisher.objects.all().values('id', 'name', 'website')
    return Response(list(publishers))

class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Game.objects.prefetch_related("genres").all()
    serializer_class = GameSerializer