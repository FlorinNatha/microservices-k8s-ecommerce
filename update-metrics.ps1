$services = @("auth-service", "user-service", "product-service", "order-service", "payment-service")
$ports = @{
    "auth-service" = "5000"
    "user-service" = "5001"
    "product-service" = "5002"
    "order-service" = "5003"
    "payment-service" = "5004"
}

foreach ($svc in $services) {
    Write-Host "==========================="
    Write-Host "Processing $svc..."
    Write-Host "==========================="
    $dir = "services\$svc"
    
    # 1. Install prom-client
    Set-Location $dir
    npm install prom-client
    Set-Location "..\.."

    # 2. Update server.js
    $serverPath = "$dir\src\server.js"
    $content = Get-Content $serverPath -Raw
    if (-not $content.Contains("prom-client")) {
        $inject = @"

// Prometheus Metrics Setup
const client = require('prom-client');
client.collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

"@
        $content = $content.Replace("app.use(express.json());", "app.use(express.json());`n" + $inject)
        Set-Content -Path $serverPath -Value $content -Encoding UTF8
    }

    # 3. Update deployment.yaml
    $deployPath = "$dir\k8s\deployment.yaml"
    $deployContent = Get-Content $deployPath -Raw
    if (-not $deployContent.Contains("prometheus.io/scrape")) {
        $port = $ports[$svc]
        $deployInject = @"
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "$port"
    spec:
"@
        $deployContent = $deployContent.Replace("    spec:", $deployInject)
        $deployContent = $deployContent.Replace("image: ${svc}:latest", "image: ${svc}:v2")
        Set-Content -Path $deployPath -Value $deployContent -Encoding UTF8
    }

    # 4. Build, load and deploy
    Set-Location $dir
    docker build -t "${svc}:v2" .
    Set-Location "..\.."
    cmd.exe /c "docker save ${svc}:v2 | docker exec -i minikube docker load"
    kubectl apply -f $deployPath
    kubectl rollout restart deployment $svc
}
