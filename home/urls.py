from django.urls import path
from .views import home_page as home

urlpatterns = [
    path("", home,name="home"),
]