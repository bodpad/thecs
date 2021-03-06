from django.contrib import admin
from .models import Algorithm, Page


@admin.register(Algorithm)
class AlgorithmAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'title_ru', 'path', 'tag_list', 'playground', 'published')
    list_filter = ('entity',)

    def tag_list(self, obj):
        return u", ".join(o.name for o in obj.tags.all())

    class Media:
        css = {
            'all': ('css/admin.css',),
        }

        js = (
            'behave-js/behave.js',
            'js/admin.js',
        )


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'title_ru', 'path', 'published')



