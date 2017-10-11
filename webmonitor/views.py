from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.core import serializers


import collections

from webmonitor.models import Company as Company1
from webmonitor.models import MachineUser
from webmonitor.models import Report
from webmonitor.models import CustomReport
from webmonitor.models import CustomReportMachine
from webmonitor.models import CustomReportVariable
from webmonitor.models import CustomReportWidget

from restapi.views import *


def login(request):
    return render(request, 'registration/login.html')


@login_required
def index(request):
    latestPlants = Plant.objects.order_by('-plantDescr')[:5]
    numberOfCompanies = Company.objects.all().count()
    numberOfSites = Site.objects.all().count()
    numberOfPlants = Plant.objects.all().count()
    numberOfMachineGroups = MachineGroup.objects.all().count()
    numberOfMachines = Machine.objects.all().count()

    context = {
        'latestPlants': latestPlants,
        'numberOfCompanies': numberOfCompanies,
        'numberOfSites': numberOfSites,
        'numberOfPlants': numberOfPlants,
        'numberOfMachineGroups': numberOfMachineGroups,
        'numberOfMachines': numberOfMachines,
    }
    return render(request, 'AjProdMonitorApp/index.html', context)


@login_required
def detail(request, plantId):
    plant = Plant.objects.get(plantId=plantId)
    context = {
        'plant': plant,
    }
    return render(request, 'AjProdMonitorApp/detail.html', context)


@login_required
@csrf_exempt
def create_custom_report(request):
    if request.method == 'POST':

        # get form data
        custom_report_name = request.POST.get('custom_report_name')
        the_machines_str = request.POST.getlist('cbx_machine[]')
        the_variables_str = request.POST.getlist('cbx_variables[]')
        the_widgets_str = request.POST.getlist('cbx_widgets[]')
        dateFrom = request.POST.get('dateFrom')
        dateTo = request.POST.get('dateTo')
        startNumDays = request.POST.get('startNumDays')
        endNumDays = request.POST.get('endNumDays')
        minFlag = request.POST.get('minFlag')
        maxFlag = request.POST.get('maxFlag')
        avgFlag = request.POST.get('avgFlag')
        trendFlag = request.POST.get('trendFlag')
        today = request.POST.get('today')
        lastWeek = request.POST.get('lastWeek')
        thisWeek = request.POST.get('thisWeek')
        lastMonth = request.POST.get('lastMonth')
        thisMonth = request.POST.get('thisMonth')
        widgetSize = request.POST.get('widgetSize')
        monitorFlag = request.POST.get('monitorFlag')
        timeFrom = request.POST.get('timeFrom')
        timeTo = request.POST.get('timeTo')
        hour = request.POST.get('hour')
        day = request.POST.get('day')
        week = request.POST.get('week')
        month = request.POST.get('month')

        if timeFrom == "":
            timeFrom = '00:01'
        if timeTo == "":
            timeTo = '23:59'

        # retrieve report instance
        the_report_user = User.objects.get(username=request.user.username)

        if today == 'Y' or lastWeek == 'Y' or thisWeek == 'Y' or lastMonth == 'Y' or thisMonth == 'Y':
            fechaInicialFija = 'N'
            fechaFinalFija = 'N'
        else:
            if startNumDays.isnumeric():
                fechaInicialFija = 'N'
            else:
                fechaInicialFija = 'Y'

            if endNumDays.isnumeric():
                fechaFinalFija = 'N'
            else:
                fechaFinalFija = 'Y'

        CustomReport.objects.filter(name=custom_report_name, user=the_report_user).delete()

        new_custom_report = CustomReport(user=the_report_user,
                                         name=custom_report_name, minFlag=minFlag, maxFlag=maxFlag, avgFlag=avgFlag, trendFlag=trendFlag,
                                         fechaInicialFijaFlag=fechaInicialFija, fechaFinalFijaFlag=fechaFinalFija, fechaInicial=dateFrom,
                                         fechaFinal=dateTo, diasComputablesFechaFinal=endNumDays, diasComputablesFechaInicial=startNumDays,
                                         fechaActual=today, semanaAnterior=lastWeek, semanaActual=thisWeek, mesAnterior=lastMonth, mesActual=thisMonth,
                                         widgetSize=widgetSize, monitorFlag=monitorFlag, horaInicial=timeFrom, horaFinal=timeTo, hour=hour, day=day, week=week, month=month)
        new_custom_report.save()

        array_length = len(the_widgets_str)
        for i in range(array_length):
            report = Report.objects.get(reportId=the_widgets_str[i]);
            new_custom_report_widget = CustomReportWidget(customReport=new_custom_report,
                                                              report=report)
            new_custom_report_widget.save()

        array_length = len(the_variables_str)
        for i in range(array_length):
            new_custom_report_variable = CustomReportVariable(customReport=new_custom_report, variable=the_variables_str[i])
            new_custom_report_variable.save()

        array_length = len(the_machines_str)
        print('the_machines_str_length: ' + str(array_length))
        for i in range(array_length):
            the_class = the_machines_str[i]
            the_keys = the_class.split(".")
            the_machine = Machine.objects.get(machineGroup__plant__site__company__companyId=the_keys[0],
                                              machineGroup__plant__site__siteId=the_keys[1],
                                              machineGroup__plant__plantId=the_keys[2],
                                              machineGroup__machineGroupId=the_keys[3],
                                              machineId=the_keys[4])
            new_custom_report_machine = CustomReportMachine(customReport=new_custom_report, machine=the_machine)
            new_custom_report_machine.save()

        # if create_form.is_valid():
        response_data = {}
        response_data['result'] = 'Custom report created!'
        response_data['report_id'] = new_custom_report.id.hex
        response_data['report_name'] = new_custom_report.name

        return HttpResponse(json.dumps(response_data), content_type="application/json")
    else:
        return HttpResponse(json.dumps({"nothing to see": "oh!"}, content_type="application/json"))


