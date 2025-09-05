using Microsoft.AspNetCore.Mvc;

namespace AdCampaign.Controllers
{
    public class SetupController : Controller
    {
        public IActionResult Summary()
        {
            return View();
        }

        public IActionResult Competitors()
        {
            return View();
        }
    }
}