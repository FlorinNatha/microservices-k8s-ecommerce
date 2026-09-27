{{- define "payment-service.labels" -}}
app.kubernetes.io/name: payment-service
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
