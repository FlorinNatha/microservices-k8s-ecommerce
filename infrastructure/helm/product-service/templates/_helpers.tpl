{{- define "product-service.labels" -}}
app.kubernetes.io/name: product-service
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
