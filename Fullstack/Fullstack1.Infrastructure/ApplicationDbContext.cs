using Fullstack1.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Fullstack1.Infrastructure
{
    public class ApplicationDbContext : DbContext
    {
        // Employee table
        public DbSet<Employee> Employee { get; set; }
        public DbSet<Attendance> Attendances { get; set; }

        // Dept table
        public DbSet<Department> Department { get; set; }

        //Users table
        public DbSet<User> Users { get; set; }

        // FileUpload table
        //public DbSet<FileUploadDto> FileUpload { get; set; }

        // Connection String
        public string ConnectionString { get; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
            ConnectionString = "Data Source=A\\SQLEXPRESS;Database=mytestdb;Integrated Security=True;Trusted_Connection=True;TrustServerCertificate=True;";
        }

        public ApplicationDbContext()
        {
            ConnectionString = "Data Source=A\\SQLEXPRESS;Database=mytestdb;Integrated Security=True;Trusted_Connection=True;TrustServerCertificate=True;";
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(ConnectionString);
        }

        // Constraints
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ensure DepartmentName is unique (optional)
            modelBuilder.Entity<Department>()
                .HasIndex(d => d.DepartmentName)
                .IsUnique();

            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.EmployeeId)
                .IsUnique();


            //Attendance
            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Employee)
                .WithMany(e => e.Attendances)
                .HasForeignKey(a => a.EmployeeId);

            modelBuilder.Entity<Attendance>()
                .HasIndex(a => new { a.EmployeeId, a.Date })
                .IsUnique(); // Prevent duplicate attendance entries
        }
    }
}

