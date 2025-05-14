from django.contrib import admin
from .models import *

admin.site.register(User)
admin.site.register(Game)
admin.site.register(Publisher)
admin.site.register(Genre)
admin.site.register(Review)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
