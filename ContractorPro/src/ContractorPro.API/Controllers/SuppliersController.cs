using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContractorPro.Domain.Entities;
using ContractorPro.Infrastructure.Data;

namespace ContractorPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SuppliersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SuppliersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Supplier>>> GetSuppliers()
    {
        return await _context.Suppliers
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Supplier>> GetSupplier(int id)
    {
        var supplier = await _context.Suppliers.FindAsync(id);

        if (supplier == null)
            return NotFound();

        return supplier;
    }

    [HttpPost]
    public async Task<ActionResult<Supplier>> CreateSupplier(Supplier supplier)
    {
        supplier.CreatedAt = DateTime.UtcNow;
        supplier.UpdatedAt = DateTime.UtcNow;

        _context.Suppliers.Add(supplier);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSupplier), new { id = supplier.Id }, supplier);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSupplier(int id, Supplier supplier)
    {
        if (id != supplier.Id)
            return BadRequest();

        supplier.UpdatedAt = DateTime.UtcNow;
        _context.Entry(supplier).State = EntityState.Modified;
        _context.Entry(supplier).Property(x => x.CreatedAt).IsModified = false;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Suppliers.AnyAsync(s => s.Id == id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSupplier(int id)
    {
        var supplier = await _context.Suppliers.FindAsync(id);
        if (supplier == null)
            return NotFound();

        // Check if supplier is in use
        var isInUse = await _context.ContractItems.AnyAsync(i => i.SupplierId == id);
        if (isInUse)
            return BadRequest("Cannot delete supplier that is in use. Remove supplier from all contract items first.");

        _context.Suppliers.Remove(supplier);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
