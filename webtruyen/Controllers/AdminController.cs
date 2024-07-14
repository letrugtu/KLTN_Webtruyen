using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using webtruyen.DTO;
using webtruyen.Model;

namespace webtruyen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "Admin")]
    public class AdminController : ControllerBase
    {
        private WebtruyenContext context;

        public AdminController()
        {
            this.context = new WebtruyenContext();
        }

        [HttpPost]
        [Route("getListAccounts")]
        public IActionResult getListAccount([FromBody] AccountRequestDTO request)
        {
            List<Account> accounts = context.Accounts.Include(n => n.Role).ToList();
            if(request != null)
            {
                if(request.searchValue != null)
                {
                    accounts = accounts.Where(n => n.Email.Contains(request.searchValue)).ToList();
                }
                if(request.balance != null)
                {
                    accounts = accounts.Where(n => n.AccountBalance > request.balance.Value).ToList();
                }
                if(request.isActive != null)
                {
                    accounts = accounts.Where(n => n.IsActive == request.isActive).ToList();
                }
                if(request.roleID != null)
                {
                    accounts = accounts.Where(n => n.RoleId == request.roleID).ToList();
                }    
            }
            return Ok(accounts);
        }

        [HttpDelete]
        [Route("deleteAccounts/{id}")]
        public IActionResult deleteAccount(int id)
        {
            Account account = context.Accounts.FirstOrDefault(n => n.Id == id);
            account.IsActive = !account.IsActive;
            context.SaveChanges();
            return Ok();
        }

        [HttpPost]
        [Route("getListReview")]
        public IActionResult getListReview([FromBody] SearchRequestDTO request)
        {
            List<Review> reviews = context.Reviews.Include(n => n.User).Include(n => n.Story).ToList();
            if (request != null)
            {
                if (request.searchValue != null)
                {
                    reviews = reviews.Where(n => n.Content.Contains(request.searchValue)).ToList();
                }
                
            }
            return Ok(reviews);
        }

        [HttpPost]
        [Route("getListRate")]
        public IActionResult getListRate([FromBody] SearchRequestDTO request)
        {
            List<Rate> rates = context.Rates.Include(n => n.Account).Include(n => n.Story).ToList();
            if (request != null)
            {
                if (request.searchValue != null)
                {
                    rates = rates.Where(n => n.Story.Title.Contains(request.searchValue)).ToList();
                }

            }
            return Ok(rates);
        }

        [HttpDelete]
        [Route("deleteRating/{id}")]
        public IActionResult deleteReview(int id)
        {
            Rate rate = context.Rates.FirstOrDefault(n => n.Id == id);

            context.Rates.Remove(rate);
            context.SaveChanges();
            return Ok("Remove rate Successfully!");
        }

        [HttpPost]
        [Route("getListCate")]
        public IActionResult getListCate([FromBody] SearchRequestDTO request)
        {
            List<Category> cates = context.Categories.ToList();
            if (request != null)
            {
                if (request.searchValue != null)
                {
                    cates = cates.Where(n => n.Name.Contains(request.searchValue)).ToList();
                }

            }
            return Ok(cates);
        }

        [HttpPost]
        [Route("getListView")]
        public IActionResult getListView([FromBody] string searchTime)
        {
            List<View> view = context.Views.Include(n => n.Story).ToList();
            if(searchTime.Equals("last 5 days"))
            {
                DateTime endDate = DateTime.Now;
                DateTime startDate = endDate.AddDays(-5);
                view = view.Where(obj => obj.ViewDate >= startDate && obj.ViewDate <= endDate).ToList();
            }

            if (searchTime.Equals("last 30 days"))
            {
                DateTime endDate = DateTime.Now;
                DateTime startDate = endDate.AddDays(-30);
                view = view.Where(obj => obj.ViewDate >= startDate && obj.ViewDate <= endDate).ToList();
            }

            if (searchTime.Equals("last month"))
            {
                DateTime now = DateTime.Now;
                DateTime startOfThisMonth = new DateTime(now.Year, now.Month, 1);
                DateTime startOfLastMonth = startOfThisMonth.AddMonths(-1);
                DateTime endOfLastMonth = startOfThisMonth.AddDays(-1);
                view = view.Where(obj => obj.ViewDate >= startOfLastMonth && obj.ViewDate <= endOfLastMonth).ToList();
            }

            
            return Ok(view);
        }


    }
}
