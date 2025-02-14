using ApiZ.Models;
using ApiZ.Services;
using Microsoft.AspNetCore.Mvc;

namespace ApiZ.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwtService;

        public AuthController(JwtService jwtService)
        {
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            if (user.Username == "admin" && user.Password == "1234") // Simulación de usuario válido
            {
                var token = _jwtService.GenerateToken(user.Username);
                return Ok(new { Token = token });
            }

            return Unauthorized("Usuario o contraseña incorrectos.");
        }
    }
}
