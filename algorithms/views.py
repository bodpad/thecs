import os
from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render
from .models import Algorithm
from django.conf import settings


def index(request):
    return render(request, 'index.html')


def cs(request, clean_url):
    obj = Algorithm.objects.get(clean_url=clean_url)
    path = os.path.join(settings.BASE_DIR, "playgrounds", obj.clean_url)
    playground = f"{obj.clean_url}/impl.html" if os.path.exists(path) else None
    context = {
        "algorithm": obj,
        "playground": playground, # deprecated
    }
    return render(request, 'cs.html', context)


def about(request):
    return render(request, 'about.html')


def table_of_contents(request):
    algorithms = Algorithm.objects.filter(entity=1, publish=True)
    data_structures = Algorithm.objects.filter(entity=2, publish=True)
    data_types = Algorithm.objects.filter(entity=3, publish=True)
    context = {
        "algorithms": algorithms,
        "data_structures": data_structures,
        "data_types": data_types
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