@login_required
def json_plant_reasons(request, company_id, site_id, plant_id):
    the_plant = Plant.objects.get(plantId=plant_id, site__siteId=site_id, site__company__companyId=company_id)
    reasons_list = Reason.objects.filter(plant=the_plant)

    resp = []
    for i in reasons_list:
        resp2 = collections.OrderedDict()
        resp2["reasonId"] = str(i.reasonId)
        resp2["reasonDescr"] = str(i.reasonDescr)
        resp.append(resp2)

    response = json.dumps(resp)
    return HttpResponse(response)

### REPORTS ###
@login_required
# @user_passes_test(lambda u: has_perm_machine_status(u))
def report_machine_status(request):
    context = {
        'template_name_machine_status': 'machine_status_template.html'
    }
    return render(request, 'AjProdMonitorApp/reports/machine_status.html', context)


@login_required
# @user_passes_test(lambda u: has_perm_downtime_reasons(u))
def report_downtime_reasons(request):
    context = {
        'template_name_downtime_reasons': 'downtime_reasons_template.html'
    }
    return render(request, 'AjProdMonitorApp/reports/downtime_reasons.html', context)


@login_required
# @user_passes_test(lambda u: has_perm_production_rollup(u))
def report_production_rollup(request):
    context = {
        'template_name_production_rollup': 'production_rollup_template.html'
    }
    return render(request, 'AjProdMonitorApp/reports/production_rollup.html', context)


@login_required
# @user_passes_test(lambda u: has_perm_status_rollup(u))
def report_status_rollup(request):
    context = {
        'template_name_status_rollup': 'status_rollup_template.html'
    }
    return render(request, 'AjProdMonitorApp/reports/status_rollup.html', context)


@login_required
# @user_passes_test(lambda u: has_perm_var_trend_rollup(u))
def report_variable_trend_rollup(request):
    context = {
        'template_name_variable_trend_rollup': 'variable_trend_rollup_template.html'
    }
    return render(request, 'AjProdMonitorApp/reports/variable_trend_rollup.html', context)


@login_required
# @user_passes_test(lambda u: has_perm_production_rollup(u))
def report_dashboard(request):
    templates = []
    templates.append('machine_status_template.html')
    templates.append('production_rollup_template.html')
    templates.append('downtime_reasons_template.html')
    templates.append('variable_trend_rollup_template.html')
    templates.append('status_rollup_template.html')
    context = {
        'template_dashboard0': templates[0],
        'template_dashboard1': templates[1],
        'template_dashboard2': templates[2],
        'template_dashboard3': templates[3],
        'template_dashboard4': templates[4],
    }
    return render(request, 'AjProdMonitorApp/reports/dashboard.html', context)


### PERMISSIONS BY REPORT ###
def has_perm_machine_status(user):
    return user.has_perm('ProductionMonitor.view_report_machine_status')


