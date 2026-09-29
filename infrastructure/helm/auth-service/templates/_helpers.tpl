{{- define "auth-service.labels" -}}
app.kubernetes.io/name: auth-service
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
