from django import template
from django.contrib.auth.models import User
from ..models import Company, MachineUser, CustomReport, CustomReportMachine

register = template.Library()


@register.inclusion_tag('my_custom_reports.html', takes_context=True)
def my_custom_reports(context):
    request = context['request']
    return {'custom_report_list': CustomReport.objects.all().filter(user__username=request.user.username)}
