# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-09-27 14:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webmonitor', '0003_auto_20170926_2141'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customreport',
            name='horaFinal',
            field=models.TimeField(blank=True, default='23:59', null=True),
        ),
        migrations.AlterField(
            model_name='customreport',
            name='horaInicial',
            field=models.TimeField(blank=True, default='00:01', null=True),
        ),
    ]
