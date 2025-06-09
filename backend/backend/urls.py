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
    register,
    library,
    EmailTokenObtainPairView,
    cart_detail,
    cart_add_item,
    cart_update_item,
    cart_remove_item,
)

# Import widoków JWT
from rest_framework_simplejwt.views import TokenRefreshView

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
    path('api/library/', library, name='library'),

    # Endpointy koszyka
    path('api/cart/', cart_detail, name='cart_detail'),
    path('api/cart/add/', cart_add_item, name='cart_add_item'),
    path('api/cart/update/<int:item_id>/', cart_update_item, name='cart_update_item'),
    path('api/cart/remove/<int:item_id>/', cart_remove_item, name='cart_remove_item'),

    # Rejestracja użytkownika (dostępna bez autoryzacji)
    path("api/register/", register, name="register"),

    # Endpointy JWT (logowanie i odświeżenie tokenu)
    path("api/token/", EmailTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]

# Obsługa plików medialnych w trybie deweloperskim
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
