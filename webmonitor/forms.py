from django import forms
from webmonitor.models import Report


class CustomReportForm(forms.Form):
    report = forms.ModelChoiceField(queryset=Report.objects.all(), label=u'report')
    customReportDescr = forms.CharField(label='Name or Description', max_length=100)
