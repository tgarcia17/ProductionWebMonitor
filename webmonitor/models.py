import math
import uuid

from django.db import models
from django.core.urlresolvers import reverse
from django.utils import timezone
from django.contrib.auth.models import User
from django import forms


def one_day_hence():
    return timezone.now() + timezone.timedelta(days=-1)


class Company(models.Model):
    companyId = models.CharField(max_length=10)
    companyDescr = models.CharField(max_length=30)

    def __str__(self):
        return str(self.companyId) + ' - ' + str(self.companyDescr)


class Site(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    siteId = models.CharField(max_length=10)
    siteDescr = models.CharField(max_length=30)

    def __str__(self):
        return str(self.siteId) + ' - ' + str(self.siteDescr)


class Plant(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE, null=True)
    plantId = models.CharField(max_length=10, null=True)
    plantDescr = models.CharField(max_length=30, null=True)
    endPointUrl = models.URLField(null=True)
    plantAlias = models.CharField(max_length=30, null=True)

    def __str__(self):
        return str(self.site.company.companyDescr) + ' - ' + str(self.site.siteDescr) + ' - ' + str(self.plantId) + ' - ' + str(self.plantDescr) + ' - ' + str(self.plantAlias)


class Reason(models.Model):
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE)
    reasonId = models.CharField(max_length=10)
    reasonDescr = models.CharField(max_length=30)

    def __str__(self):
        return str(self.reasonId) + ' - ' + str(self.reasonDescr)

class Shift(models.Model):
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE)
    shiftId = models.CharField(max_length=10)
    shiftDescr = models.CharField(max_length=30)
    startTime = models.TimeField()
    endTime = models.TimeField()

    def __str__(self):
        return str(self.plant.plantId) + ' - ' + str(self.shiftId) + ' - ' + str(self.shiftDescr)

class MachineGroup(models.Model):
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE)
    machineGroupId = models.CharField(max_length=10)
    machineGroupDescr = models.CharField(max_length=30)
    machineGroupAlias = models.CharField(max_length=30, null=True)

    def __str__(self):
        return str(self.plant.site.company.companyId) + ' - ' + str(self.plant.site.siteId) + ' - ' + str(self.plant.plantId) + ' - ' + str(self.machineGroupId) + ' - ' + str(self.machineGroupDescr) + ' - ' + str(self.machineGroupAlias)


class Machine(models.Model):
    machineGroup = models.ForeignKey(MachineGroup, on_delete=models.CASCADE, null=True)
    machineId = models.CharField(max_length=10, null=True)
    machineDescr = models.CharField(max_length=30, null=True)
    machineAlias = models.CharField(max_length=30, null=True)

    def __str__(self):
        return str(self.machineGroup.plant.site.company.companyId) + ' - ' + str(
            self.machineGroup.plant.site.siteId) + ' - ' + str(self.machineGroup.plant.plantId) + ' - ' + str(
            self.machineGroup.machineGroupId) + ' - ' + str(self.machineId) + ' - ' + str(self.machineDescr) + ' - ' + str(self.machineAlias)

class Calendar(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, null=True)
    year = models.IntegerField()
    month = models.IntegerField()

    def __str__(self):
        return str(self.machine.MacchineId) + ' - ' + str(self.year) + ' - ' + str(self.month)

class LaborDay(models.Model):
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, null=True)
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, null=True)
    date = models.DateField()

    def __str__(self):
        return str(self.calendar.machine.machineId) + ' - ' + str(self.date) + ' - ' + str(self.shift.shiftDescr)

