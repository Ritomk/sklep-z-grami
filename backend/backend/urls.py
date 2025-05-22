from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

# Import widoków z aplikacji
from sklep_gier.views import (
    GameViewSet,
    hello,
    get_publishers,
    register
)

# Import widoków JWT
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Rejestracja widoków opartych o ViewSet (np. /api/games/)
router = DefaultRouter()
router.register(r"games", GameViewSet, basename="game")

urlpatterns = [
    # Panel administratora Django
    path('admin/', admin.site.urls),

    # API REST z routera (np. /api/games/)
    path('api/', include(router.urls)),

    # Proste endpointy funkcjonalne
    path('api/hello/', hello),
    path('api/publishers/', get_publishers),

    # Rejestracja użytkownika (dostępna bez autoryzacji)
    path('api/register/', register, name='register'),

    # Endpointy JWT (logowanie i odświeżenie tokenu)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Obsługa plików medialnych w trybie deweloperskim
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
