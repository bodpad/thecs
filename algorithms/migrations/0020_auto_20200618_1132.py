# Generated by Django 3.0.7 on 2020-06-18 11:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('algorithms', '0019_algorithm_playground'),
    ]

    operations = [
        migrations.AlterField(
            model_name='algorithm',
            name='playground',
            field=models.CharField(blank=True, choices=[('binary-heap', 'binary-heap')], max_length=255, null=True),
        ),
    ]
