from django.contrib.sitemaps import Sitemap
from .models import Algorithm


class AlgorithmSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.5

    def items(self):
        return Algorithm.objects.filter(published=True)

    def lastmod(self, obj):
        return obj.mod_date