using System.ComponentModel.DataAnnotations;

namespace Fullstack1.Domain.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string username { get; set; } = string.Empty;

        [Required]
        public string password { get; set; } = string.Empty;

        [Required]
        public string role { get; set; } = "User";
    }
}