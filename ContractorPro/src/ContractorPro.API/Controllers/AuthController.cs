using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ContractorPro.Domain.Entities;
using ContractorPro.Infrastructure.Data;
using ContractorPro.API.Models;
using ContractorPro.API.Services;

namespace ContractorPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogService _logService;

    public AuthController(ApplicationDbContext context, IConfiguration configuration, ILogService logService)
    {
        _context = context;
        _configuration = configuration;
        _logService = logService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        try
        {
            _logService.LogInfo("AuthController.Login", $"Login attempt for user: {request.Username}");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.IsActive);

            if (user == null)
            {
                _logService.LogInfo("AuthController.Login", $"User not found: {request.Username}");
                return Ok(new AuthResponse
                {
                    Success = false,
                    Message = "Invalid username or password"
                });
            }

            var passwordHash = HashPassword(request.Password);
            if (user.PasswordHash != passwordHash)
            {
                _logService.LogInfo("AuthController.Login", $"Invalid password for user: {request.Username}");
                return Ok(new AuthResponse
                {
                    Success = false,
                    Message = "Invalid username or password"
                });
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            _logService.LogInfo("AuthController.Login", $"Login successful for user: {request.Username}");

            return Ok(new AuthResponse
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    FullName = user.FullName,
                    Role = user.Role
                }
            });
        }
        catch (Exception ex)
        {
            _logService.LogError(
                "AuthController.Login",
                ex.Message,
                ex.StackTrace,
                HttpContext.Request.Path,
                HttpContext.Request.Method
            );

            return StatusCode(500, new AuthResponse
            {
                Success = false,
                Message = $"Internal server error: {ex.Message}"
            });
        }
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        try
        {
            _logService.LogInfo("AuthController.Register", $"Registration attempt for user: {request.Username}, email: {request.Email}");

            // Check if username exists
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                _logService.LogInfo("AuthController.Register", $"Username already exists: {request.Username}");
                return Ok(new AuthResponse
                {
                    Success = false,
                    Message = "Username already exists"
                });
            }

            // Check if email exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                _logService.LogInfo("AuthController.Register", $"Email already exists: {request.Email}");
                return Ok(new AuthResponse
                {
                    Success = false,
                    Message = "Email already exists"
                });
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = HashPassword(request.Password),
                FullName = request.FullName,
                Role = "User",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            _logService.LogInfo("AuthController.Register", $"Registration successful for user: {request.Username}");

            return Ok(new AuthResponse
            {
                Success = true,
                Message = "Registration successful",
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    FullName = user.FullName,
                    Role = user.Role
                }
            });
        }
        catch (Exception ex)
        {
            _logService.LogError(
                "AuthController.Register",
                ex.Message,
                ex.StackTrace,
                HttpContext.Request.Path,
                HttpContext.Request.Method
            );

            return StatusCode(500, new AuthResponse
            {
                Success = false,
                Message = $"Internal server error: {ex.Message}"
            });
        }
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users.FindAsync(int.Parse(userId));
        if (user == null)
        {
            return NotFound();
        }

        return Ok(new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role
        });
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "ContractorProSecretKey2024!@#$%^&"));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "ContractorPro",
            audience: _configuration["Jwt:Audience"] ?? "ContractorProApp",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToHexString(bytes).ToLower();
    }
}
