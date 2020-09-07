from markdown.preprocessors import Preprocessor
from markdown.extensions import Extension
import re


class NoRender(Preprocessor):
    """ Skip any line with words 'NO RENDER' in it. """
    def run(self, lines):
        # print(lines)
        new_lines = []
        for line in lines:
            m = re.search("NO RENDER", line)
            if not m:
                # any line without NO RENDER is passed through
                new_lines.append(line)
        return new_lines


class AlertExtension(Extension):
    def extendMarkdown(self, md):
        md.preprocessors.register(NoRender(md), 'alert', 175)