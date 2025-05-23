using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;

namespace Fullstack1.Controllers
{
    // Gets the localized values
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly IStringLocalizer<HomeController> _localizer;

        public HomeController(IStringLocalizer<HomeController> localizer)
        {
            _localizer = localizer;
        }

        // GET api/home/content
        // Returns localized strings for the landing page content.
        [HttpGet("content")]
        public IActionResult GetLandingPageContent()
        {
            var response = new
            {
                homeTitle = _localizer["homeTitle"], // Retrieves the localized value for homeTitle
                welcomeMessage = _localizer["welcomeMessage"] // Retrieves the localized value for welcomeMessage
            };

            return Ok(response);
        }
    }
}
