using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContractorPro.Domain.Entities;
using ContractorPro.Infrastructure.Data;

namespace ContractorPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        return await _context.Categories
            .OrderBy(c => c.Group)
            .ThenBy(c => c.Name)
            .ToListAsync();
    }

    [HttpGet("group/{group}")]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategoriesByGroup(string group)
    {
        return await _context.Categories
            .Where(c => c.Group == group)
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
            return NotFound();

        return category;
    }

    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory(Category category)
    {
        category.CreatedAt = DateTime.UtcNow;
        category.IsDefault = false;

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, Category category)
    {
        if (id != category.Id)
            return BadRequest();

        var existingCategory = await _context.Categories.FindAsync(id);
        if (existingCategory == null)
            return NotFound();

        if (existingCategory.IsDefault)
            return BadRequest("Cannot modify default categories");

        existingCategory.Name = category.Name;
        existingCategory.Group = category.Group;
        existingCategory.Color = category.Color;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return NotFound();

        if (category.IsDefault)
            return BadRequest("Cannot delete default categories");

        // Check if category is in use
        var isInUse = await _context.ContractItems.AnyAsync(i => i.CategoryId == id);
        if (isInUse)
            return BadRequest("Cannot delete category that is in use");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
