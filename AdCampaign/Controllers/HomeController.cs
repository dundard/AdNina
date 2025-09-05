using Microsoft.AspNetCore.Mvc;

namespace AdCampaign.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Index(string url)
        {
            if (!string.IsNullOrEmpty(url))
            {
                return RedirectToAction("Index", "Analyze");
            }
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}