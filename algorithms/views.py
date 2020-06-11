import glob
import os

from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render
from .models import Algorithm
from django.conf import settings


def index(request):
    algs = Algorithm.objects.all().order_by('-created')[:10]
    context = {
        'last_modified': algs
    }
    return render(request, 'index.html', context)


def algorithm(request, clean_url):
    alg = Algorithm.objects.get(clean_url=clean_url)
    # print(request.LANGUAGE_CODE)
    return render(request, 'algorithm.html', {"algorithm": alg})


def about(request):
    return render(request, 'about.html')


def algorithms(request):
    algs = Algorithm.objects.all()
    return render(request, 'algorithms.html', {"algorithms": algs})


def data_structures(request):
    return render(request, 'data_structures.html')


def algorithm_implementation(request, filename):
    try:
        fsock = open(os.path.join(settings.BASE_DIR, 'implementation', filename), 'rb')
        response = HttpResponse(fsock)
        filename = f"{filename.split('.')[0]}.{filename.split('.')[2]}"
        response['content-disposition'] = f'attachment; filename="{filename}"'
        return response
    except:
        return HttpResponseNotFound(request)
