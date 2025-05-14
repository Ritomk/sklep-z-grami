from rest_framework import serializers
from .models import Genre, Game, Publisher

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