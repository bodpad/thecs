import os
import subprocess
from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = ''
    command = ['vue-cli-service', 'build', '--target', 'lib', '--no-clean', '--filename']

    def add_arguments(self, parser):
        parser.add_argument('action', choices=['build', 'watch'])
        parser.add_argument('-n', type=str)

    def handle(self, *args, **options):
        action = options['action']

        if action == 'build':
            pg_name = options['n']
            if pg_name:
                self.build(pg_name + '.vue')
            else:
                for pg_name in os.listdir( os.path.join(settings.BASE_DIR, f'static/pg/')):
                    self.build(pg_name)

                self.stdout.write(self.style.SUCCESS('Successfully build'))

        if action == 'watch':
            pg_name = options['n']
            if not pg_name:
                return
            self.watch(pg_name + '.vue')

    def build(self, pg_name):
        kebab_case_name = self.pascal2kebab(pg_name.replace('.vue', ''))
        subprocess.run([*self.command, kebab_case_name, os.path.join(settings.BASE_DIR, f'static/pg/{pg_name}')])
        # patterns = [
        #     '.common.js',
        #     '.common.js.map',
        #     '.umd.js',
        #     '.umd.js.map',
        #     '.umd.min.js.map',
        # ]
        # for pattern in patterns:
        #     path = os.path.join(settings.BASE_DIR, 'dist', kebab_case_name + pattern)
        #     os.remove(path)

    def watch(self, pg_name):
        self.command.insert(2, '--watch')
        kebab_case_name = self.pascal2kebab(pg_name.replace('.vue', ''))
        subprocess.run([*self.command, kebab_case_name, os.path.join(settings.BASE_DIR, f'static/pg/{pg_name}')])

    def pascal2kebab(self, text):
        return ''.join(f'-{char.lower()}' if char.isupper() else char for char in text)[1:]
