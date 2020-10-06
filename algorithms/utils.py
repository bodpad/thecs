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
            'def_list',
            'codehilite',
            'pymdownx.tabbed',
            'pymdownx.tilde',
            'pymdownx.betterem',
            'pymdownx.mark'
        ],
        extension_configs={}
    )

    value = value.replace('<img', '<img loading=lazy')
    return value
