import os
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseNotFound, Http404
from django.shortcuts import render, redirect
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.template.loader import render_to_string
from .utils import markdown2html
from .models import Algorithm, Page
from django.conf import settings


def index(request):
    algorithms = Algorithm.objects.filter(entity=1, published=True)
    data_structures = Algorithm.objects.filter(entity=2, published=True)
    data_types = Algorithm.objects.filter(entity=3, published=True)

    for obj in algorithms:
        obj.set_language(request.LANGUAGE_CODE)

    for obj in data_structures:
        obj.set_language(request.LANGUAGE_CODE)

    for obj in data_types:
        obj.set_language(request.LANGUAGE_CODE)

    introduction = Page.objects.get(id=2)
    introduction.set_language(request.LANGUAGE_CODE)

    glossary = Algorithm.objects.get(id=16)
    glossary.set_language(request.LANGUAGE_CODE)

    context = {
        "algorithms": algorithms,
        "data_structures": data_structures,
        "data_types": data_types,
        "introduction": introduction,
        "glossary": glossary,
    }
    return render(request, 'index.html', context)


def cs(request, clean_url):
    object = Algorithm.objects.get(clean_url=clean_url)
    object.set_language(request.LANGUAGE_CODE)
    context = {
        "object": object
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


def page__1__context():
    table = []
    leg = [
        'NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL', 'BS', 'HT', 'LF', 'VT', 'FF', 'CR', 'SO', 'SI', 'DLE',
        'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB', 'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US',
        'SP', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5',
        '6', '7', '8', '9', ':', ';', '<', '=', '>', '?',
        '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
        'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_',
        '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
        'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~', 'DEL'
    ]
    for i in range(128):
        table.append([
            str(i),
            '{:08b}'.format(i),
            '{:03o}'.format(i),
            '{:02x}'.format(i).upper(),
            leg[i]
        ])
    return table


@require_http_methods(["GET"])
def page(request, clean_url):
    try:
        p = Page.objects.get(clean_url=clean_url)
    except Page.DoesNotExist:
        raise Http404()

    p.set_language(request.LANGUAGE_CODE)

    template = [f'page--{p.id}.html', 'page.html']

    context = {'object': p}
    context_callback = f'page__{p.id}__context'
    if globals().get(context_callback):
        context['data'] = globals()[context_callback]()

    response = render_to_string(template, context, request)
    return HttpResponse(response)


@require_http_methods(["GET"])
def page_not_found_view(request):
    return render(request, '404.html')