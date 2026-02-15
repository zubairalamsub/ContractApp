# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ContractorPro.sln .
COPY src/ContractorPro.API/ContractorPro.API.csproj src/ContractorPro.API/
COPY src/ContractorPro.Domain/ContractorPro.Domain.csproj src/ContractorPro.Domain/
COPY src/ContractorPro.Infrastructure/ContractorPro.Infrastructure.csproj src/ContractorPro.Infrastructure/

# Restore dependencies
RUN dotnet restore

# Copy source code
COPY . .

# Build and publish
WORKDIR /src/src/ContractorPro.API
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# Render uses PORT env variable
ENV ASPNETCORE_URLS=http://+:${PORT:-10000}
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 10000

ENTRYPOINT ["dotnet", "ContractorPro.API.dll"]
