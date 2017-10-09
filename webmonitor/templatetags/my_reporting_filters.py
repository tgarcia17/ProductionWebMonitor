from django import template
from ..models import Company, MachineUser, CustomReport
from django.contrib.auth.models import User
from datetime import date, timedelta
register = template.Library()


@register.inclusion_tag('my_reporting_filters.html', takes_context=True)
def my_reporting_filters(context):
    request = context['request']
    uriName = request.get_full_path().split("/")[3]
    company_list = []
    company_list_def = MachineUser.objects.all().filter(user__username=request.user.username)
    for i in company_list_def:
        company_str = i.machine.machineGroup.plant.site.company.companyId
        find_tmp = False
        for j in company_list:
            if j.machine.machineGroup.plant.site.company.companyId == company_str:
                find_tmp = True
        if find_tmp == False:
            company_list.append(i)

    custom_report_list = CustomReport.objects.all().filter(user__username=request.user.username, report__reportURIName=uriName)

    return {'company_list': company_list, 'custom_report_list': custom_report_list, 'fromDate': (date.today() - timedelta(days=1)), 'toDate': date.today()}
