import markdown
from markdown_fenced_code_tabs import CodeTabsExtension


def markdown2html(markdown_text: str):
    fenced_code_tabs = CodeTabsExtension()
    fenced_code_tabs.setConfig("template", "bootstrap4")

    value = markdown.markdown(
        markdown_text,
        extensions=[
            fenced_code_tabs,
            'tables', 'toc', 'nl2br',
            'footnotes', 'attr_list', 'codehilite'
        ],
        extension_configs={
            "markdown_fenced_code_tabs": {
                "template": "bootstrap4"
            },
            "codehilite": {
                "noclasses": True
            }
        }
    )
    value = value.replace('<table>', '<table class="table table-sm table-bordered">')
    value = value.replace('<thead>', '<thead class="thead-dark">')
    return value
