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
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.sitemaps.views import sitemap
from algorithms import views
from algorithms.sitemaps import AlgorithmSitemap

sitemaps = {
    "algorithms": AlgorithmSitemap
}

urlpatterns = [
    path('', views.index, name="index"),
    path('i18n/', include('django.conf.urls.i18n')),
    path('about/', views.about, name='about'),
    path('cs/', views.toc, name='toc'),
    path('cs/<str:clean_url>/', views.cs, name='cs'),
    path('cs/<str:clean_url>/<str:extension>/', views.implementation, name='implementation'),
    path('preview/', views.preview),
    path('admin/', admin.site.urls),
    path('ratings/', include('star_ratings.urls', namespace='ratings')),
    path('404/', views.page_not_found_view),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('<path:clean_url>/', views.page, name='page'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
