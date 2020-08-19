import os
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render, redirect
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from .utils import markdown2html
from .models import Algorithm
from django.conf import settings


def index(request):
    algorithms = Algorithm.objects.filter(entity=1, publish=True)
    data_structures = Algorithm.objects.filter(entity=2, publish=True)
    data_types = Algorithm.objects.filter(entity=3, publish=True)

    introduction = Algorithm.objects.get(id=14)
    introduction.language_code = request.LANGUAGE_CODE

    glossary = Algorithm.objects.get(id=16)
    glossary.language_code = request.LANGUAGE_CODE

    context = {
        "algorithms": algorithms,
        "data_structures": data_structures,
        "data_types": data_types,
        "introduction": introduction,
        "glossary": glossary,
    }
    return render(request, 'index.html', context)


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
    return redirect('index')


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

