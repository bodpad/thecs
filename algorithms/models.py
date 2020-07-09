import glob
import os
from django.db import models
from taggit.managers import TaggableManager
from django.conf import settings
from .utils import markdown2html


class Algorithm(models.Model):
    language_code = 'en'
    ENTITY_CHOICE = [
        (1, 'Algorithm'),
        (2, 'Data structure'),
        (3, 'Abstract data type'),
    ]
    PLAYGROUND_CHOICE = [
        ('binary-heap', 'BinaryHeap'),
        ('shuffling', 'Shuffling'),
    ]
    name_en = models.CharField(max_length=255)
    name_ru = models.CharField(max_length=255)
    clean_url = models.CharField(max_length=255)
    text_en = models.TextField(null=True, blank=True)
    text_ru = models.TextField(null=True, blank=True)
    publish = models.BooleanField(default=True)
    tags = TaggableManager(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    entity = models.SmallIntegerField(choices=ENTITY_CHOICE, blank=True, null=True)
    playground = models.CharField(max_length=255, choices=PLAYGROUND_CHOICE, null=True, blank=True)

    def save(self, *args, **kwargs):
        self.text_en = self.text_en.strip()
        self.text_ru = self.text_ru.strip()
        super(Algorithm, self).save(*args, **kwargs)

    def formated_text(self, lang_code):
        attr = f"text_{lang_code}"
        value = getattr(self, attr) if hasattr(self, attr) else None
        if value:
            return markdown2html(value)
        return None

    @property
    def name(self):
        attr = f"name_{self.language_code}"
        return getattr(self, attr) if hasattr(self, attr) else self.name_en

    @property
    def text(self):
        attr = f"text_{self.language_code}"
        return getattr(self, attr) if hasattr(self, attr) else self.text_en

    def implementations(self):
        languages = {
            "py": "Python",
            "java": "Java",
            "ts": "TypeScript",
            "js": "JavaScript",
        }
        pathname = os.path.join(settings.BASE_DIR, 'implementations', f'{self.clean_url}.*')
        files = glob.glob(pathname)
        if not files: return None
        output = []
        for file in files:
            file = file.split('/')[-1]
            filename, extension = file.split('.')
            output.append({
                "language": languages[extension],
                "filename": filename,
                "extension": extension
            })
        return output
