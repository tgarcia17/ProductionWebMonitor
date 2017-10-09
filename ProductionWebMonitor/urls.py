from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth import views as auth_views

#patter url definitions
urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^restapi/', include('restapi.urls')),
    url(r'^webmonitor/', include('webmonitor.urls')),
    url(r'^startbootstrap/', include('startbootstrap.urls')),
    url(r'^accounts/login/$', auth_views.login),
    url(r'^accounts/logout/$', auth_views.logout, {'next_page': '/accounts/login'}),
    url(r'^i18n/', include('django.conf.urls.i18n')),
]
