{{- define "order-service.labels" -}}
app.kubernetes.io/name: order-service
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
