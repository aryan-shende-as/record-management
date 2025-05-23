
namespace Fullstack1.Services
{
    // methods for managing a blacklist of JWT tokens by their jti(unique identifier).
    public interface ITokenBlacklistService
    {
        // Adds a token to the blacklist with an associated expiration time.
        void BlacklistToken(string jti, DateTime expiry);

        // Checks if a token is currently blacklisted or not.
        bool IsTokenBlacklisted(string jti);
    }
}
