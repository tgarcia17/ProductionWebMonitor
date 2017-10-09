from rest_framework import serializers
from webmonitor.models import Company , Site, Plant, Reason, MachineGroup, Machine, MachineHistoricalEventInterval, MachineHistoricalEvent, MachineDownTimeReasonInterval, MachineDownTimeReason


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = '__all__'

class PlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plant
        fields = '__all__'

class ReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reason
        fields = '__all__'

class MachineGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineGroup
        fields = '__all__'

class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = '__all__'

class MachineHistoricalEventIntervalSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineHistoricalEventInterval
        fields = '__all__'

class MachineHistoricalEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineHistoricalEvent
        fields = '__all__'

class MachineDownTimeReasonIntervalSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineDownTimeReasonInterval
        fields = '__all__'

class MachineDownTimeReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineDownTimeReason
        fields = '__all__'
