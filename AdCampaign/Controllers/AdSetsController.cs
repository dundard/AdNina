using Microsoft.AspNetCore.Mvc;

namespace AdCampaign.Controllers
{
    public class AdSetsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}