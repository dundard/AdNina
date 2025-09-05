using Microsoft.AspNetCore.Mvc;

namespace AdCampaign.Controllers
{
    public class ForecastController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}