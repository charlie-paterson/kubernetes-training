{{- define "canary-app.name" -}}
{{- .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "canary-app.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "canary-app.name" .) | trunc 63 | trimSuffix "-" }}
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

{{- define "canary-app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "canary-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
