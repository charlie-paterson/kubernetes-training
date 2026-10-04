{{- define "ha-app.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "ha-app.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- include "ha-app.name" . }}
{{- end }}
{{- end }}

{{- define "ha-app.labels" -}}
app.kubernetes.io/name: {{ include "ha-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "ha-app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "ha-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
