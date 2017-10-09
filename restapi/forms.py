from django import forms

class MachineStatusForm(forms.Form):
    machineId = forms.CharField(label='Machine ID MS', max_length=10, required = True, widget = forms.TextInput())
    company = forms.CharField(label='Company MS', max_length=10, required = True, widget = forms.TextInput())
    location = forms.CharField(label='Location MS', max_length=10, required = True, widget = forms.TextInput())
    plant = forms.CharField(label='Plant MS', max_length=10, required = True, widget = forms.TextInput())
    response = forms.CharField(label='Response MS', max_length=1000, required = False, widget=forms.Textarea())

class DownTimeReasonsForm(forms.Form):
    machineId = forms.CharField(label='Machine ID DTR', max_length=10, required=True, widget=forms.TextInput())
    company = forms.CharField(label='Company DTR', max_length=10, required=True, widget=forms.TextInput())
    location = forms.CharField(label='Location DTR', max_length=10, required=True, widget=forms.TextInput())
    plant = forms.CharField(label='Plant DTR', max_length=10, required=True, widget=forms.TextInput())

class MachineStatusRollupForm(forms.Form):
    machineId = forms.CharField(label='Machine ID MSR', max_length=10, required=True, widget=forms.TextInput())
    company = forms.CharField(label='Company MSR', max_length=10, required=True, widget=forms.TextInput())
    location = forms.CharField(label='Location MSR', max_length=10, required=True, widget=forms.TextInput())
    plant = forms.CharField(label='Plant MSR', max_length=10, required=True, widget=forms.TextInput())
    startDttm = forms.CharField(label='Start Date MSR', required=True, widget=forms.TextInput())
    endDttm = forms.CharField(label='Start Date MSR', required=True, widget=forms.TextInput())

class VariableTrendRollupForm(forms.Form):
    machineId = forms.CharField(label='Machine ID VTR', max_length=10, required = True, widget = forms.TextInput())
    company = forms.CharField(label='Company VTR', max_length=10, required = True, widget = forms.TextInput())
    location = forms.CharField(label='Location VTR', max_length=10, required = True, widget = forms.TextInput())
    plant = forms.CharField(label='Plant VTR', max_length=10, required = True, widget = forms.TextInput())

class ProductionMachineRollupForm(forms.Form):
    machineId = forms.CharField(label='Machine ID PMR', max_length=10, required = True, widget = forms.TextInput())
    company = forms.CharField(label='Company PMR', max_length=10, required = True, widget = forms.TextInput())
    location = forms.CharField(label='Location PMR', max_length=10, required = True, widget = forms.TextInput())
    plant = forms.CharField(label='Plant PMR', max_length=10, required = True, widget = forms.TextInput())