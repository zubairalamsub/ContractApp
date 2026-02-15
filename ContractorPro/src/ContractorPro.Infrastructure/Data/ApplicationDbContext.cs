using Microsoft.EntityFrameworkCore;
using ContractorPro.Domain.Entities;

namespace ContractorPro.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<ContractItem> ContractItems => Set<ContractItem>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Contract configuration
        modelBuilder.Entity<Contract>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ContractNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Client).IsRequired().HasMaxLength(200);
            entity.Property(e => e.TotalBudget).HasPrecision(18, 2);
            entity.Property(e => e.SpentAmount).HasPrecision(18, 2);
            entity.Property(e => e.Status).HasMaxLength(50);
        });

        // ContractItem configuration
        modelBuilder.Entity<ContractItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
            entity.Property(e => e.Unit).HasMaxLength(20);
            entity.Property(e => e.DeliveryStatus).HasMaxLength(50);
            entity.Ignore(e => e.TotalPrice);

            entity.HasOne(e => e.Contract)
                .WithMany(c => c.Items)
                .HasForeignKey(e => e.ContractId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Category)
                .WithMany(c => c.Items)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Supplier)
                .WithMany(s => s.Items)
                .HasForeignKey(e => e.SupplierId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Category configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Group).HasMaxLength(50);
            entity.Property(e => e.Color).HasMaxLength(20);
        });

        // Supplier configuration
        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ContactPerson).HasMaxLength(200);
            entity.Property(e => e.Email).HasMaxLength(200);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Address).HasMaxLength(500);
        });

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.FullName).HasMaxLength(200);
            entity.Property(e => e.Role).HasMaxLength(50);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Seed default categories with static date
        var seedDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        modelBuilder.Entity<Category>().HasData(
            // ICT Categories
            new Category { Id = 1, Name = "Computers & Laptops", Group = "ICT", Color = "#3B82F6", IsDefault = true, CreatedAt = seedDate },
            new Category { Id = 2, Name = "Networking Equipment", Group = "ICT", Color = "#8B5CF6", IsDefault = true, CreatedAt = seedDate },
            new Category { Id = 3, Name = "Servers & Storage", Group = "ICT", Color = "#06B6D4", IsDefault = true, CreatedAt = seedDate },
            new Category { Id = 4, Name = "Software & Licenses", Group = "ICT", Color = "#10B981", IsDefault = true, CreatedAt = seedDate },
            new Category { Id = 5, Name = "Peripherals", Group = "ICT", Color = "#F59E0B", IsDefault = true, CreatedAt = seedDate },
            // Electrical Categories
            new Category { Id = 6, Name = "Cables & Wiring", Group = "Electrical", Color = "#EF4444", IsDefault = true, CreatedAt = seedDate },
            new Category { Id = 7, Name = "Switchgear", Group = "Electrical", Color = "#F97316", IsDefault = true, CreatedAt = seedDate },
            new Category { Id = 8, Name = "Lighting", Group = "Electrical", Color = "#FBBF24", IsDefault = true, CreatedAt = seedDate },
            new Category { Id = 9, Name = "Generators & UPS", Group = "Electrical", Color = "#84CC16", IsDefault = true, CreatedAt = seedDate },
            new Category { Id = 10, Name = "Tools & Equipment", Group = "Electrical", Color = "#6366F1", IsDefault = true, CreatedAt = seedDate }
        );

        // Seed default admin user (password: admin123)
        // Hash generated using SHA256 for simplicity
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Username = "admin",
                Email = "admin@contractorpro.com",
                PasswordHash = "240be518fabd2724ddb6f04eeb9d5b075e46f52c0b4d994b262d0d3d36cf25e3", // admin123
                FullName = "System Administrator",
                Role = "Admin",
                IsActive = true,
                CreatedAt = seedDate
            }
        );
    }
}
