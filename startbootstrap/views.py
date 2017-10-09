from django.http import HttpResponse
from django.template.loader import render_to_string

from webmonitor.models import *
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import resolve

@login_required
def index(request):
    reports = Report.objects.all()
    context = {
        'reports': reports
    }
    return render(request, 'index.html', context)

@login_required
def widget_main(request):
    query = ''
    reportId = request.GET['reportId']
    if reportId == 'none':
        if CustomReport.objects.filter(user__username=request.user.username, name='Last Query').exists():
            query = CustomReport.objects.get(user__username=request.user.username, name='Last Query').id
        else:
            query = 'none'
    else:
        query = reportId
    reports_user = ReportUser.objects.all().get(user__username=request.user.username)
    reports = reports_user.reports.all()
    categoryList = []
    for i in reports:
        categoryAux = i.category
        if categoryAux not in categoryList:
            categoryList.append(categoryAux)

    custom_report_list = CustomReport.objects.filter(user__username=request.user.username)
    company_list = []
    machine_user = MachineUser.objects.all().get(user__username=request.user.username)
    company_list_def = machine_user.machine.all()
    for i in company_list_def:
        company_str = i.machineGroup.plant.site.company.companyId
        find_tmp = False
        for j in company_list:
            if j.machineGroup.plant.site.company.companyId == company_str:
                find_tmp = True
        if find_tmp == False:
            company_list.append(i)
    context = {
        'reports': reports,
        'categoryList': categoryList,
        'custom_report_list': custom_report_list,
        'company_list': company_list,
        'query': query
    }
    return render(request, 'widget_main.html', context)

def render_widget(request):
    reportId = request.GET['reportId']
    print(reportId)
    report = Report.objects.all().get(reportId=reportId)
    html = render_to_string(report.reportBlockName)
    return HttpResponse(html)
    #return render(request, report.reportBlockName)