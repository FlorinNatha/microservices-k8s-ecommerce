{{- define "infrastructure.labels" -}}
app.kubernetes.io/name: infrastructure
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