class MachineHistoricalEventInterval(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    fromDate = models.DateField()
    toDate = models.DateField()


class MachineHistoricalEvent(models.Model):
    interval = models.ForeignKey(MachineHistoricalEventInterval, on_delete=models.CASCADE)
    status = models.CharField(max_length=20)
    startDttm = models.DateTimeField()
    endDttm = models.DateTimeField()
    duration = models.FloatField()
    reason = models.CharField(max_length=10)


class MachineDownTimeReasonInterval(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    fromDate = models.DateField()
    toDate = models.DateField()


class MachineDownTimeReason(models.Model):
    interval = models.ForeignKey(MachineHistoricalEventInterval, on_delete=models.CASCADE)
    reason = models.CharField(max_length=10)
    reasonDescr = models.CharField(max_length=30)
    ocurrences = models.IntegerField()
    # Este es el valor absoluto expresado en minutos
    duration = models.FloatField()
    # Esta es la representacion de la duración en el formato dd:hh:mm:ss
    durationFormated = models.CharField(max_length=12)
    # Este es el valor absoluto expresado en minutos
    avgDuration = models.FloatField()
    # Esta es la representacion del promedio de duración en el formato dd:hh:mm:ss
    avgDurationFormated = models.CharField(max_length=12)
    intervalPorcentualValue = models.FloatField()

    def getFormatTime(minutesIn):
        if minutesIn < 1440:
            daysAux = 0
        else:
            fraction, daysAux = math.modf(minutesIn / 1440)

        if minutesIn - (daysAux * 1440) < 60:
            hoursAux = 0
        else:
            fraction, hoursAux = math.modf((minutesIn - (daysAux * 1440)) / 60)

        minutesAux = minutesIn - (daysAux * 1440) - (hoursAux * 60)

        return str(daysAux) + ':' + str(hoursAux) + ':' + str(minutesAux)

    def save(self):
        self.durationFormated = self.getFormatTime(self.duration)
        self.avgDurationFormated = self.getFormatTime(self.avgDuration)
        super(MachineDownTimeReason, self).save()


class MachineHistorialEventsRollOutRequest(models.Model):
    fromDate = models.DateField(default=one_day_hence)
    toDate = models.DateField(default=timezone.now)
    plantId = models.CharField(max_length=10)

    def get_absolute_url(self):
        return reverse('favorite', kwargs={'pk': self.pk})

    def __str__(self):
        return self.plantId


# Reporting models
class UserData(models.Model):
    user = models.ForeignKey(User, editable=False)

    class Meta:
        abstract = True


class ReportCategory(models.Model):
    categoryId = models.CharField(max_length=10)
    categoryDescr = models.CharField(max_length=30)

    def __str__(self):
        return str(self.categoryId) + ' - ' + str(self.categoryDescr)


class Report(models.Model):
    category = models.ForeignKey(ReportCategory, on_delete=models.CASCADE)
    reportId = models.CharField(max_length=10)
    reportDescr = models.CharField(max_length=50)
    reportBlockName = models.CharField(max_length=50)
    reportFunctionName = models.CharField(max_length=50)
    maxDaysWindow = models.IntegerField(default=0)
    uriIcon = models.CharField(max_length=100, blank=True, null=True)
    tooltipDecr = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        permissions = (
            ('view_report_machine_status', 'View report machine status'),
            ('view_report_downtime_reasons', 'View report downtime reasons'),
            ('view_report_production_rollup', 'View report production rollup'),
            ('view_report_status_rollup', 'View report status rollup'),
            ('view_report_var_trend_rollup', 'View report var. trend rollup'),
        )

    def __str__(self):
        return str(self.reportId) + ' - ' + str(self.reportDescr)

class ReportUser(models.Model):
    user = models.ForeignKey(User)
    reports = models.ManyToManyField(Report)

    def __str__(self):
        return str(self.user)

class ReportVariable(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE, null=True)
    variableId = models.CharField(max_length=10, null=True)
    variableDescr = models.CharField(max_length=30, null=True)

    def __str__(self):
        return str(self.variableId) + ' - ' + str(self.variableDescr)

class CustomReport(UserData):
    user = models.ForeignKey(User)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=60)
    minFlag = models.CharField(max_length=1, default='N')
    maxFlag = models.CharField(max_length=1, default='N')
    avgFlag = models.CharField(max_length=1, default='N')
    trendFlag = models.CharField(max_length=1, default='N')
    fechaFinalFijaFlag = models.CharField(max_length=1, default='N')
    fechaFinal = models.DateField(blank=True, null=True)
    horaFinal = models.TimeField(blank=True, null=True, default='23:59')
    diasComputablesFechaFinal = models.CharField(max_length=4, blank=True, null=True)
    fechaInicialFijaFlag = models.CharField(max_length=1, default='N')
    fechaInicial = models.DateField(blank=True, null=True)
    horaInicial = models.TimeField(blank=True, null=True, default='00:01')
    diasComputablesFechaInicial = models.CharField(max_length=4, blank=True, null=True)
    fechaActual = models.CharField(max_length=1, default='N')
    semanaAnterior = models.CharField(max_length=1, default='N')
    semanaActual = models.CharField(max_length=1, default='N')
    mesAnterior = models.CharField(max_length=1, default='N')
    mesActual = models.CharField(max_length=1, default='N')
    widgetSize = models.CharField(max_length=10, blank=True, null=True)
    monitorFlag = models.CharField(max_length=1, default='N', null=True)
    hour = models.CharField(max_length=1, default='N', null=True)
    day = models.CharField(max_length=1, default='N', null=True)
    week = models.CharField(max_length=1, default='N', null=True)
    month = models.CharField(max_length=1, default='N', null=True)

    def __str__(self):
        return str(self.user) + ' - ' + str(self.name)

class CustomReportWidget(models.Model):
    customReport = models.ForeignKey(CustomReport, on_delete=models.CASCADE)
    report = models.ForeignKey(Report, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.report.reportDescr)

class CustomReportVariable(models.Model):
    customReport = models.ForeignKey(CustomReport, on_delete=models.CASCADE)
    #Representa el value del tag HTML
    variable = models.CharField(max_length=30)

    def __str__(self):
        return str(self.variable)


class CustomReportMachine(models.Model):
    customReport = models.ForeignKey(CustomReport, on_delete=models.CASCADE, null=True)
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, null=True)
    #mesActual = models.CharField(max_length=1, default='N')
    def __str__(self):
        return str(self.customReport) + ' - ' + str(self.machine)
        #return str(self.mesActual)

class MachineUser(models.Model):
    user = models.ForeignKey(User)
    machine = models.ManyToManyField(Machine)

    def __str__(self):
        return str(self.user)

class MachineClass(models.Model):
    machineClassId = models.CharField(max_length=10)
    machineClassDescr = models.CharField(max_length=30)
    machines = models.ManyToManyField(Machine)

    def __str__(self):
        return str(self.machineClassId) + ' - ' + str(self.machineClassDescr)