import math
from django.views.generic import CreateView, DetailView, ListView
from webmonitor.models import Company , MachineHistorialEventsRollOutRequest, Site, Plant, Reason, MachineGroup, Machine
from restapi.serializer import CompanySerializer , SiteSerializer, PlantSerializer, ReasonSerializer, MachineGroupSerializer, MachineSerializer
from rest_framework import generics
import requests
import json
import time
import random
import datetime

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class CompanyList(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class CompanyDetail(generics.RetrieveUpdateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class CompanyListByParam(generics.ListCreateAPIView):
    serializer_class = CompanySerializer

    def get_queryset(self):

        queryset = Company.objects.all()
        company_id = self.request.query_params.get('companyId', None)
        if company_id is not None:
            queryset = queryset.filter(companyId=company_id)
        return queryset

class FacilityExtendedPost(APIView):
    def post(self, request, format=None):
        jsonText = json.dumps(request.data)
        dicst = json.loads(jsonText)
        queryset = Company.objects.all()
        queryset = queryset.filter(companyId=dicst['companyId'])
        if queryset.count() == 1:
            facility = Site(company=queryset[0], siteId=dicst['facilityId'], siteDescr=dicst['facilityDescr'])
            facility.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class FacilityList(generics.ListCreateAPIView):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer

class FacilityDetail(generics.RetrieveUpdateAPIView):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer

class FacilityListByParam(generics.ListCreateAPIView):
    serializer_class = SiteSerializer

    def get_queryset(self):

        queryset = Site.objects.all()
        company_id = self.request.query_params.get('companyId', None)
        facility_id = self.request.query_params.get('facilityId', None)
        if (company_id is not None) and (facility_id is not None):
            queryset = queryset.filter(company__companyId=company_id, siteId=facility_id)
        return queryset

class PlantExtendedPost(APIView):
    def post(self, request, format=None):
        jsonText = json.dumps(request.data)
        dicst = json.loads(jsonText)
        queryset = Site.objects.all()
        queryset = queryset.filter(company__companyId=dicst['companyId'], siteId=dicst['facilityId'])
        if queryset.count() == 1:
            plant = Plant(site=queryset[0], plantId=dicst['plantId'], plantDescr=dicst['plantDescr'], endPointUrl=dicst['url'])
            plant.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class PlantList(generics.ListCreateAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer

class PlantDetail(generics.RetrieveUpdateAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer

class PlantListByParam(generics.ListCreateAPIView):
    serializer_class = PlantSerializer

    def get_queryset(self):
        queryset = Plant.objects.all()
        company_id = self.request.query_params.get('companyId', None)
        facility_id = self.request.query_params.get('facilityId', None)
        plant_id = self.request.query_params.get('plantId', None)
        if (company_id is not None) and (facility_id is not None) and (plant_id is not None):
            queryset = queryset.filter(site__company__companyId=company_id, site__siteId=facility_id, plantId = plant_id)
        return queryset

class ReasonList(generics.ListCreateAPIView):
    queryset = Reason.objects.all()
    serializer_class = ReasonSerializer

class ReasonDetail(generics.RetrieveUpdateAPIView):
    queryset = Reason.objects.all()
    serializer_class = ReasonSerializer

class ReasonListByParam(generics.ListCreateAPIView):
    serializer_class = ReasonSerializer

    def get_queryset(self):
        queryset = Reason.objects.all()
        company_id = self.request.query_params.get('companyId', None)
        facility_id = self.request.query_params.get('facilityId', None)
        plant_id = self.request.query_params.get('plantId', None)
        if (company_id is not None) and (facility_id is not None) and (plant_id is not None):
            queryset = queryset.filter(site__company__companyId=company_id, site__siteId=facility_id, plantId=plant_id)
        return queryset


class MachineGroupExtendedPost(APIView):
    def post(self, request, format=None):
        jsonText = json.dumps(request.data)
        dicst = json.loads(jsonText)
        queryset = Plant.objects.all()
        queryset = queryset.filter(site__company__companyId=dicst['companyId'], site__siteId=dicst['facilityId'], plantId=dicst['plantId'])
        if queryset.count() == 1:
            machineGrp = MachineGroup(plant=queryset[0], machineGroupId=dicst['machineGroupId'], machineGroupDescr=dicst['machineGroupDescr'])
            machineGrp.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class MachineGroupList(generics.ListCreateAPIView):
    queryset = MachineGroup.objects.all()
    serializer_class = MachineGroupSerializer

class MachineGroupDetail(generics.RetrieveUpdateAPIView):
    queryset = MachineGroup.objects.all()
    serializer_class = MachineGroupSerializer

class MachineGroupListByParam(generics.ListCreateAPIView):
    serializer_class = MachineGroupSerializer

    def get_queryset(self):
        queryset = MachineGroup.objects.all()
        company_id = self.request.query_params.get('companyId', None)
        facility_id = self.request.query_params.get('facilityId', None)
        plant_id = self.request.query_params.get('plantId', None)
        group_id = self.request.query_params.get('machineGroupId', None)
        if (company_id is not None) and (facility_id is not None) and (plant_id is not None) and (group_id is not None):
            queryset = queryset.filter(plant__site__company__companyId=company_id, plant__site__siteId=facility_id, plant__plantId = plant_id, machineGroupId = group_id)
        return queryset


class MachineExtendedPost(APIView):
    def post(self, request, format=None):
        jsonText = json.dumps(request.data)
        dicst = json.loads(jsonText)
        queryset = MachineGroup.objects.all()
        queryset = queryset.filter(plant__site__company__companyId=dicst['companyId'], plant__site__siteId=dicst['facilityId'], plant__plantId=dicst['plantId'], machineGroupId=dicst['machineGroupId'])
        if queryset.count() == 1:
            machine = Machine(machineGroup=queryset[0], machineId=dicst['machineId'], machineDescr=dicst['machineDescr'])
            machine.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class MachineList(generics.ListCreateAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer

class MachineDetail(generics.RetrieveUpdateAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer

class MachineListByParam(generics.ListCreateAPIView):
    serializer_class = MachineSerializer

    def get_queryset(self):
        queryset = Machine.objects.all()
        company_id = self.request.query_params.get('companyId', None)
        facility_id = self.request.query_params.get('facilityId', None)
        plant_id = self.request.query_params.get('plantId', None)
        group_id = self.request.query_params.get('machineGroupId', None)
        machine_id = self.request.query_params.get('machineId', None)
        if (company_id is not None) and (facility_id is not None) and (plant_id is not None) and (group_id is not None) and (machine_id is not None):
            queryset = queryset.filter(machineGroup__plant__site__company__companyId=company_id, machineGroup__plant__site__siteId=facility_id, machineGroup__plant__plantId = plant_id, machineGroup__machineGroupId = group_id, machineId = machine_id)
        return queryset


class RequestListView(ListView):
    model = MachineHistorialEventsRollOutRequest
    template_name = 'restapi/list.html'
    context_object_name = 'requests'

class RequestDetailView(DetailView):
    model = MachineHistorialEventsRollOutRequest
    template_name = 'restapi/request_edit.html'
    context_object_name = 'request'

class RequestCreateView(CreateView):
    template_name = 'restapi/request_create.html'
    model = MachineHistorialEventsRollOutRequest
    fields = ['fromDate','toDate','plantId']

"""Recibe como parámetro un objeto response en json y retorna un arreglo de objetos Django"""
def DownTimeReasonsDataConvertConsol(requestDataSource):
    jsonResponse = json.loads(requestDataSource)
    label = []
    default = []
    durat = []
    """Estraer los datos de resultado del objeto response en un objeto tipo list"""
    resultDataSource = jsonResponse
    """Recorre el objeto tipo lista y asigna sus valores en un array de objetos Django"""
    for i in resultDataSource:
        machine = i.pop('machine')
        downTimeReason = i.pop('reason')
        downTimeReasonDescr = i.pop('reasonDescr')
        ocurrences = i.pop('ocurrences')
        duration = (i.pop('durationMinutes'))
        label.append(downTimeReason[0] + ' ' + downTimeReasonDescr[0])
        default.append(ocurrences[0])
        durat.append(duration[0])
    return label, default, durat

def MachineVariableStatusDataConvertConsol(requestDataSource):
    jsonResponse = json.loads(requestDataSource)
    variables = []
    """Estraer los datos de resultado del objeto response en un objeto tipo list"""
    resultDataSource = jsonResponse
    """Recorre el objeto tipo lista y asigna sus valores en un array de objetos Django"""
    for i in resultDataSource:
        row = []
        row.append(i['attr']['name'])
        row.append(i['value'])
        variables.append(row)
    return variables

def ProductionMachineRollupDataConvertConsol(requestDataSource):
    jsonResponse = json.loads(requestDataSource)
    date = []
    value = []
    """Estraer los datos de resultado del objeto response en un objeto tipo list"""
    resultDataSource = jsonResponse
    """Recorre el objeto tipo lista y asigna sus valores en un array de objetos Django"""
    for i in resultDataSource:
        fecha = i.pop('dttmStamp')
        valor = i.pop('variableValue')
        date.append(fecha[0])
        value.append(valor[0])
    return date, value


def OEEDataConvertConsol(requestDataSource):
    jsonResponse = json.loads(requestDataSource)
    date = []
    valuePerformance = []
    valueAvailability = []
    valueOEE = []
    append = 0
    """Estraer los datos de resultado del objeto response en un objeto tipo list"""
    resultDataSource = jsonResponse
    """Recorre el objeto tipo lista y asigna sus valores en un array de objetos Django"""
    for i in resultDataSource:
        fecha = i.pop('end_dttm')
        valor1 = i.pop('productive_time')
        valor2 = i.pop('available_time')
        if valor1[0] > 0:
            valorAval = (valor2[0] / valor1[0]) * 100
        else:
            valorAval = random.randint(60,100)
        valor1 = i.pop('qty_sched_to_produce')
        valor2 = i.pop('qty_produced')
        if valor1[0] > 0:
            valorPer = (valor2[0] / valor1[0]) * 100
        else:
            valorPer = random.randint(60,100)
        valorOee = i.pop('oee')
        date.append(fecha[0][11:16])
        valueAvailability.append(valorAval)
        valuePerformance.append(valorPer)
        if valorOee[0] > 0:
            valueOEE.append(valorOee[0])
        else:
            valueOEE.append(random.randint(60, 100))

    return date, valuePerformance, valueAvailability, valueOEE

def OEEDataConvertConsol2(requestDataSource):
    jsonResponse = json.loads(requestDataSource)
    date = []
    valuePerformance = []
    valueAvailability = []
    valueOEE = []
    append = 0
    """Estraer los datos de resultado del objeto response en un objeto tipo list"""
    resultDataSource = jsonResponse
    """Recorre el objeto tipo lista y asigna sus valores en un array de objetos Django"""
    for i in resultDataSource:
        fecha = i.pop('end_dttm')
        valor1 = i.pop('productive_time')
        valor2 = i.pop('available_time')
        if valor1 > 0:
            valorAval = (valor2 / valor1) * 100
        else:
            valorAval = random.randint(60,100)
        valor1 = i.pop('qty_sched_to_produce')
        valor2 = i.pop('qty_produced')
        if valor1 > 0:
            valorPer = (valor2 / valor1) * 100
        else:
            valorPer = random.randint(60,100)
        valorOee = i.pop('oee')
        date.append(fecha[0][11:16])
        valueAvailability.append(valorAval)
        valuePerformance.append(valorPer)
        if valorOee > 0:
            valueOEE.append(valorOee)
        else:
            valueOEE.append(random.randint(60, 100))

    return date, valuePerformance, valueAvailability, valueOEE

"""Recibe como parámetro un objeto response en json y retorna un arreglo de objetos Django"""
def StatusRollupDataConvertConsol(requestDataSource):
    jsonResponse = json.loads(requestDataSource)
    label = []
    duration = []
    """Estraer los datos de resultado del objeto response en un objeto tipo list"""
    resultDataSource = jsonResponse
    """Recorre el objeto tipo lista y asigna sus valores en un array de objetos Django"""
    for i in resultDataSource:
        machine = i.pop('machine')
        status = i.pop('status')
        startDttm = i.pop('startDttm')
        endDttm = i.pop('endDttm')
        reason = i.pop('reason')
        startsDT = startDttm[0].replace('T', ' ')
        endDT = endDttm[0].replace('T', ' ')
        startsDT = startsDT.split('.')[0]
        arrayAux = startsDT.split(':')
        if len(arrayAux) == 2:
            startsDT = startsDT + ':00'
        endDT = endDT.split('.')[0]
        arrayAux = endDT.split(':')
        if len(arrayAux) == 2:
            endDT = endDT + ':00'
        hms = str(datetime.datetime.strptime(endDT, '%Y-%m-%d %H:%M:%S') - datetime.datetime.strptime(startsDT, '%Y-%m-%d %H:%M:%S'))
        h, m, s = hms.split(':')
        difTot = (int(h)*60)+int(m)+(int(s)/60)
        label.append(status[0])
        duration.append(difTot)
    return label, duration


def AppendPointStatus(dates, status, currentStatPos, date):
    dates.append(date)
    i = 0
    while i < len(status):
        if i == currentStatPos:
            status[i].append(100)
        else:
            status[i].append(0)
        i = i + 1

def AppendStatusMachine(dates, status, stat, start, end):
    find = False
    if len(dates) == 0:
        status[0][0] = stat
        AppendPointStatus(dates, status, 0, start)
        AppendPointStatus(dates, status, 0, end)
    else:
        #se recorren todos los estados
        i = 0
        while i < len(status) and find == False:
            #si se encuentra el estado se pregunta si el anterior era el mismo estado o si hay cambio de estado
            if stat == status[i][0]:
                find = True
                j = len(status[i])
                # se pregunta si la posición anterior del arreglo del estado actual es 100 (no hay camhio de estado)
                if status[i][j-2] == 100:
                    AppendPointStatus(dates, status, i, end)
                else:
                    #cambio de estado
                    AppendPointStatus(dates, status, i, start)
                    AppendPointStatus(dates, status, i, end)
            i = i + 1
        if find == False:
            #busco el primer none disponible
            i = 0
            while status[i][0] != 'none':
                i = i + 1
            status[i][0] = stat
            # cambio de estado
            AppendPointStatus(dates, status, i, start)
            AppendPointStatus(dates, status, i, end)

def MachineStatusDataRefine(resultDataSource):
    data = []
    first = True
    for i in resultDataSource:
        row = []
        stat = i.pop('status')
        startDttm = i.pop('startDttm')
        endDttm = i.pop('endDttm')
        startsDT = startDttm[0].replace('T', ' ')
        startsDT = startsDT.split('.')[0]
        arrayAux = startsDT.split(':')
        if len(arrayAux) == 2:
            startsDT = startsDT + ':00'
        endDT = endDttm[0].replace('T', ' ')
        endDT = endDT.split('.')[0]
        arrayAux = endDT.split(':')
        if len(arrayAux) == 2:
            endDT = endDT + ':00'
        d1 = datetime.datetime.strptime(startsDT, '%Y-%m-%d %H:%M:%S')
        d2 = datetime.datetime.strptime(endDT, '%Y-%m-%d %H:%M:%S')
        startsDT = startsDT[5:7] + '/' + startsDT[8:10] + '/' + startsDT[0:4] + ' ' + startsDT[11:13] + ':' + startsDT[14:16] + ':' + startsDT[17:19]
        endDT = endDT[5:7] + '/' + endDT[8:10] + '/' + endDT[0:4] + ' ' + endDT[11:13] + ':' + endDT[14:16] + ':' + endDT[17:19]
        if first:
            row.append(stat[0])
            row.append(startsDT)
            row.append(endDT)
            data.append(row)
            first = False
            last = stat[0]
        else:
            if stat[0] == last:
                data[len(data) - 1][2] = endDT
                last = stat[0]
            else:
                row.append(stat[0])
                row.append(startsDT)
                row.append(endDT)
                data.append(row)
                last = stat[0]
    print(data)
    return data

def MachineStatusDataConvertConsol(requestDataSource):
    jsonResponse = json.loads(requestDataSource)
    dates = []
    state1 = ['none']
    state2 = ['none']
    state3 = ['none']
    state4 = ['none']
    state5 = ['none']
    status = [state1, state2, state3, state4, state5]
    first = True
    """Estraer los datos de resultado del objeto response en un objeto tipo list"""
    resultDataSource = jsonResponse
    """Recorre el objeto tipo lista y asigna sus valores en un array de objetos Django"""
    data = MachineStatusDataRefine(resultDataSource)
    i = 0
    while i < len(data):
        AppendStatusMachine(dates, status, data[i][0], data[i][1], data[i][2])
        i = i + 1

    return dates, status

def getMachineCurrentStatus(company_id, location_id, plant_id, group_id, machine_id ):

    enddt_id = datetime.datetime.now()
    startdt_id = (datetime.datetime.now()-datetime.timedelta(minutes=10))
    enddt_id_str = enddt_id.strftime( '%Y-%m-%d %H:%M:%S.%f')
    startdt_id_str = startdt_id.strftime( '%Y-%m-%d %H:%M:%S.%f')

    data = {"company": company_id,
            "location": location_id,
            "plant": plant_id,
            "machineGroup": group_id,
            "machineId": machine_id,
            "startDttm": startdt_id_str,
            "endDttm": enddt_id_str}

    # Convierte request a json
    jsonText = json.dumps(data)
    # EndPoint del servicio
    plantAux = Plant.objects.get(plantId=plant_id, site__siteId = location_id, site__company__companyId = company_id)
    url = plantAux.endPointUrl
    urlget = url + 'State'
    # Envía request
    response = requests.get(urlget, data=jsonText)

    jsonResponse = json.loads(response.text)
    resultDataSource = jsonResponse

    statAux = 'UnScheduleDown'
    for i in resultDataSource:
        try:
            stat = i.pop('status')
            statAux = stat[0]
        except Exception as e:
            statAux = 'UnScheduleDown'
    return statAux

class DownTimeReasonsFOGRequest(APIView):

    def get(self, request, format=None):

        company_id = self.request.query_params.get('company', None)
        location_id = self.request.query_params.get('location', None)
        plant_id = self.request.query_params.get('plant', None)
        group_id = self.request.query_params.get('machineGroup', None)
        machine_id = self.request.query_params.get('machineId', None)
        startdt_id = self.request.query_params.get('startDttm', None)
        enddt_id = self.request.query_params.get('endDttm', None)

        startdt_id = startdt_id.replace('T',' ') + ':00.000'
        enddt_id = enddt_id.replace('T',' ') + ':59.000'

        data = {"company": company_id,
                "location": location_id,
                "plant": plant_id,
                "machineGroup": group_id,
                "machineId": machine_id,
                "startDttm": startdt_id,
                "endDttm": enddt_id}

        # Convierte request a json
        jsonText = json.dumps(data)
        # EndPoint del servicio
        plantAux = Plant.objects.get(plantId = plant_id, site__siteId = location_id, site__company__companyId = company_id)
        url = plantAux.endPointUrl
        #url = 'http://172.35.5.117:8111/iotserver/'
        urlget = url + 'DownTimeReason'
        # Envía request
        response = requests.get(urlget, data=jsonText)

        labels, ocurrences, duration = DownTimeReasonsDataConvertConsol(response.text)
        data = {
            "labels": labels,
            "ocurrences": ocurrences,
            "duration": duration
        }
        return Response(data)


class MachineVariableStatusFOGRequest(APIView):

    def get(self, request, format=None):

        company_id = self.request.query_params.get('company', None)
        location_id = self.request.query_params.get('location', None)
        plant_id = self.request.query_params.get('plant', None)
        group_id = self.request.query_params.get('machineGroup', None)
        machine_id = self.request.query_params.get('machineId', None)

        data = {"company": company_id,
                "location": location_id,
                "plant": plant_id,
                "machineGroup": group_id,
                "machineId": machine_id}

        # Convierte request a json
        jsonText = json.dumps(data)
        # EndPoint del servicio
        plantAux = Plant.objects.get(plantId = plant_id, site__siteId = location_id, site__company__companyId = company_id)
        url = plantAux.endPointUrl
        #url = 'http://172.35.5.117:8111/iotserver/'
        urlget = url + 'Status'
        # Envía request
        response = requests.get(urlget, data=jsonText)

        variables = MachineVariableStatusDataConvertConsol(response.text)
        data = {
            "variables": variables
        }
        return Response(data)

class ProductionMachineRollupFOGRequest(APIView):
    def get(self, request, format=None):
            company_id = self.request.query_params.get('company', None)
            location_id = self.request.query_params.get('location', None)
            plant_id = self.request.query_params.get('plant', None)
            group_id = self.request.query_params.get('machineGroup', None)
            machine_id = self.request.query_params.get('machineId', None)
            startdt_id = self.request.query_params.get('startDttm', None)
            enddt_id = self.request.query_params.get('endDttm', None)

            startdt_id = startdt_id.replace('T', ' ') + ':00.000'
            enddt_id = enddt_id.replace('T', ' ') + ':59.000'

            data = {"company": company_id,
                        "location": location_id,
                        "plant": plant_id,
                        "machineGroup": group_id,
                        "machineId": machine_id,
                        "startDttm": startdt_id,
                        "endDttm": enddt_id,
                        "reqInterval": "H"
                    }

            # Convierte request a json
            jsonText = json.dumps(data)
            # EndPoint del servicio
            plantAux = Plant.objects.get(plantId=plant_id, site__siteId=location_id, site__company__companyId=company_id)
            url = plantAux.endPointUrl
            #url = 'http://172.35.5.117:8111/iotserver/'
            urlget = url + 'OverallEquipmentEffectiveness'
            # Envía request
            response = requests.get(urlget, data=jsonText, auth=('iotajover', 'iotajover'))
            date1, valuePer, valueAva, valueOee = OEEDataConvertConsol(response.text)

            data = {
                "dates": date1,
                "valuePer": valuePer,
                "valueAva": valueAva,
                "valueOee": valueOee
            }
            return Response(data)


class MachineKPIFOGRequest(APIView):
    def get(self, request, format=None):
            company_id = self.request.query_params.get('company', None)
            location_id = self.request.query_params.get('location', None)
            plant_id = self.request.query_params.get('plant', None)
            group_id = self.request.query_params.get('machineGroup', None)
            machine_id = self.request.query_params.get('machineId', None)
            startdt_id = self.request.query_params.get('startDttm', None)
            enddt_id = self.request.query_params.get('endDttm', None)
            interval_id = self.request.query_params.get('reqInterval', None)

            startDttm = startdt_id
            startdt_id = startdt_id.replace('T', ' ') + ':00.000'
            enddt_id = enddt_id.replace('T', ' ') + ':59.000'

            data = {"company": company_id,
                    "location": location_id,
                    "plant": plant_id,
                    "machineGroup": group_id,
                    "machineId": machine_id,
                    "startDttm": startdt_id,
                    "endDttm": enddt_id,
                    "reqInterval": interval_id
                    }
            # Convierte request a json
            jsonText = json.dumps(data)
            # EndPoint del servicio
            plantAux = Plant.objects.get(plantId=plant_id, site__siteId=location_id, site__company__companyId=company_id)
            url = plantAux.endPointUrl
            urlget = url + 'OverallEquipmentEffectiveness'
            # Envía request
            if interval_id == 'W':
                datResponse = {"list": [
                                {
                                  "available_time": 2592000,
                                  "qty_defective": 0,
                                  "start_dttm": "2017-08-28 00:00:00.000",
                                  "productive_time": 0,
                                  "qty_sched_to_produce": 0,
                                  "oee": 0,
                                  "end_dttm": "2017-09-03 23:59:59.999",
                                  "qty_produced": 0
                               },
                                  {
                                  "available_time": 2678400,
                                  "qty_defective": 0,
                                  "start_dttm": "2017-09-04 00:00:00.000",
                                  "productive_time": 931216,
                                  "qty_sched_to_produce": 0,
                                  "oee": 34.76762246117085,
                                  "end_dttm": "2017-09-10 23:59:59.999",
                                  "qty_produced": 0
                               }
                            ]}
                response = json.dumps(datResponse.get('list'))
                #response = json.loads(datResponse2)
                date1, valuePer, valueAva, valueOee = OEEDataConvertConsol2(response)
            else:
                response = requests.get(urlget, data=jsonText, auth=('iotajover', 'iotajover'))
                date1, valuePer, valueAva, valueOee = OEEDataConvertConsol(response.text)
            data = {
                "dates": date1,
                "valuePer": valuePer,
                "valueAva": valueAva,
                "valueOee": valueOee,
                "machineId": machine_id,
                "startDttm": startDttm
            }
            return Response(data)


class JobSummaryFOGRequest(APIView):
    def get(self, request, format=None):

        company_id = self.request.query_params.get('company', None)
        location_id = self.request.query_params.get('location', None)
        plant_id = self.request.query_params.get('plant', None)
        group_id = self.request.query_params.get('machineGroup', None)
        machine_id = self.request.query_params.get('machineId', None)
        startdt_id = self.request.query_params.get('startDttm', None)
        enddt_id = self.request.query_params.get('endDttm', None)

        startdt_id = startdt_id.replace('T', ' ') + ':00.000'
        enddt_id = enddt_id.replace('T', ' ') + ':59.000'

        data = {"company": company_id,
                "location": location_id,
                "plant": plant_id,
                "machineGroup": group_id,
                "machineId": machine_id,
                "startDttm": startdt_id,
                "endDttm": enddt_id}

        # Convierte request a json
        jsonText = json.dumps(data)
        # EndPoint del servicio
        plantAux = Plant.objects.get(plantId = plant_id, site__siteId = location_id, site__company__companyId = company_id)
        url = plantAux.endPointUrl
        urlget = url + 'JobSummary'
        # Envía request
        #response = requests.get(urlget, data=jsonText)
        dataMock = {"list":
            [
                {"productionId": "id1",
                 "productionDescr": "Descripción ID1",
                 "itemId": "it1",
                 "startDttm": "2017-09-20 00:00:00.000",
                 "endDttm": "2017-09-20 04:00:00.000",
                 "duration": 300,
                 "availability": 88.5,
                 "performance": 91.3,
                 "oee": 0,
                 "expected": 430,
                 "actual": 0
                 },
                {"productionId": "id1",
                 "productionDescr": "Descripción ID1",
                 "itemId": "it1",
                 "startDttm": "2017-09-20 00:00:00.000",
                 "endDttm": "2017-09-20 04:00:00.000",
                 "duration": 490,
                 "availability": 95.5,
                 "performance": 81.4,
                 "oee": 79.3,
                 "expected": 430,
                 "actual": 314.25
                 },
                {"productionId": "id1",
                 "productionDescr": "Descripción ID1",
                 "itemId": "it1",
                 "startDttm": "2017-09-20 00:00:00.000",
                 "endDttm": "2017-09-20 04:00:00.000",
                 "duration": 514,
                 "availability": 74.7,
                 "performance": 76.15,
                 "oee": 99.1,
                 "expected": 430,
                 "actual": 256.12
                 },
                {"productionId": "id1",
                 "productionDescr": "Descripción ID1",
                 "itemId": "it1",
                 "startDttm": "2017-09-20 00:00:00.000",
                 "endDttm": "2017-09-20 04:00:00.000",
                 "duration": 3985,
                 "availability": 74.7,
                 "ility": 60.5,
                 "performance": 91.7,
                 "oee": 0,
                 "expected": 430,
                 "actual": 0
                 },
                {"productionId": "id1",
                 "productionDescr": "Descripción ID1",
                 "itemId": "it1",
                 "startDttm": "2017-09-20 00:00:00.000",
                 "endDttm": "2017-09-20 04:00:00.000",
                 "duration": 789,
                 "availability": 79.5,
                 "performance": 83.3,
                 "oee": 0,
                 "expected": 430,
                 "actual": 856
                 },
            ]
        }
        #jsonResponse = json.loads(response.text)
        jsonResponseAux = json.dumps(dataMock.get('list'))
        jsonResponse = json.loads(jsonResponseAux)
        resultDataSource = jsonResponse
        prodId, prodDescr, itemId, fechaInit, fechaFin, durations, availabilities, performance, oee, expected, actual = JobSummaryDataConvert(resultDataSource)
        data = {
            "prodId": prodId,
            "prodDescr": prodDescr,
            "itemId": itemId,
            "fechaInit": fechaInit,
            "fechaFin": fechaFin,
            "durations": durations,
            "availabilities": availabilities,
            "performance": performance,
            "oee": oee,
            "expected": expected,
            "actual": actual,
            "machineId": machine_id
        }
        return Response(data)


def JobSummaryDataConvert(resultDataSource):
    prodId = []
    prodDescr = []
    itmId = []
    fechaInit = []
    fechaFin = []
    durations = []
    availabilities = []
    performances = []
    oees = []
    expecteds = []
    actuals = []
    """Recorre el objeto tipo lista y asigna sus valores en un array de objetos Django"""
    for i in resultDataSource:
        productionId = i.pop('productionId')
        productionDescr = i.pop('productionDescr')
        itemId = i.pop('itemId')
        duration = i.pop('duration')
        availability = i.pop('availability')
        performance = i.pop('performance')
        oee = i.pop('oee')
        expected = i.pop('expected')
        actual = i.pop('actual')
        startDttm = i.pop('startDttm')
        endDttm = i.pop('endDttm')

        prodId.append(productionId)
        prodDescr.append(productionDescr)
        itmId.append(itemId)
        fechaInit.append(startDttm)
        fechaFin.append(endDttm)
        durations.append(duration)
        availabilities.append(availability)
        performances.append(performance)
        oees.append(oee)
        expecteds.append(expected)
        actuals.append(actual)
    return prodId, prodDescr, itmId, fechaInit, fechaFin, durations, availabilities, performances, oees, expecteds, actuals


class ProductionSummaryFOGRequest(APIView):
    def get(self, request, format=None):

        company_id = self.request.query_params.get('company', None)
        location_id = self.request.query_params.get('location', None)
        plant_id = self.request.query_params.get('plant', None)
        group_id = self.request.query_params.get('machineGroup', None)
        machine_id = self.request.query_params.get('machineId', None)
        startdt_id = self.request.query_params.get('startDttm', None)
        enddt_id = self.request.query_params.get('endDttm', None)

        startdt_id = startdt_id.replace('T', ' ') + ':00.000'
        enddt_id = enddt_id.replace('T', ' ') + ':59.000'

        data = {"company": company_id,
                "location": location_id,
                "plant": plant_id,
                "machineGroup": group_id,
                "machineId": machine_id,
                "startDttm": startdt_id,
                "endDttm": enddt_id}

        # Convierte request a json
        jsonText = json.dumps(data)
        # EndPoint del servicio
        plantAux = Plant.objects.get(plantId = plant_id, site__siteId = location_id, site__company__companyId = company_id)
        url = plantAux.endPointUrl
        urlget = url + 'ProductionSummary'
        # Envía request
        #response = requests.get(urlget, data=jsonText)
        dataMock = {"list":
            [
                      {
                      "shift_id": "sid1",
                      "shift_descr": "Shift 1",
                      "total": 4150,
                      "available_time": 2592000,
                      "start_dttm": "2017-06-01 00:00:00.000",
                      "productive_time": 0,
                      "qty_sched_to_produce": 0,
                      "oee": 0,
                      "end_dttm": "2017-06-30 23:59:59.999",
                      "qty_produced": 0
                   },
                      {
                      "shift_id": "sid2",
                      "shift_descr": "Shift 2",
                      "total": 4532,
                      "available_time": 2678400,
                      "start_dttm": "2017-07-01 00:00:00.000",
                      "productive_time": 931216,
                      "qty_sched_to_produce": 0,
                      "oee": 34.76762246117085,
                      "end_dttm": "2017-07-31 23:59:59.999",
                      "qty_produced": 0
                   },
                      {
                      "shift_id": "sid3",
                      "shift_descr": "Shift 3",
                      "total": 5784,
                      "available_time": 2678400,
                      "start_dttm": "2017-08-01 00:00:00.000",
                      "productive_time": 445762,
                      "qty_sched_to_produce": 25116,
                      "oee": 20.08554967636368,
                      "end_dttm": "2017-08-31 23:59:59.999",
                      "qty_produced": 30311.4414
                   },
                      {
                      "shift_id": "sid4",
                      "shift_descr": "Shift 4",
                      "total": 9652,
                      "available_time": 2592000,
                      "start_dttm": "2017-09-01 00:00:00.000",
                      "productive_time": 296123,
                      "qty_sched_to_produce": 8184,
                      "oee": 123.92104198856941,
                      "end_dttm": "2017-09-30 23:59:59.999",
                      "qty_produced": 88771.495
                   },
            ]
        }
        #jsonResponse = json.loads(response.text)
        jsonResponseAux = json.dumps(dataMock.get('list'))
        jsonResponse = json.loads(jsonResponseAux)
        resultDataSource = jsonResponse
        shift, total, avpercent, avuptime, perpercent, peractrate, perexprate, oees = ProductionSummaryDataConvert(resultDataSource)
        shift.append('Total')
        tot = 0
        for i in total:
            tot = tot + i
        total.append(tot)

        totavpercent = 0
        count = 0
        for j in avpercent:
            count = count + 1
            totavpercent = totavpercent + j
        totavpercent = totavpercent / count
        avpercent.append(totavpercent)

        totavuptime = 0
        for k in avuptime:
            totavuptime = totavuptime + k
        avuptime.append(totavuptime)

        totperpercent = 0
        count = 0
        for l in perpercent:
            count = count + 1
            totperpercent = totperpercent + l
        totperpercent = totperpercent / count
        perpercent.append(totperpercent)

        totperactrate = 0
        count = 0
        for m in peractrate:
            count = count + 1
            totperactrate = totperactrate + m
        totperactrate = totperactrate / count
        peractrate.append(totperactrate)

        totperexp = 0
        count = 0
        for n in perexprate:
            count =  count + 1
            totperexp = totperexp + n
        totperexp = totperexp / count
        perexprate.append(totperexp)

        totoee = 0
        count = 0
        for o in oees:
            count = count + 1
            totoee = totoee + o
        totoee = totoee / count
        oees.append(totoee)

        data = {
            "shift": shift,
            "total": total,
            "avpercent": avpercent,
            "avuptime": avuptime,
            "perpercent": perpercent,
            "peractrate": peractrate,
            "perexprate": perexprate,
            "oee": oees,
        }
        return Response(data)


def ProductionSummaryDataConvert(resultDataSource):
    shift = []
    total = []
    avpercent = []
    avuptime = []
    perpercent = []
    peractrate = []
    perexprate = []
    oees = []
    """Recorre el objeto tipo lista y asigna sus valores en un array de objetos Django"""
    for i in resultDataSource:
        shift_descr = i.pop('shift_descr')
        tot = i.pop('total')
        aval_time = i.pop('available_time')
        prod_time = i.pop('productive_time')
        qty_to_produce = i.pop('qty_sched_to_produce')
        oee = i.pop('oee')
        produced_qty = i.pop('qty_produced')
        start_date = i.pop('start_dttm')
        end_date = i.pop('end_dttm')

        if prod_time > 0:
            valorAval = (aval_time / prod_time) * 100
            uptime = aval_time - prod_time
        else:
            valorAval = random.randint(60, 100)
            uptime = random.randint(60, 100)
        if qty_to_produce > 0:
            valorPer = (produced_qty / qty_to_produce) * 100
        else:
            valorPer = random.randint(60, 100)
        if oee > 0:
            oees.append(oee)
        else:
            oees.append(random.randint(60, 100))
        shift.append(shift_descr)
        total.append(tot)
        avpercent.append(valorAval)
        perpercent.append(valorPer)
        peractrate.append(produced_qty)
        perexprate.append(qty_to_produce)
        avuptime.append(uptime)
    return shift, total, avpercent, avuptime, perpercent, peractrate, perexprate, oees


class VariableTrendFOGRequest(APIView):

    def get(self, request, format=None):

        company_id = self.request.query_params.get('company', None)
        location_id = self.request.query_params.get('location', None)
        plant_id = self.request.query_params.get('plant', None)
        group_id = self.request.query_params.get('machineGroup', None)
        machine_id = self.request.query_params.get('machineId', None)
        startdt_id = self.request.query_params.get('startDttm', None)
        enddt_id = self.request.query_params.get('endDttm', None)
        variable_id = self.request.query_params.get('variable', None)

        startdt_id = startdt_id.replace('T', ' ') + ':00.000'
        enddt_id = enddt_id.replace('T', ' ') + ':59.000'

        data = {"company": company_id,
                "location": location_id,
                "plant": plant_id,
                "machineGroup": group_id,
                "machineId": machine_id,
                "startDttm": startdt_id,
                "endDttm": enddt_id,
                "variable": variable_id}

        jsonText = json.dumps(data)
        # EndPoint del servicio
        plantAux = Plant.objects.get(plantId = plant_id, site__siteId = location_id, site__company__companyId = company_id)
        url = plantAux.endPointUrl
        #url = 'http://172.35.5.117:8111/iotserver/'
        urlget = url + 'Trend'
        response = requests.get(urlget, data=jsonText, auth=('iotajover', 'iotajover'))


        date, value = ProductionMachineRollupDataConvertConsol(response.text)
        data = {
                "date": date,
                "variable": value,
            }
        return Response(data)

class StatusRollupFOGRequest(APIView):

    def get(self, request, format=None):

        company_id = self.request.query_params.get('company', None)
        location_id = self.request.query_params.get('location', None)
        plant_id = self.request.query_params.get('plant', None)
        group_id = self.request.query_params.get('machineGroup', None)
        machine_id = self.request.query_params.get('machineId', None)
        startdt_id = self.request.query_params.get('startDttm', None)
        enddt_id = self.request.query_params.get('endDttm', None)

        startdt_id = startdt_id.replace('T', ' ') + ':00.000'
        enddt_id = enddt_id.replace('T', ' ') + ':59.000'

        data = {"company": company_id,
                "location": location_id,
                "plant": plant_id,
                "machineGroup": group_id,
                "machineId": machine_id,
                "startDttm": startdt_id,
                "endDttm": enddt_id}

        # Convierte request a json
        jsonText = json.dumps(data)
        # EndPoint del servicio
        plantAux = Plant.objects.get(plantId = plant_id, site__siteId = location_id, site__company__companyId = company_id)
        url = plantAux.endPointUrl
        #url = 'http://172.35.5.117:8111/iotserver/'
        urlget = url + 'State'
        # Envía request
        response = requests.get(urlget, data=jsonText)

        labels, durations = StatusRollupDataConvertConsol(response.text)
        data = {
            "labels": labels,
            "durations":durations,
        }
        return Response(data)

class MachineStatusFOGRequest(APIView):

    def get(self, request, format=None):

        company_id = self.request.query_params.get('company', None)
        location_id = self.request.query_params.get('location', None)
        plant_id = self.request.query_params.get('plant', None)
        group_id = self.request.query_params.get('machineGroup', None)
        machine_id = self.request.query_params.get('machineId', None)
        startdt_id = self.request.query_params.get('startDttm', None)
        enddt_id = self.request.query_params.get('endDttm', None)

        startdt_id = startdt_id.replace('T', ' ') + ':00.000'
        enddt_id = enddt_id.replace('T', ' ') + ':59.000'

        data = {"company": company_id,
                "location": location_id,
                "plant": plant_id,
                "machineGroup": group_id,
                "machineId": machine_id,
                "startDttm": startdt_id,
                "endDttm": enddt_id}


        # Convierte request a json
        jsonText = json.dumps(data)
        # EndPoint del servicio
        plantAux = Plant.objects.get(plantId = plant_id, site__siteId = location_id, site__company__companyId = company_id)
        url = plantAux.endPointUrl
        #url = 'http://172.35.5.117:8111/iotserver/'
        urlget = url + 'State'
        # Envía request
        response = requests.get(urlget, data=jsonText)

        dates, status = MachineStatusDataConvertConsol(response.text)
        data = {
            "dates": dates,
            "status":status,
        }
        return Response(data)

def JobOEEAppendStatusData(status, per, startDt, endDt, id):
    #tooltip
    status[4].append(id)
    status[4].append(id)
    #dates
    status[5].append(startDt)
    status[5].append(endDt)
    #rank id performance
    if per <= 40:
        dataIndex = 0
    elif per > 40 and per <=60:
        dataIndex = 1
    elif per > 60 and per <= 80:
        dataIndex = 2
    else:
        dataIndex = 3
    i = 0
    while i < len(status) - 2:
        if i == dataIndex:
            status[i].append(100)
            status[i].append(100)
        else:
            status[i].append(0)
            status[i].append(0)
        i = i + 1
    #mark de id change
    status[4].append(id)
    status[5].append(endDt)
    i = 0
    while i < len(status) - 2:
        status[i].append(0)
        i = i + 1

def JobOEEScatterDataConvertConsol(resultDataSource):
    print(resultDataSource)
    dates = []
    #<40%
    data1 = []
    #40-60
    data2 = []
    #60-80
    data3 = []
    #>80%
    data4 = []
    tooltips = []
    status = [data1, data2, data3, data4, tooltips, dates]
    first = True
    """Recorre el objeto tipo lista y asigna sus valores en un array de objetos Django"""
    for i in resultDataSource:
        per = i.pop('performance')
        id = i.pop('productionId')
        startDttm = i.pop('startDttm')
        endDttm = i.pop('endDttm')
        """startsDT = startDttm[0].replace('T', ' ')
        startsDT = startsDT.split('.')[0]
        arrayAux = startsDT.split(':')
        if len(arrayAux) == 2:
            startsDT = startsDT + ':00'
        endDT = endDttm[0].replace('T', ' ')
        endDT = endDT.split('.')[0]
        arrayAux = endDT.split(':')
        if len(arrayAux) == 2:
            endDT = endDT + ':00'
        startsDT = startsDT[5:7] + '/' + startsDT[8:10] + '/' + startsDT[0:4] + ' ' + startsDT[11:13] + ':' + startsDT[14:16] + ':' + startsDT[17:19]
        endDT = endDT[5:7] + '/' + endDT[8:10] + '/' + endDT[0:4] + ' ' + endDT[11:13] + ':' + endDT[14:16] + ':' + endDT[17:19]"""
        startsDT = startDttm
        endDT = endDttm
        JobOEEAppendStatusData(status, per, startsDT, endDT, id)

    return status

class JobOEEScatterFOGRequest(APIView):

    def get(self, request, format=None):

        company_id = self.request.query_params.get('company', None)
        location_id = self.request.query_params.get('location', None)
        plant_id = self.request.query_params.get('plant', None)
        group_id = self.request.query_params.get('machineGroup', None)
        machine_id = self.request.query_params.get('machineId', None)
        startdt_id = self.request.query_params.get('startDttm', None)
        enddt_id = self.request.query_params.get('endDttm', None)

        startdt_id = startdt_id.replace('T', ' ') + ':00.000'
        enddt_id = enddt_id.replace('T', ' ') + ':59.000'

        data = {"company": company_id,
                "location": location_id,
                "plant": plant_id,
                "machineGroup": group_id,
                "machineId": machine_id,
                "startDttm": startdt_id,
                "endDttm": enddt_id}


        # Convierte request a json
        jsonText = json.dumps(data)
        # EndPoint del servicio
        #plantAux = Plant.objects.get(plantId = plant_id, site__siteId = location_id, site__company__companyId = company_id)
        #url = plantAux.endPointUrl
        #urlget = url + 'State'
        # Envía request
        #response = requests.get(urlget, data=jsonText)
        #print('1.JobOEEScatterFOGRequest')
        dataMock = {"list":
            [
                {"performance": 30,
                 "productionId": "id1",
                 "startDttm": "2017-09-20 00:00:00.000",
                 "endDttm": "2017-09-20 04:00:00.000"
                 },
                {"performance": 35,
                 "productionId": "id2",
                 "startDttm": "2017-09-20 04:00:00.000",
                 "endDttm": "2017-09-20 07:00:00.000"
                 },
                {"performance": 98,
                 "productionId": "id3",
                 "startDttm": "2017-09-20 07:00:00.000",
                 "endDttm": "2017-09-20 11:00:00.000"
                 },
                {"performance": 65,
                 "productionId": "id4",
                 "startDttm": "2017-09-20 11:00:00.000",
                 "endDttm": "2017-09-20 13:00:00.000"
                 },
                {"performance": 47,
                 "productionId": "id5",
                 "startDttm": "2017-09-20 13:00:00.000",
                 "endDttm": "2017-09-20 20:00:00.000"
                 }
            ]
        }
       #dataMock = {"list": [{"performance": 30, "productionId": "id1", "startDttm": "2017-09-20 00:00:00.000", "endDttm": "2017-09-20 04:00:00.000"}]}
        # jsonResponse = json.loads(response.text)
        jsonResponseAux = json.dumps(dataMock.get('list'))
        jsonResponse = json.loads(jsonResponseAux)
        resultDataSource = jsonResponse
        status = JobOEEScatterDataConvertConsol(resultDataSource)
        print(status)
        data = {
            "status": status,
        }
        return Response(data)
