import markdown
from algorithms.markdown_extensions.alert import AlertExtension


def markdown2html(markdown_text: str):
    value = markdown.markdown(
        markdown_text,
        extensions=[
            AlertExtension(),
            'tables',
            'toc',
            'nl2br',
            'footnotes',
            'attr_list',
            'codehilite',
            'pymdownx.tabbed',
            'pymdownx.tilde'
        ],
        extension_configs={}
    )
    value = value.replace('<table>', '<table class="table table-sm table-bordered">')
    value = value.replace('<thead>', '<thead class="thead-dark">')
    value = value.replace('<img', '<img loading=lazy')
    return value
