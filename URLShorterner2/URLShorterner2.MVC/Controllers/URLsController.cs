using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using URLShorterner2.MVC.Data;
using URLShorterner2.MVC.Data.Entities;

namespace URLShorterner2.MVC.Controllers
{
    public class URLsController : Controller
    {
        private readonly URL2DbContext _context;

        public URLsController(URL2DbContext context)
        {
            _context = context;
        }

        // GET: URLs
        public async Task<IActionResult> Index()
        {
            return View(await _context.URLs.ToListAsync());
        }

        // GET: URLs/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var uRL = await _context.URLs
                .FirstOrDefaultAsync(m => m.Id == id);
            if (uRL == null)
            {
                return NotFound();
            }

            return View(uRL);
        }

        // GET: URLs/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: URLs/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,OriginURL,ShortenedURL,Position")] URL uRL)
        {
            if (ModelState.IsValid)
            {
                uRL.Id = Guid.NewGuid();
                _context.Add(uRL);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(uRL);
        }

        // GET: URLs/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var uRL = await _context.URLs.FindAsync(id);
            if (uRL == null)
            {
                return NotFound();
            }
            return View(uRL);
        }

        // POST: URLs/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("Id,OriginURL,ShortenedURL,Position")] URL uRL)
        {
            if (id != uRL.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(uRL);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!URLExists(uRL.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(uRL);
        }

        // GET: URLs/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var uRL = await _context.URLs
                .FirstOrDefaultAsync(m => m.Id == id);
            if (uRL == null)
            {
                return NotFound();
            }

            return View(uRL);
        }

        // POST: URLs/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var uRL = await _context.URLs.FindAsync(id);
            if (uRL != null)
            {
                _context.URLs.Remove(uRL);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool URLExists(Guid id)
        {
            return _context.URLs.Any(e => e.Id == id);
        }
    }
}
