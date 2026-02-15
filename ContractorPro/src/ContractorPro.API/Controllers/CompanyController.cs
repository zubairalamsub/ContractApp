using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContractorPro.Domain.Entities;
using ContractorPro.Infrastructure.Data;

namespace ContractorPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompanyController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CompanyController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<Company>> GetCompany()
    {
        var company = await _context.Companies.FirstOrDefaultAsync();

        if (company == null)
        {
            // Create default company if none exists
            company = new Company
            {
                Name = "Your Company Name",
                Address = "123 Business Street",
                City = "Dhaka",
                Country = "Bangladesh",
                PostalCode = "1000",
                Phone = "+880 1234-567890",
                Email = "info@yourcompany.com",
                Website = "www.yourcompany.com",
                Description = "Your company description goes here.",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();
        }

        return company;
    }

    [HttpPut]
    public async Task<ActionResult<Company>> UpdateCompany(Company company)
    {
        var existingCompany = await _context.Companies.FirstOrDefaultAsync();

        if (existingCompany == null)
        {
            // Create new company
            company.Id = 0;
            company.CreatedAt = DateTime.UtcNow;
            company.UpdatedAt = DateTime.UtcNow;
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();
            return company;
        }

        // Update existing company
        existingCompany.Name = company.Name;
        existingCompany.Logo = company.Logo;
        existingCompany.Address = company.Address;
        existingCompany.City = company.City;
        existingCompany.Country = company.Country;
        existingCompany.PostalCode = company.PostalCode;
        existingCompany.Phone = company.Phone;
        existingCompany.Email = company.Email;
        existingCompany.Website = company.Website;
        existingCompany.TaxId = company.TaxId;
        existingCompany.RegistrationNumber = company.RegistrationNumber;
        existingCompany.Description = company.Description;
        existingCompany.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return existingCompany;
    }
}
