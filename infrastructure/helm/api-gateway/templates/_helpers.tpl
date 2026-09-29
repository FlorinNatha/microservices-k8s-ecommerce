{{- define "api-gateway.labels" -}}
app.kubernetes.io/name: api-gateway
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
