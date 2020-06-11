import markdown
import glob
import os
from django.db import models
from taggit.managers import TaggableManager
from django.conf import settings


class Algorithm(models.Model):
    DIFFICULTY_CHOICE = [
        (1, 'Easy'),
        (2, 'Medium'),
        (3, 'Hard'),
    ]
    name_en = models.CharField(max_length=255)
    name_ru = models.CharField(max_length=255)
    clean_url = models.CharField(max_length=255)
    text_en = models.TextField(null=True, blank=True)
    text_ru = models.TextField(null=True, blank=True)
    java = models.TextField(null=True, blank=True)
    python = models.TextField(null=True, blank=True)
    cpp = models.TextField(null=True, blank=True)
    difficulty = models.SmallIntegerField(choices=DIFFICULTY_CHOICE)
    publish = models.BooleanField(default=False)
    tags = TaggableManager(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.text_en = self.text_en.strip()
        self.text_ru = self.text_ru.strip()
        super(Algorithm, self).save(*args, **kwargs)

    def formated_text(self, lang_code):
        attr = f"text_{lang_code}"
        value = getattr(self, attr) if hasattr(self, attr) else None
        return markdown.markdown(value) if value else None

    def implementations(self):
        pathname = os.path.join(settings.BASE_DIR, 'implementation', f'{self.clean_url}.*')
        impls = glob.glob(pathname)
        impls = [impl.split('/')[-1] for impl in impls]
        impls = [{'filename': impl, 'language': impl.split('.')[1]} for impl in impls]
        return impls
