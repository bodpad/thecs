import markdown
from django import template
from algorithms.models import Algorithm
from ..utils import markdown2html

register = template.Library()
register.filter("markdown2html", markdown2html)


@register.filter
def text(obg: Algorithm, lang_code: str):
    return obg.formated_text(lang_code)


@register.filter
def name(obg: Algorithm, lang_code: str):
    return obg.title_en if lang_code == 'en' else obg.title_ru
