using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ContractorPro.Infrastructure.Data;
using ContractorPro.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Register LogService as singleton (in-memory logs persist across requests)
builder.Services.AddSingleton<ILogService, InMemoryLogService>();

// Configure port for Render
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://*:{port}");

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "ContractorProSecretKey2024!@#$%";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "ContractorPro";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "ContractorProApp";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// Configure CORS - Allow all origins for Render deployment
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Enable Swagger in all environments for API testing
app.UseSwagger();
app.UseSwaggerUI();

// Global exception handler
app.Use(async (context, next) =>
{
    try
    {
        await next(context);
    }
    catch (Exception ex)
    {
        var logService = context.RequestServices.GetRequiredService<ILogService>();
        logService.LogError(
            "GlobalExceptionHandler",
            ex.Message,
            ex.StackTrace,
            context.Request.Path,
            context.Request.Method
        );

        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new
        {
            success = false,
            message = $"Internal server error: {ex.Message}",
            source = ex.Source
        });
    }
});

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Auto-migrate database
using (var scope = app.Services.CreateScope())
{
    var logService = scope.ServiceProvider.GetRequiredService<ILogService>();
    try
    {
        logService.LogInfo("Startup", "Starting database migration...");
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        db.Database.Migrate();
        logService.LogInfo("Startup", "Database migration completed successfully");
    }
    catch (Exception ex)
    {
        logService.LogError("Startup.DatabaseMigration", ex.Message, ex.StackTrace);
        throw; // Re-throw to prevent app from starting with broken DB
    }
}

app.Run();
