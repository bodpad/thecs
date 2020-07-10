import os
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from .utils import markdown2html
from .models import Algorithm
from django.conf import settings


def index(request):
    return render(request, 'index.html')


def cs(request, clean_url):
    obj = Algorithm.objects.get(clean_url=clean_url)
    obj.language_code = request.LANGUAGE_CODE
    context = {
        "algorithm": obj
    }
    return render(request, 'cs.html', context)


def about(request):
    return render(request, 'about.html')


def toc(request):
    algorithms = Algorithm.objects.filter(entity=1, publish=True)
    data_structures = Algorithm.objects.filter(entity=2, publish=True)
    data_types = Algorithm.objects.filter(entity=3, publish=True)
    other = list(Algorithm.objects.filter(id__in=[14, 16]))

    other[0].language_code = request.LANGUAGE_CODE
    other[1].language_code = request.LANGUAGE_CODE

    context = {
        "algorithms": algorithms,
        "data_structures": data_structures,
        "data_types": data_types,
        "introduction": other[0],
        "glossary": other[1],
    }
    return render(request, 'toc.html', context)


def implementation(request, clean_url, extension):
    try:
        file = f"{clean_url}.{extension}"
        f = open(os.path.join(settings.BASE_DIR, 'implementations', file), 'rb')
        response = HttpResponse(f)
        response['content-disposition'] = f'attachment; filename="{file}"'
        return response
    except:
        return HttpResponseNotFound(request)


@csrf_exempt
@xframe_options_exempt
@login_required
def preview(request):
    if request.method == 'POST':
        html = markdown2html(request.POST.get('text'))
        return HttpResponse(html)
    else:
        return render(request, 'preview.html')

