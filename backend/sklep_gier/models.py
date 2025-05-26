from django.db import models
from django.contrib.auth.models import AbstractUser

# Użytkownik
class User(AbstractUser):
    username = models.CharField(
        "nickname",
        max_length=150,
        unique=True,
        null=True,        
        blank=True,
    )

    email = models.EmailField("e-mail address", unique=True)
    birth_date = models.DateField(null=True, blank=True)

    library = models.ManyToManyField("Game", related_name="owned_by")

    USERNAME_FIELD = "email"       
    REQUIRED_FIELDS = ["username"]  

    def __str__(self):
        return self.email



# Wydawca
class Publisher(models.Model):
    name = models.CharField(max_length=255, unique=True)
    website = models.URLField(blank=True)

    def __str__(self):
        return self.name

# Gatunek
class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

# Gra
class Game(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    release_date = models.DateField()
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE)
    genres = models.ManyToManyField(Genre)
    cover_image = models.ImageField(upload_to='game_covers/', blank=True)

    def __str__(self):
        return self.title

# Recenzja
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

# Koszyk
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

# Pozycja w koszyku
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

# Zamówienie
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='pending')  # np. pending, completed

# Pozycja zamówienia (snapshot ceny)
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    price_snapshot = models.DecimalField(max_digits=6, decimal_places=2)
