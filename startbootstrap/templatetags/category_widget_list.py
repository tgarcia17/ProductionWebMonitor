from webmonitor.models import Report
from webmonitor.models import ReportUser

from django import template

register = template.Library()

@register.inclusion_tag('category_widget_list.html', takes_context=True)
def category_widget_list(context, categoryId):
    request = context['request']
    reports_user = ReportUser.objects.get(user__username=request.user.username)
    report_list = reports_user.reports.all().filter(category__categoryId=categoryId)
    return {'report_list': report_list}