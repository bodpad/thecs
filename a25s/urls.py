"""a25s URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from algorithms import views

urlpatterns = [
    path('', views.index),
    path('i18n/', include('django.conf.urls.i18n')),
    path('about/', views.about, name='about'),
    path('cs/', views.table_of_contents, name='table_of_contents'),
    path('cs/<str:clean_url>/', views.cs, name='cs'),
    path('cs/<str:clean_url>/<str:extension>/', views.implementation, name='implementation'),
    path('admin/', admin.site.urls),
]
