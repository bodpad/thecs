import glob
import os
import re
from django.db import models
from taggit.managers import TaggableManager
from django.conf import settings
from .utils import markdown2html


def PLAYGROUND_CHOICE():
    playgrounds = os.listdir(os.path.join(settings.BASE_DIR, 'src/components'))
    playgrounds = [pg.replace('.vue', '') for pg in playgrounds]
    playgrounds = filter(lambda pg: pg not in ['CodeViewer'], playgrounds)
    output = []
    for pg in playgrounds:
        output.append((
            re.sub(r'(?<!^)(?=[A-Z])', '-', pg).lower(),
            pg
        ))
    return output


class Article(models.Model):
    language_code = 'en'

    title_en = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255)
    clean_url = models.CharField(max_length=255)
    text_en = models.TextField(null=True, blank=True)
    text_ru = models.TextField(null=True, blank=True)
    tags = TaggableManager(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    publish = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        self.text_en = self.text_en.strip()
        self.text_ru = self.text_ru.strip()
        super(Article, self).save(*args, **kwargs)

    @property
    def title(self):
        attr = f"title_{self.language_code}"
        return getattr(self, attr) if hasattr(self, attr) else self.title_en

    @property
    def text(self):
        attr = f"text_{self.language_code}"
        return markdown2html(getattr(self, attr)) if hasattr(self, attr) else markdown2html(self.text_en)

    class Meta:
        abstract = True


class Algorithm(Article):
    ENTITY_CHOICE = [
        (1, 'Algorithm'),
        (2, 'Data structure'),
        (3, 'Abstract data type'),
    ]
    entity = models.SmallIntegerField(choices=ENTITY_CHOICE, blank=True, null=True)
    playground = models.CharField(max_length=255, choices=PLAYGROUND_CHOICE(), null=True, blank=True)

    def formated_text(self, lang_code):
        attr = f"text_{lang_code}"
        value = getattr(self, attr) if hasattr(self, attr) else None
        if value:
            return markdown2html(value)
        return None

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
