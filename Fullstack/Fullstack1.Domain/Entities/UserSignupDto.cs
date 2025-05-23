namespace Fullstack1.Domain.Entities
{
    public class UserSignupDto
    {
        public string username { get; set; }
        public string password { get; set; }
        public string role { get; set; } = "User"; // default role
    }
}
