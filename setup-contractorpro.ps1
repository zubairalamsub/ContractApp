# ContractorPro Setup Script (PowerShell)
# ========================================

Write-Host "Creating ContractorPro project structure..." -ForegroundColor Cyan

# Create main directory
$projectRoot = "ContractorPro"
New-Item -ItemType Directory -Force -Path $projectRoot | Out-Null

# Create .NET Solution
Set-Location $projectRoot
dotnet new sln -n ContractorPro

# Create src directory
New-Item -ItemType Directory -Force -Path "src" | Out-Null

# Create API project
dotnet new webapi -n ContractorPro.API -o src/ContractorPro.API
dotnet sln add src/ContractorPro.API/ContractorPro.API.csproj

# Create Domain project (Class Library)
dotnet new classlib -n ContractorPro.Domain -o src/ContractorPro.Domain
dotnet sln add src/ContractorPro.Domain/ContractorPro.Domain.csproj

# Create Infrastructure project (Class Library)
dotnet new classlib -n ContractorPro.Infrastructure -o src/ContractorPro.Infrastructure
dotnet sln add src/ContractorPro.Infrastructure/ContractorPro.Infrastructure.csproj

# Add project references
dotnet add src/ContractorPro.API/ContractorPro.API.csproj reference src/ContractorPro.Domain/ContractorPro.Domain.csproj
dotnet add src/ContractorPro.API/ContractorPro.API.csproj reference src/ContractorPro.Infrastructure/ContractorPro.Infrastructure.csproj
dotnet add src/ContractorPro.Infrastructure/ContractorPro.Infrastructure.csproj reference src/ContractorPro.Domain/ContractorPro.Domain.csproj

# Add NuGet packages to Infrastructure
dotnet add src/ContractorPro.Infrastructure/ContractorPro.Infrastructure.csproj package Microsoft.EntityFrameworkCore
dotnet add src/ContractorPro.Infrastructure/ContractorPro.Infrastructure.csproj package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add src/ContractorPro.Infrastructure/ContractorPro.Infrastructure.csproj package Microsoft.EntityFrameworkCore.Design

# Add EF tools to API
dotnet add src/ContractorPro.API/ContractorPro.API.csproj package Microsoft.EntityFrameworkCore.Design

Set-Location ..

# Create Angular Frontend
Write-Host "Creating Angular frontend..." -ForegroundColor Cyan
npx @angular/cli@18 new contractor-frontend --style=scss --routing=true --skip-git=true --skip-install=false

Set-Location contractor-frontend
npx ng add @angular/material --skip-confirmation

Set-Location ..

Write-Host "ContractorPro setup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Setup NeonDB connection in ContractorPro/src/ContractorPro.API/appsettings.json"
Write-Host "2. Run EF migrations"
Write-Host "3. Start with docker-compose up --build"