def has_perm_downtime_reasons(user):
    return user.has_perm('ProductionMonitor.view_report_downtime_reasons')


def has_perm_production_rollup(user):
    return user.has_perm('ProductionMonitor.view_report_production_rollup')


def has_perm_status_rollup(user):
    return user.has_perm('ProductionMonitor.view_report_status_rollup')


def has_perm_var_trend_rollup(user):
    return user.has_perm('ProductionMonitor.view_report_var_trend_rollup')


### JSON FILTERS ###
@login_required
def json_sites(request, company_id):
    # current_company = Company.objects.get(companyId=company_id)
    try:
        current_company = Company1.objects.get(companyId=company_id)
    except Company1.DoesNotExist:
        current_company = None
    machine_user = MachineUser.objects.get(user__username=request.user.username)
    uSite = machine_user.machine.all().filter(machineGroup__plant__site__company__companyId=company_id)

    sitesArray = []
    for i in uSite:
        company_str = i.machineGroup.plant.site.company.companyId
        site_str = i.machineGroup.plant.site.siteId
        find_tmp = False
        for j in sitesArray:
            if j.company.companyId == company_str and j.siteId == site_str:
                find_tmp = True
        if find_tmp == False:
            sitesArray.append(i.machineGroup.plant.site)

    json_sites_list = serializers.serialize("json", sitesArray)
    return HttpResponse(json_sites_list)


@login_required
def json_plants(request, company_id, site_id):
    machine_user = MachineUser.objects.get(user__username=request.user.username)
    uPlant = machine_user.machine.all().filter(machineGroup__plant__site__company__companyId=company_id,
                                              machineGroup__plant__site__siteId=site_id)
    plantsArray = []

    for i in uPlant:
        company_str = i.machineGroup.plant.site.company.companyId
        site_str = i.machineGroup.plant.site.siteId
        plant_str = i.machineGroup.plant.plantId
        find_tmp = False
        for j in plantsArray:
            if j.site.company.companyId == company_str and j.site.siteId == site_str and j.plantId == plant_str:
                find_tmp = True
        if find_tmp == False:
            plantsArray.append(i.machineGroup.plant)

    resp = []
    for i in plantsArray:
        resp2 = collections.OrderedDict()
        resp2["plantId"] = str(i.plantId)
        if i.plantAlias:
            resp2["plantDescr"] = str(i.plantAlias)
        else:
            resp2["plantDescr"] = str(i.planDescr)
        resp.append(resp2)
    response = json.dumps(resp)
    return HttpResponse(response)

@login_required
def json_machine_groups(request, company_id, site_id, plant_id):
    machine_user = MachineUser.objects.get(user__username=request.user.username)
    uGroup = machine_user.machine.all().filter(machineGroup__plant__site__company__companyId=company_id,
                                              machineGroup__plant__site__siteId=site_id,
                                              machineGroup__plant__plantId=plant_id)

    groupsArray = []

    for i in uGroup:
        company_str = i.machineGroup.plant.site.company.companyId
        site_str = i.machineGroup.plant.site.siteId
        plant_str = i.machineGroup.plant.plantId
        group_str = i.machineGroup.machineGroupId
        find_tmp = False
        for j in groupsArray:
            if j.plant.site.company.companyId == company_str and j.plant.site.siteId == site_str and j.plant.plantId == plant_str and j.machineGroupId == group_str:
                find_tmp = True
        if find_tmp == False:
            groupsArray.append(i.machineGroup)

    resp = []
    for i in groupsArray:
        resp2 = collections.OrderedDict()
        resp2["machineGroupId"] = str(i.machineGroupId)
        if i.machineGroupAlias:
            resp2["machineGroupDescr"] = str(i.machineGroupAlias)
        else:
            resp2["machineGroupDescr"] = str(i.machineGroupDescr)
        resp.append(resp2)
    response = json.dumps(resp)
    return HttpResponse(response)

