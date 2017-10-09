from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^index/$', views.index, name='index'),
    url(r'^dashboard$', views.widget_main, name='dashboard'),
    url(r'^widgets/render-widget$', views.render_widget, name='render_widget'),
]
