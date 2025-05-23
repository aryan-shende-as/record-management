//using System.IdentityModel.Tokens.Jwt;
//using Fullstack1.Services;

//namespace Fullstack1.Middlewares
//{
//    // Middleware that checks if a JWT token has been blacklisted.
//    // If the token is blacklisted then it prevents the request from proceeding further.
//    public class TokenBlacklistMiddleware
//    {
//        private readonly RequestDelegate _next;

//        // Initialize the middleware.
//        public TokenBlacklistMiddleware(RequestDelegate next)
//        {
//            _next = next;
//        }

//        // Checks for a blacklisted JWT token in the Auth header.
//        public async Task Invoke(HttpContext context, ITokenBlacklistService blacklistService)
//        {
//            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

//            if (!string.IsNullOrEmpty(token))
//            {
//                var handler = new JwtSecurityTokenHandler();
//                var jwt = handler.ReadJwtToken(token);
//                var jti = jwt.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value;

//                if (jti != null && blacklistService.IsTokenBlacklisted(jti))
//                {
//                    context.Response.StatusCode = 401;
//                    await context.Response.WriteAsync("Token is Blacklisted");
//                    return;
//                }
//            }

//            await _next(context);
//        }
//    }
//}


using System.IdentityModel.Tokens.Jwt;
using Fullstack1.Services;

namespace Fullstack1.Middlewares
{
    public class TokenBlacklistMiddleware
    {
        private readonly RequestDelegate _next;

        public TokenBlacklistMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, ITokenBlacklistService blacklistService)
        {
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

            if (!string.IsNullOrEmpty(authHeader))
            {
                var token = authHeader.Split(" ").Last();

                if (!string.IsNullOrEmpty(token))
                {
                    var handler = new JwtSecurityTokenHandler();

                    if (handler.CanReadToken(token))
                    {
                        var jwt = handler.ReadJwtToken(token);
                        var jti = jwt.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value;

                        if (jti != null && blacklistService.IsTokenBlacklisted(jti))
                        {
                            context.Response.StatusCode = 401;
                            await context.Response.WriteAsync("Token is Blacklisted");
                            return;
                        }
                    }
                    else
                    {
                        context.Response.StatusCode = 400;
                        await context.Response.WriteAsync("Invalid JWT format");
                        return;
                    }
                }
                else
                {
                    // Authorization header present but token part is empty — ignore and continue
                    await _next(context);
                    return;
                }
            }
            else
            {
                // No Authorization header present — just continue
                await _next(context);
                return;
            }

            await _next(context);
        }

    }
}
