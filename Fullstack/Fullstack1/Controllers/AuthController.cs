
using Fullstack1.Domain.Entities;
using Fullstack1.Infrastructure;
using Fullstack1.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Fullstack1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;

            if (!_context.Users.Any(u => u.username == "admin"))
            {
                var admin = new User
                {
                    username = "admin",
                    password = "admin123",
                    role = "Admin"
                };

                _context.Users.Add(admin);
                _context.SaveChanges();
            }
        }

        // SIGNUP
        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] UserSignupDto dto)
        {
            if (dto.username.ToLower() == "admin")
                return BadRequest("Cannot sign up as admin.");

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.username == dto.username);
            if (existingUser != null)
                return BadRequest("Username already exists.");

            var user = new User
            {
                username = dto.username,
                password = dto.password,
                role = dto.role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");

        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto model)
        {
            // Find user by username and password exactly like the dummy list (plaintext password)
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.username == model.Username && u.password == model.Password);

            if (user == null)
                return Unauthorized("Invalid credentials");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("yourSuperSecretKeyThatIsAtLeast32Chars!"); // same secret
            var jti = Guid.NewGuid().ToString();

            var claims = new[]
            {
            new Claim(ClaimTypes.Name, user.username),
            new Claim(ClaimTypes.Role, user.role),
            new Claim(JwtRegisteredClaimNames.Jti, jti)
        };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = "Fullstack1",
                Audience = "Fullstack1",
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            return Ok(new { token = jwt });
        }


        // LOGOUT (blacklisting token)
        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout([FromServices] ITokenBlacklistService blacklistService)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);
            var jti = jwt.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value;
            var exp = jwt.ValidTo;

            if (!string.IsNullOrEmpty(jti))
            {
                blacklistService.BlacklistToken(jti, exp);
            }

            return Ok("Logged out and token blacklisted.");
        }



        // POST: api/auth/change-password
        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;

            if (username == null)
                return Unauthorized("Invalid token.");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.username == username);

            if (user == null)
                return NotFound("User not found.");

            if (user.password != dto.CurrentPassword)
                return BadRequest("Current password is incorrect.");

            user.password = dto.NewPassword;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok("Password changed successfully.");
        }


    }
}




