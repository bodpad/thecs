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


class BasePage(models.Model):
    _language_code = 'en'

    title_en = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255)
    path = models.CharField(max_length=255)
    text_en = models.TextField(null=True, blank=True)
    text_ru = models.TextField(null=True, blank=True)
    description_en = models.CharField(max_length=255, null=True, blank=True)
    description_ru = models.CharField(max_length=255, null=True, blank=True)
    tags = TaggableManager(blank=True)
    pub_date = models.DateTimeField(auto_now_add=True)
    mod_date = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        self.text_en = self.text_en.strip()
        self.text_ru = self.text_ru.strip()
        super(BasePage, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return "/%s/" % self.path

    def get_language(self):
        return self._language_code

    def set_language(self, language_code):
        self._language_code = language_code

    def formatted_text(self, lang_code):
        attr = f"text_{lang_code}"
        value = getattr(self, attr) if hasattr(self, attr) else None
        if value:
            return markdown2html(value)
        return None

    @property
    def title(self):
        attr = f"title_{self._language_code}"
        return getattr(self, attr) if hasattr(self, attr) else self.title_en

    @property
    def description(self):
        return getattr(self, f"description_{self._language_code}") or ''

    @property
    def text(self):
        attr = f"text_{self._language_code}"
        return markdown2html(getattr(self, attr)) if hasattr(self, attr) else markdown2html(self.text_en)

    class Meta:
        abstract = True


class Page(BasePage):
    pass


class Algorithm(BasePage):
    ENTITY_CHOICE = [
        (1, 'Algorithm'),
        (2, 'Data structure'),
        (3, 'Abstract data type'),
    ]
    entity = models.SmallIntegerField(choices=ENTITY_CHOICE, blank=True, null=True)
    playground = models.CharField(max_length=255, choices=PLAYGROUND_CHOICE(), null=True, blank=True)

    def get_absolute_url(self):
        return "/cs/%s/" % self.path

    @property
    def has_playground(self):
        return bool(self.playground)

    @property
    def has_implementation(self):
        return bool(self.implementations())

    @property
    def has_text(self):
        return bool(self.text)

    def implementations(self):
        languages = {
            "py": "Python",
            "java": "Java",
            "ts": "TypeScript",
            "js": "JavaScript",
        }
        pathname = os.path.join(settings.BASE_DIR, 'implementations', f'{self.path}.*')
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
