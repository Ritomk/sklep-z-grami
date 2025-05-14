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