@login_required
def json_machines(request, company_id, site_id, plant_id, machine_group_id):
    machine_user = MachineUser.objects.get(user__username=request.user.username)
    uMachine = machine_user.machine.all().filter(machineGroup__plant__site__company__companyId=company_id,
                                                machineGroup__plant__site__siteId=site_id,
                                                machineGroup__plant__plantId=plant_id,
                                                machineGroup__machineGroupId=machine_group_id)
    machinesArray = []

    for i in uMachine:
        company_str = i.machineGroup.plant.site.company.companyId
        site_str = i.machineGroup.plant.site.siteId
        plant_str = i.machineGroup.plant.plantId
        group_str = i.machineGroup.machineGroupId
        machine_str = i.machineId
        find_tmp = False
        for j in machinesArray:
            if j.machineGroup.plant.site.company.companyId == company_str and j.machineGroup.plant.site.siteId == site_str and j.machineGroup.plant.plantId == plant_str and j.machineGroup.machineGroupId == group_str and j.machineId == machine_str:
                find_tmp = True
        if find_tmp == False:
            machinesArray.append(i)

    resp = []
    for i in machinesArray:
        resp2 = collections.OrderedDict()
        resp2["machineId"] = str(i.machineId)
        if i.machineAlias:
            resp2["machineDescr"] = str(i.machineAlias)
        else:
            resp2["machineDescr"] = str(i.machineDescr)
        resp.append(resp2)
    response = json.dumps(resp)
    return HttpResponse(response)


@login_required
def json_company_filter(request, id):
    current_custom_report = CustomReport.objects.get(user__username=request.user.username, id=id)
    fixedDateFrom = current_custom_report.fechaInicialFijaFlag
    dateFrom = current_custom_report.fechaInicial.strftime('%Y-%m-%d')
    numStartDate = current_custom_report.diasComputablesFechaInicial
    fixedDateTo = current_custom_report.fechaFinalFijaFlag
    dateTo = current_custom_report.fechaFinal.strftime('%Y-%m-%d')
    numEndtDate = current_custom_report.diasComputablesFechaFinal
    minFlag = current_custom_report.minFlag
    maxFlag = current_custom_report.maxFlag
    avgFlag = current_custom_report.avgFlag
    trendFlag = current_custom_report.trendFlag
    today = current_custom_report.fechaActual
    lastWeek = current_custom_report.semanaAnterior
    currentWeek = current_custom_report.semanaActual
    lastMonth = current_custom_report.mesAnterior
    currentMonth = current_custom_report.mesActual
    widgetSize = current_custom_report.widgetSize
    monitorFlag = current_custom_report.monitorFlag
    horaFinal = current_custom_report.horaFinal.strftime('%H:%M')
    horaInicial = current_custom_report.horaInicial.strftime('%H:%M')
    hour = current_custom_report.hour
    day = current_custom_report.day
    week = current_custom_report.week
    month = current_custom_report.month

    company_filter = current_custom_report.customreportmachine_set.all()

    the_response = []

    for c in company_filter:
        one_row = collections.OrderedDict()
        one_row['company'] = c.machine.machineGroup.plant.site.company.companyId
        one_row['site'] = c.machine.machineGroup.plant.site.siteId
        one_row['plant'] = c.machine.machineGroup.plant.plantId
        one_row['machine_group'] = c.machine.machineGroup.machineGroupId
        one_row['machine'] = c.machine.machineId
        the_response.append(one_row)

    report_variables = []
    variable_query_set = CustomReportVariable.objects.all()
    variable_query_set.filter(customReport=current_custom_report)
    for i in variable_query_set:
        report_variables.append(i.variable)

    report_widgets = []
    widget_query_set = CustomReportWidget.objects.filter(customReport=current_custom_report)
    #widget_query_set.filter(customReport=current_custom_report)
    for i in widget_query_set:
        report_widgets.append(i.report.reportId)

    data = {
        "fixedDateFrom": fixedDateFrom,
        "dateFrom": dateFrom,
        "numStartDate": numStartDate,
        "fixedDateTo": fixedDateTo,
        "dateTo": dateTo,
        "numEndtDate": numEndtDate,
        "minFlag": minFlag,
        "maxFlag": maxFlag,
        "avgFlag": avgFlag,
        "trendFlag": trendFlag,
        "today": today,
        "lastWeek": lastWeek,
        "currentWeek": currentWeek,
        "lastMonth": lastMonth,
        "currentMonth": currentMonth,
        "widgetSize": widgetSize,
        "reportMachines": the_response,
        "variables": report_variables,
        "widgets": report_widgets,
        "monitorFlag": monitorFlag,
        "horaFinal": horaFinal,
        "horaInicial": horaInicial,
        "hour": hour,
        "day": day,
        "week": week,
        "month": month
    }

    json_company_filter = json.dumps(data)
    return HttpResponse(json_company_filter)


