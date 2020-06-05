from django.contrib import admin
from .models import Algorithm


@admin.register(Algorithm)
class AlgorithmAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_ru', 'clean_url', 'tag_list')

    def tag_list(self, obj):
        return u", ".join(o.name for o in obj.tags.all())


