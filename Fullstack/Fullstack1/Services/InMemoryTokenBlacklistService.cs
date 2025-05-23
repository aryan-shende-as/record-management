using System;
using System.Collections.Concurrent;
using Twilio.Jwt.AccessToken;

namespace Fullstack1.Services
{
    //Provides an in-memory service for blacklisting JWT tokens using their jti (unique identifier).
    public class InMemoryTokenBlacklistService : ITokenBlacklistService
    {
        private readonly ConcurrentDictionary<string, DateTime> _blacklist = new();

        //Adds a token to the blacklist with its expiration time.
        public void BlacklistToken(string jti, DateTime expiry)
        {
            _blacklist[jti] = expiry;
        }

        // Checks if a token is blacklisted.
        // If expired, it is removed from the blacklist.
        public bool IsTokenBlacklisted(string jti)
        {
            if (_blacklist.TryGetValue(jti, out var expiry))
            {
                if (DateTime.UtcNow < expiry)
                    return true;
                else
                    _blacklist.TryRemove(jti, out _);
            }
            return false;
        }
    }
}
