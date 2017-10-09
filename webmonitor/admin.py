from django.contrib import admin
from webmonitor.models import Company
from webmonitor.models import Site
from webmonitor.models import Plant
from webmonitor.models import Reason
from webmonitor.models import MachineHistorialEventsRollOutRequest
from webmonitor.models import MachineGroup
from webmonitor.models import Machine
from webmonitor.models import MachineHistoricalEventInterval
from webmonitor.models import MachineHistoricalEvent
from webmonitor.models import MachineDownTimeReason
from webmonitor.models import MachineDownTimeReasonInterval
from webmonitor.models import ReportCategory
from webmonitor.models import Report
from webmonitor.models import ReportVariable
from webmonitor.models import CustomReport
from webmonitor.models import CustomReportVariable
from webmonitor.models import CustomReportMachine
from webmonitor.models import MachineUser
from webmonitor.models import ReportUser
from webmonitor.models import CustomReportWidget
from webmonitor.models import Shift
from webmonitor.models import Calendar
from webmonitor.models import LaborDay

# Register your models here.
admin.site.register(Company)
admin.site.register(Site)
admin.site.register(Plant)
admin.site.register(Reason)
admin.site.register(MachineGroup)
admin.site.register(Machine)
admin.site.register(MachineHistoricalEventInterval)
admin.site.register(MachineHistoricalEvent)
admin.site.register(MachineDownTimeReasonInterval)
admin.site.register(MachineDownTimeReason)
admin.site.register(MachineHistorialEventsRollOutRequest)
admin.site.register(Shift)
admin.site.register(Calendar)
admin.site.register(LaborDay)

admin.site.register(ReportCategory)
admin.site.register(Report)
admin.site.register(ReportVariable)
admin.site.register(CustomReport)
admin.site.register(CustomReportVariable)
admin.site.register(CustomReportMachine)
admin.site.register(CustomReportWidget)
admin.site.register(MachineUser)
admin.site.register(ReportUser)