@login_required
def json_model_tree_view(request):
    machine_user = MachineUser.objects.get(user__username=request.user.username)
    uMachine = machine_user.machine.all().order_by('machineGroup__plant__site__company__companyId', 'machineGroup__plant__site__siteId', 'machineGroup__plant__plantId', 'machineGroup__machineGroupId', 'machineId')

    tree_data = {}
    tree_data[0] = []
    last_company = ''
    last_site = ''
    last_plant = ''
    last_group = ''

    for i in uMachine:
        if i.machineAlias:
            machine_str = i.machineAlias
        else:
            machine_str = i.machineId
        machine_id = i.machineId
        if i.machineGroup.machineGroupAlias:
            group_str = i.machineGroup.machineGroupAlias
        else:
            group_str = i.machineGroup.machineGroupId
        group_id = i.machineGroup.machineGroupId
        if i.machineGroup.plant.plantAlias:
            plant_str = i.machineGroup.plant.plantAlias
        else:
            plant_str = i.machineGroup.plant.plantId
        plant_id = i.machineGroup.plant.plantId
        site_str = i.machineGroup.plant.site.siteId
        site_descr = i.machineGroup.plant.site.siteDescr
        site_descr = site_descr[:25]
        company_str = i.machineGroup.plant.site.company.companyId
        company_descr = i.machineGroup.plant.site.company.companyDescr
        new_site = True
        new_plant = True
        new_group = True

        data = {"company": company_str,
                "location": site_str,
                "plant": plant_str,
                "machineGroup": group_str,
                "machineId": machine_str}

        # Convierte request a json
        jsonText = json.dumps(data)
        # EndPoint del servicio
        plantAux = Plant.objects.get(plantId = plant_id, site__siteId = site_str, site__company__companyId = company_str)
        url = plantAux.endPointUrl
        #url = 'http://172.35.5.117:8111/iotserver/'
        urlget = url + 'Status'
        # Envía request
        #response = requests.get(urlget, data=jsonText)
        # aquí leo el estado de la máquina para deterinar el color del icono
        print(machine_str)

        machine_data = collections.OrderedDict()
        machine_data['nodes'] = []
        machine_data['text'] = machine_str
        machine_data['href'] = '#' + machine_str
        machine_data['tags'] = '0'
        machine_data['icon'] = 'red-icon fa fa-cloud-download'
        stat = getMachineCurrentStatus(company_str, site_str, plant_id, group_str, machine_str)

        if stat == 'Operating':
            machine_data['icon'] = 'green-icon fa fa-cloud-download'
        if stat == 'UnScheduleDown':
            machine_data['icon'] = 'red-icon fa fa-cloud-download'
        if stat == 'ScheduleDown':
            machine_data['icon'] = 'blue-icon fa fa-cloud-download'

        queryMachine = CustomReportMachine.objects.filter(machine__machineId=machine_id, machine__machineGroup__machineGroupId=group_id
                                                          , machine__machineGroup__plant__plantId=plant_id, machine__machineGroup__plant__site__siteId=site_str
                                                          , machine__machineGroup__plant__site__company__companyId=company_str, customReport__user__username=request.user.username)
        if queryMachine.count() > 0:
            for i in queryMachine:
                dashboard1 = collections.OrderedDict()
                if len(i.customReport.name) > 20:
                    printNameReport = i.customReport.name[:20]
                else:
                    printNameReport = i.customReport.name
                dashboard1['text'] = printNameReport
                dashboard1['href'] = 'dashboard?reportId='+str(i.customReport.id)
                dashboard1['tags'] = '0'
                machine_data['nodes'].append(dashboard1)

        if company_str != last_company:
            last_company = company_str
            last_site = site_str
            last_plant = plant_str
            last_group = group_str
            new_site = False
            new_plant = False
            new_group = False

            group_data = {}
            group_data['icon'] = 'fa fa-object-group'
            group_data['text'] = group_str
            group_data['href'] = '#' + group_str
            group_data['tags'] = '0'
            group_data['nodes'] = []

            plant_data = {}
            plant_data['icon'] = 'fa fa-industry'
            plant_data['text'] = plant_str
            plant_data['href'] = '#' + plant_str
            plant_data['tags'] = '0'
            plant_data['nodes'] = []
            plant_data['nodes'].append(group_data)

            site_data = {}
            site_data['icon'] = 'fa fa-building'
            site_data['text'] = site_descr
            site_data['href'] = '#' + site_str
            site_data['tags'] = '0'
            site_data['nodes'] = []
            site_data['nodes'].append(plant_data)

            company_data = {}
            company_data['icon'] = 'fa fa-sitemap'
            company_data['text'] = company_descr
            company_data['href'] = '#' + company_str
            company_data['tags'] = '0'
            company_data['nodes'] = []
            company_data['nodes'].append(site_data)

            tree_data[0].append(company_data)

        if site_str != last_site and new_site == True:
            last_site = site_str
            last_plant = plant_str
            last_group = group_str
            new_plant = False
            new_group = False

            group_data = {}
            group_data['icon'] = 'fa fa-object-group'
            group_data['text'] = group_str
            group_data['href'] = '#' + group_str
            group_data['tags'] = '0'
            group_data['nodes'] = []

            plant_data = {}
            plant_data['icon'] = 'fa fa-industry'
            plant_data['text'] = plant_str
            plant_data['href'] = '#' + plant_str
            plant_data['tags'] = '0'
            plant_data['nodes'] = []
            plant_data['nodes'].append(group_data)

            site_data = {}
            site_data['icon'] = 'fa fa-building'
            site_data['text'] = site_descr
            site_data['href'] = '#' + site_str
            site_data['tags'] = '0'
            site_data['nodes'] = []
            site_data['nodes'].append(plant_data)
            company_data['nodes'].append(site_data)

        if plant_str != last_plant and new_plant == True:
            last_plant = plant_str
            last_group = group_str
            new_group = False

            group_data = {}
            group_data['icon'] = 'fa fa-object-group'
            group_data['text'] = group_str
            group_data['href'] = '#' + group_str
            group_data['tags'] = '0'
            group_data['nodes'] = []

            plant_data = {}
            plant_data['icon'] = 'fa fa-industry'
            plant_data['text'] = plant_str
            plant_data['href'] = '#' + plant_str
            plant_data['tags'] = '0'
            plant_data['nodes'] = []
            plant_data['nodes'].append(group_data)
            site_data['nodes'].append(plant_data)

        if group_str != last_group and new_group == True:
            last_group = group_str
            group_data = {}
            group_data['icon'] = 'fa fa-object-group'
            group_data['text'] = group_str
            group_data['href'] = '#' + group_str
            group_data['tags'] = '0'
            group_data['nodes'] = []
            group_data['nodes'].append(machine_data)
            plant_data['nodes'].append(group_data)
        else:
            group_data['nodes'].append(machine_data)

    response = json.dumps(tree_data)
    return HttpResponse(response)


