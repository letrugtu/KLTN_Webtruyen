using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using webtruyen.Model;

namespace webtruyen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private WebtruyenContext context;

        public AuthController()
        {
            this.context = new WebtruyenContext();
        }

        [HttpPost]
        [Route("Register")]
        public IActionResult Register([FromBody] Account account)
        {
            Account accountFromDB = context.Accounts.FirstOrDefault(n => n.Email == account.Email);
            if (accountFromDB != null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Email existed");
            }
            else
            {
                account.Role = context.Roles.ToList()[0];
                account.IsActive = true;
                account.CreatedDate = DateTime.Now;
                account.ModifiedDate = DateTime.Now;
                context.Accounts.Add(account);
                context.SaveChanges();
                return Ok(account);
            }
        }


    }
}
