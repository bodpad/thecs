# Generated by Django 3.0.6 on 2020-06-03 14:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('algorithms', '0005_auto_20200602_0708'),
    ]

    operations = [
        migrations.AddField(
            model_name='algorithm',
            name='realization',
            field=models.TextField(blank=True, null=True),
        ),
    ]