### DEVELOPER ###
@login_required
def bootstrap_grid(request):
    return render(request, 'AjProdMonitorApp/developer/bootstrap_grid.html')


@login_required
def bootstrap_panels(request):
    return render(request, 'AjProdMonitorApp/developer/bootstrap_panels.html')


@login_required
def bootstrap_typography(request):
    return render(request, 'AjProdMonitorApp/developer/bootstrap_typography.html')


@login_required
def bootstrap_tables(request):
    return render(request, 'AjProdMonitorApp/developer/bootstrap_tables.html')


@login_required
def bootstrap_forms(request):
    return render(request, 'AjProdMonitorApp/developer/bootstrap_forms.html')


@login_required
def bootstrap_buttons(request):
    return render(request, 'AjProdMonitorApp/developer/bootstrap_buttons.html')


@login_required
def bootstrap_notifications(request):
    return render(request, 'AjProdMonitorApp/developer/bootstrap_notifications.html')


@login_required
def bootstrap_icons(request):
    return render(request, 'AjProdMonitorApp/developer/bootstrap_icons.html')


@login_required
def bootstrap_chartjs(request):
    return render(request, 'AjProdMonitorApp/developer/bootstrap_chartjs.html')


@login_required
def bootstrap_c3(request):
    return render(request, 'AjProdMonitorApp/developer/bootstrap_c3.html')


class ChartData(APIView):
    def get(self, request, format=None):
        labels = ["Reason 1", "Reason 2", "Reason 3", "Reason 4", "Reason 5"]
        default_months = [100, 220, 5, 500, 120]
        data = {
            "labels": labels,
            "default": default_months,
        }
        return Response(data)
