using Microsoft.AspNetCore.Mvc;

namespace FrontendWeb.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }

        public IActionResult Productos()
        {
            return View();
        }
    }
}
