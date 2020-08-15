import os


def ym_id_processor(request):
    return {"YANDEX_METRIKA_ID": os.environ.get('YANDEX_METRIKA_ID')}