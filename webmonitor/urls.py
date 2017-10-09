from django.conf.urls import url
from . import views
from .views import ChartData

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^plants/(?P<plantId>[\w]+)/$', views.detail, name='detail'),

    # second iteration changes
    url(r'^reports/machine-status/$', views.report_machine_status, name='report-machinestatus'),
    url(r'^reports/downtime-reasons/$', views.report_downtime_reasons, name='report-downtimereasons'),
    url(r'^reports/production-rollup/$', views.report_production_rollup, name='report-productionrollup'),
    url(r'^reports/status-rollup/$', views.report_status_rollup, name='report-statusrollup'),
    url(r'^reports/variable-trend-rollup/$', views.report_variable_trend_rollup, name='report-variabletrendrollup'),
    url(r'^reports/dashboard/$', views.report_dashboard, name='report_dashboard'),

    url(r'^reports/create-custom-report/$', views.create_custom_report, name='create-custom-report'),

    # ajax filters
    url(r'^filters/model-tree-view/$', views.json_model_tree_view, name='json_model_tree_view'),
    url(r'^filters/company/(?P<company_id>[\w]+)/sites/$', views.json_sites, name='json_sites'),
    url(r'^filters/site/(?P<company_id>[\w]+)/(?P<site_id>[\w]+)/plants/$', views.json_plants, name='json_plants'),
    url(r'^filters/plant/(?P<company_id>[\w]+)/(?P<site_id>[\w]+)/(?P<plant_id>[\w]+)/machine_groups/$',
        views.json_machine_groups, name='json_machine_groups'),
    url(
        r'^filters/machine-group/(?P<company_id>[\w]+)/(?P<site_id>[\w]+)/(?P<plant_id>[\w]+)/(?P<machine_group_id>[\w]+)/machines/$',
        views.json_machines, name='json_machines'),

    url(r'^filters/custom/report/(?P<id>[0-9a-f-]+)', views.json_company_filter, name='json_company_filter'),

    # data json api
    url(r'^api/chart/data/$', ChartData.as_view(), name='api-data'),

    # second iteration changes
    url(r'^developer/bootstrap-grid/$', views.bootstrap_grid, name='bootstrap-grid'),
    url(r'^developer/bootstrap-typography/$', views.bootstrap_typography, name='bootstrap-typography'),
    url(r'^developer/bootstrap-panels/$', views.bootstrap_panels, name='bootstrap-panels'),
    url(r'^developer/bootstrap-tables/$', views.bootstrap_tables, name='bootstrap-tables'),
    url(r'^developer/bootstrap-forms/$', views.bootstrap_forms, name='bootstrap-forms'),
    url(r'^developer/bootstrap-buttons/$', views.bootstrap_buttons, name='bootstrap-buttons'),
    url(r'^developer/bootstrap-notifications/$', views.bootstrap_notifications, name='bootstrap-notifications'),
    url(r'^developer/bootstrap-icons/$', views.bootstrap_icons, name='bootstrap-icons'),
    url(r'^developer/bootstrap-chartjs/$', views.bootstrap_chartjs, name='bootstrap-chartjs'),
    url(r'^developer/bootstrap-c3/$', views.bootstrap_c3, name='bootstrap-c3'),

]
