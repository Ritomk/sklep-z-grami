from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from .models import Publisher, Game, User, Cart, CartItem
from .serializers import (
    GenreSerializer,
    PublisherSerializer,
    GameSerializer,
    EmailTokenObtainPairSerializer,
    CartSerializer,
    CartItemSerializer,
)

# Testowy endpoint
@api_view(['GET'])
def hello(request):
    return Response({"msg": "Test"})

# Endpoint do pobierania wydawców
@api_view(['GET'])
def get_publishers(request):
    publishers = Publisher.objects.all().values('id', 'name', 'website')
    return Response(list(publishers))


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def register(request):
    """
    Rejestracja użytkownika przyjmująca:
      email, password, nickname, first_name, last_name, birth_date
    """
    data = request.data

    email = data.get("email")
    password = data.get("password")
    nickname = data.get("nickname")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    birth_date = data.get("birth_date")

    # minimalna walidacja
    if not email or not password:
        return Response(
            {"detail": "email and password required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        validate_email(email)
    except ValidationError:
        return Response(
            {"detail": "invalid email"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(email__iexact=email).exists():
        return Response(
            {"detail": "email already registered"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if nickname and User.objects.filter(username=nickname).exists():
        return Response(
            {"detail": "nickname already taken"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = User.objects.create_user(
        username=nickname,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        birth_date=birth_date,
    )
    return Response(
        {
            "id": user.id,
            "email": user.email,
            "nickname": user.username,
        },
        status=status.HTTP_201_CREATED,
    )


# Widok tylko do odczytu gier
class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Game.objects.prefetch_related("genres").all()
    serializer_class = GameSerializer


# Endpoint dla biblioteki
@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def library(request):
    user = request.user

    if request.method == "GET":
        games = user.library.all()
        data = GameSerializer(games, many=True, context={"request": request}).data
        return Response(data)

    if request.method == "POST":
        game_id = request.data.get("game")
        if not game_id:
            return Response({"detail": "game id required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            game = Game.objects.get(pk=game_id)
        except Game.DoesNotExist:
            return Response({"detail": "game not found"}, status=status.HTTP_404_NOT_FOUND)

        user.library.add(game)
        return Response({"detail": "added"}, status=status.HTTP_201_CREATED)

    if request.method == "DELETE":
        game_id = request.data.get("game")
        if not game_id:
            return Response({"detail": "game id required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            game = Game.objects.get(pk=game_id)
        except Game.DoesNotExist:
            return Response({"detail": "game not found"}, status=status.HTTP_404_NOT_FOUND)

        user.library.remove(game)
        return Response(status=status.HTTP_204_NO_CONTENT)


#
# ---- DODANE: Widoki dla koszyka ----
#

def get_or_create_cart(user):
    """
    Jeśli użytkownik ma już koszyk, zwracamy go. W przeciwnym razie tworzymy nowy.
    """
    cart, created = Cart.objects.get_or_create(user=user)
    return cart


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def cart_detail(request):
    """
    Pobiera szczegóły koszyka zalogowanego użytkownika:
    – lista pozycji (game, quantity, subtotal)
    – łączna cena
    """
    user = request.user
    cart = get_or_create_cart(user)
    serializer = CartSerializer(cart, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cart_add_item(request):
    """
    Dodaje grę do koszyka (lub zwiększa ilość, jeśli już występuje).
    Oczekiwane dane w body: {
        "game_id": <int>,
        "quantity": <int>  # opcjonalne, default=1
    }
    """
    user = request.user
    data = request.data
    game_id = data.get("game_id")
    quantity = data.get("quantity", 1)

    if not game_id:
        return Response({"detail": "game_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        game = Game.objects.get(pk=game_id)
    except Game.DoesNotExist:
        return Response({"detail": "Game not found"}, status=status.HTTP_404_NOT_FOUND)

    cart = get_or_create_cart(user)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, game=game)
    if not created:
        cart_item.quantity += int(quantity)
    else:
        cart_item.quantity = int(quantity)
    cart_item.save()

    serializer = CartItemSerializer(cart_item, context={"request": request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def cart_update_item(request, item_id: int):
    """
    Aktualizuje ilość pozycji w koszyku.
    Oczekiwane dane w body: {
        "quantity": <int>
    }
    """
    user = request.user
    new_qty = request.data.get("quantity")
    if new_qty is None:
        return Response({"detail": "quantity is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        cart_item = CartItem.objects.get(pk=item_id, cart__user=user)
    except CartItem.DoesNotExist:
        return Response({"detail": "CartItem not found"}, status=status.HTTP_404_NOT_FOUND)

    cart_item.quantity = int(new_qty)
    if cart_item.quantity <= 0:
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    cart_item.save()
    serializer = CartItemSerializer(cart_item, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def cart_remove_item(request, item_id: int):
    """
    Usuwa pozycję z koszyka.
    """
    user = request.user
    try:
        cart_item = CartItem.objects.get(pk=item_id, cart__user=user)
    except CartItem.DoesNotExist:
        return Response({"detail": "CartItem not found"}, status=status.HTTP_404_NOT_FOUND)

    cart_item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
