{{- define "canary-app.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "canary-app.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- include "canary-app.name" . }}
{{- end }}
{{- end }}

{{- define "canary-app.labels" -}}
app.kubernetes.io/name: {{ include "canary-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "canary-app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "canary-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
