# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-09 23:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webmonitor', '0004_usertempdata'),
    ]

    operations = [
        migrations.CreateModel(
            name='MachineClass',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('machineClassId', models.CharField(max_length=10)),
                ('machineClassDescr', models.CharField(max_length=30)),
                ('machines', models.ManyToManyField(to='webmonitor.Machine')),
            ],
        ),
    ]