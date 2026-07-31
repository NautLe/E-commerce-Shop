using Microsoft.EntityFrameworkCore;
using URLShorterner2.MVC.Data.Entities;

namespace URLShorterner2.MVC.Data
{
    public class URL2DbContext : DbContext
    {
        public URL2DbContext(DbContextOptions<URL2DbContext> options) : base(options)
        {
        }

        public DbSet<URL> URLs { get; set; }

        // Tùy chọn: override OnModelCreating để cấu hình nâng cao
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Example: modelBuilder.Entity<Product>().HasKey(p => p.Id);

            modelBuilder.Entity<URL>()
                .Property(u => u.OriginURL)
                .IsRequired()
                .HasMaxLength(2000);

            modelBuilder.Entity<URL>()
              .Property(u => u.ShortenedURL)
              .IsRequired()
              .HasMaxLength(200);
        }
    }
}
