import markdown
from django.db import models
from taggit.managers import TaggableManager


class Algorithm(models.Model):
    DIFFICULTY_CHOICE = [
        (1, 'Easy'),
        (2, 'Medium'),
        (3, 'Hard'),
    ]
    name_en = models.CharField(max_length=255)
    name_ru = models.CharField(max_length=255)
    clean_url = models.CharField(max_length=255)
    text_en = models.TextField()
    text_ru = models.TextField()
    java = models.TextField(null=True, blank=True)
    python = models.TextField(null=True, blank=True)
    cpp = models.TextField(null=True, blank=True)
    difficulty = models.SmallIntegerField(choices=DIFFICULTY_CHOICE)
    publish = models.BooleanField(default=False)
    tags = TaggableManager(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def text_en_as_html(self):
        return markdown.markdown(self.text_en)
