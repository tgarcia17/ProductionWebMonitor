# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-09 22:58
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webmonitor', '0002_laborday_testfield'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='laborday',
            name='testField',
        ),
    ]