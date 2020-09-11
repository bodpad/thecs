import os
import subprocess
import shutil
from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = ''
    command = ['vue-cli-service', 'build', '--target', 'lib', '--no-clean', '--filename']

    def add_arguments(self, parser):
        parser.add_argument('action', choices=['build', 'serve'])
        parser.add_argument('-n', type=str)

    def handle(self, *args, **options):
        action = options['action']

        if action == 'build':
            pg_name = options['n']
            if pg_name:
                self.build_vue_file(pg_name)
            else:
                shutil.rmtree(os.path.join(settings.BASE_DIR, "dist"))
                for pg_name in os.listdir(os.path.join(settings.BASE_DIR, f'src/components/')):
                    self.build_vue_file(pg_name.replace('.vue', ''))

                self.stdout.write(self.style.SUCCESS('Successfully build'))

        if action == 'serve':
            pg_name = options['n']
            if not pg_name:
                return
            self.serve_vue_file(pg_name)

    def build_vue_file(self, pg_name):
        kebab_case_name = self.pascal2kebab(pg_name)
        subprocess.run([*self.command, kebab_case_name, os.path.join(settings.BASE_DIR, f'src/components/{pg_name}.vue')])

    def serve_vue_file(self, pg_name):
        self.command.insert(2, '--watch')
        self.build_vue_file(pg_name)

    def pascal2kebab(self, text):
        """
        Convert text from Pascal case to Kebab case
        Example: OneTwoThree -> one-tow-three
        """
        return ''.join(f'-{char.lower()}' if char.isupper() else char for char in text)[1:]
