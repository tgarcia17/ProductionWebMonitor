# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-02 17:04
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webmonitor', '0007_machinegroup_mamchinegroupalias'),
    ]

    operations = [
        migrations.RenameField(
            model_name='machinegroup',
            old_name='mamchineGroupAlias',
            new_name='machineGroupAlias',
        ),
    ]
