using ApiZ.Data;
using ApiZ.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class PedidosController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PedidosController(ApplicationDbContext context)
    {
        _context = context;
    }

    // 🔹 Obtener todos los pedidos con sus detalles
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidos()
    {
        return await _context.Pedido.Include(p => p.Detalles).ToListAsync();
    }

    // 🔹 Obtener un pedido por ID
    [HttpGet("{id}")]

    public async Task<ActionResult<Pedido>> GetPedido(int id)
    {
        var pedido = await _context.Pedido.Include(p => p.Detalles).FirstOrDefaultAsync(p => p.Id == id);
        if (pedido == null) return NotFound();
        return pedido;
    }

    // 🔹 Agregar un pedido con detalles
    [HttpPost]
    public async Task<ActionResult<Pedido>> PostPedido(Pedido pedido)
    {
        _context.Pedido.Add(pedido);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPedido), new { id = pedido.Id }, pedido);
    }

    // 🔹 Eliminar un pedido y sus detalles
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePedido(int id)
    {
        var pedido = await _context.Pedido.Include(p => p.Detalles).FirstOrDefaultAsync(p => p.Id == id);
        if (pedido == null) return NotFound();

        _context.Pedido.Remove(pedido);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
