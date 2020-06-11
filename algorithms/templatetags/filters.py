from django import template

from algorithms.models import Algorithm

register = template.Library()


@register.filter
def text(obg: Algorithm, lang_code: str):
    return obg.formated_text(lang_code)
