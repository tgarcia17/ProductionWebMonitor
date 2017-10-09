from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from . import views
from restapi.views import DownTimeReasonsFOGRequest, ProductionMachineRollupFOGRequest, VariableTrendFOGRequest, StatusRollupFOGRequest, MachineStatusFOGRequest, MachineVariableStatusFOGRequest, MachineKPIFOGRequest, JobOEEScatterFOGRequest, JobSummaryFOGRequest, ProductionSummaryFOGRequest

urlpatterns = [

    url(r'^company/$', views.CompanyList.as_view()),
    url(r'^company/(?P<pk>[0-9]+)/$', views.CompanyDetail.as_view()),
    url(r'^company$', views.CompanyListByParam.as_view()),
    url(r'^facilityextended/$', views.FacilityExtendedPost.as_view()),
    url(r'^facility/$', views.FacilityList.as_view()),
    url(r'^facility/(?P<pk>[0-9]+)/$', views.FacilityDetail.as_view()),
    url(r'^facility$', views.FacilityListByParam.as_view()),
    url(r'^plantextended/$', views.PlantExtendedPost.as_view()),
    url(r'^plant/$', views.PlantList.as_view()),
    url(r'^plant/(?P<pk>[0-9]+)/$', views.PlantDetail.as_view()),
    url(r'^plant$', views.PlantListByParam.as_view()),
    url(r'^reason/$', views.ReasonList.as_view()),
    url(r'^reason/(?P<pk>[0-9]+)/$', views.ReasonDetail.as_view()),
    url(r'^reason$', views.ReasonListByParam.as_view()),
    url(r'^machinegroupextended/$', views.MachineGroupExtendedPost.as_view()),
    url(r'^machinegroup/$', views.MachineGroupList.as_view()),
    url(r'^machinegroup/(?P<pk>[0-9]+)/$', views.MachineGroupDetail.as_view()),
    url(r'^machinegroup$', views.MachineGroupListByParam.as_view()),
    url(r'^machineextended/$', views.MachineExtendedPost.as_view()),
    url(r'^machine/$', views.MachineList.as_view()),
    url(r'^machine/(?P<pk>[0-9]+)/$', views.MachineDetail.as_view()),
    url(r'^machine$', views.MachineListByParam.as_view()),

    url(r'^list/$', views.RequestListView.as_view(), name = 'list'),
    url(r'^create/$', views.RequestCreateView.as_view(), name = 'create'),
    url(r'^(?P<pk>[-\w]+)/$', views.RequestDetailView.as_view(), name = 'detail'),

    url(r'^Request/DownTimeReasonsRequestFOG$', DownTimeReasonsFOGRequest.as_view(), name='downTimeReasonsRequestFOG'),
    url(r'^Request/ProductionMachineRollupRequestFOG$', ProductionMachineRollupFOGRequest.as_view(), name='productionMachineRollupFOG'),
    url(r'^Request/VariableTrendFOGRequest$', VariableTrendFOGRequest.as_view(), name='variableTrendFOGRequest'),
    url(r'^Request/StatusRollup$', StatusRollupFOGRequest.as_view(), name='statusRollupFOGRequest'),
    url(r'^Request/MachineStatusFOGRequest$', MachineStatusFOGRequest.as_view(), name='machineStatusFOGRequest'),
    url(r'^Request/MachineVariableStatusFOGRequest$', MachineVariableStatusFOGRequest.as_view(), name='machineVariableStatusFOGRequest'),
    url(r'^Request/MachineKPIFOGRequest$', MachineKPIFOGRequest.as_view(), name='machineKPIFOGRequest'),
    url(r'^Request/MachineJobScatterFOGRequest$', JobOEEScatterFOGRequest.as_view(), name='JobOEEScatterFOGRequest'),
    url(r'^Request/JobSummaryFOGRequest$', JobSummaryFOGRequest.as_view(), name='jobSummaryFOGRequest'),
    url(r'^Request/ProductionSummaryFOGRequest$', ProductionSummaryFOGRequest.as_view(), name='productionSummaryFOGRequest'),
]

urlpatterns = format_suffix_patterns(urlpatterns)