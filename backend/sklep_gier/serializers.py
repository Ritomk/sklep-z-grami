from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from .models import Genre, Game, Publisher, User, Cart, CartItem

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ("id", "name")

class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = ("id", "name", "website")


class GameSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    publisher = PublisherSerializer(many=False, read_only=True)
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = (
            "id",
            "title",
            "description",
            "price",
            "release_date",
            "publisher",
            "genres",
            "cover_image",
        )
    
    def get_cover_image(self, obj):
        if not obj.cover_image:
            return None
        request = self.context.get("request")
        url = obj.cover_image.url
        return request.build_absolute_uri(url) if request else url


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise AuthenticationFailed("No active account found")

        if not user.check_password(password):
            raise AuthenticationFailed("Incorrect password")

        refresh = self.get_token(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "nickname": user.username,         
        }


#
# ---- DODANE: Serializery dla koszyka ----
#

class CartItemSerializer(serializers.ModelSerializer):
    game = GameSerializer(read_only=True)
    game_id = serializers.PrimaryKeyRelatedField(
        source="game", queryset=Game.objects.all(), write_only=True
    )
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ("id", "game", "game_id", "quantity", "subtotal")

    def get_subtotal(self, obj):
        return obj.quantity * obj.game.price


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, source="cartitem_set", read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ("id", "user", "items", "total_price")
        read_only_fields = ("user",)

    def get_total_price(self, obj):
        total = 0
        for item in obj.cartitem_set.all():
            total += item.quantity * item.game.price
        return total
