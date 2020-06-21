# Generated by Django 3.0.7 on 2020-06-15 10:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('algorithms', '0017_algorithm_entity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='algorithm',
            name='difficulty',
            field=models.SmallIntegerField(blank=True, choices=[(1, 'Эффективный'), (2, 'Неэффективный')], null=True),
        ),
        migrations.AlterField(
            model_name='algorithm',
            name='entity',
            field=models.SmallIntegerField(choices=[(1, 'Algorithm'), (2, 'Data structure'), (3, 'Data type')], default=1),
        ),
    ]