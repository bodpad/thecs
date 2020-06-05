from django.shortcuts import render
from .models import Algorithm


def index(request):
    algs = Algorithm.objects.all().order_by('-created')[:10]
    context = {
        'last_modified': algs
    }
    return render(request, 'index.html', context)


def algorithm(request, clean_url):
    alg = Algorithm.objects.get(clean_url=clean_url)
    return render(request, 'algorithm.html', {"algorithm": alg})


def about(request):
    return render(request, 'about.html')


def algorithms(request):
    return render(request, 'algorithms.html')


def data_structures(request):
    return render(request, 'data_structures.html')
