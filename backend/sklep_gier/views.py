from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions
from .models import Publisher, Game, User
from .serializers import GameSerializer

# Testowy endpoint
@api_view(['GET'])
def hello(request):
    return Response({"msg": "Test"})

# Endpoint do pobierania wydawców
@api_view(['GET'])
def get_publishers(request):
    publishers = Publisher.objects.all().values('id', 'name', 'website')
    return Response(list(publishers))

# Widok tylko do odczytu gier
class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Game.objects.prefetch_related("genres").all()
    serializer_class = GameSerializer

# Endpoint rejestracji użytkownika (bez autoryzacji)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'detail': 'username and password required'},
                        status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({'detail': 'user exists'},
                        status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, password=password)
    return Response({'id': user.id, 'username': user.username},
                    status=status.HTTP_201_CREATED)
