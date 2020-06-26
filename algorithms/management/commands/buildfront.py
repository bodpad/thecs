import os
import shutil
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        packages = ["@svgdotjs", "vue", "bootstrap", "axios", "popper.js", "jquery", "highlight.js"]
        for pkg in packages:
            src = os.path.join(settings.BASE_DIR, "node_modules", pkg)
            dst = os.path.join(settings.BASE_DIR, "dist", pkg)
            shutil.copytree(src, dst, dirs_exist_ok=True)
        self.stdout.write(self.style.SUCCESS('Successfully'))
