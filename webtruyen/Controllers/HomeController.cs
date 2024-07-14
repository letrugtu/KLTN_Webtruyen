using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using webtruyen.DTO;
using webtruyen.Model;
using webtruyen.Ulti;

namespace webtruyen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private WebtruyenContext context;

        public HomeController()
        {
            this.context = new WebtruyenContext();
        }

        [HttpGet]
        [Route("getAllCategories")]
        public IActionResult getAllCategories()
        {
            List<Category> categories = context.Categories.ToList();
            return Ok(categories);
        }

        [HttpPost]
        [Route("getAllStories")]
        public IActionResult getAllStories([FromBody] StoryRequest storyRequest)
        {
            List<Story> stories = context.Stories.Include(n => n.Category).Include(n => n.Chapers).Where(n => n.IsActive == true).ToList();
            if(storyRequest != null)
            {
                if (storyRequest.categoryID != null)
                {
                    stories = stories.Where(n=> n.CategoryId == storyRequest.categoryID).ToList();
                }
                if(storyRequest.searchValue != null)
                {
                    stories = stories.Where(n => n.Title.ToLower().Contains(storyRequest.searchValue.ToLower())).ToList();
                }
                if(storyRequest.numberOfChapters != null)
                {
                    if(storyRequest.numberOfChapters != "under 100 chapters")
                    {
                        stories = stories.Where(n => n.Chapers.Count() < 100).ToList();
                    }
                    else if(storyRequest.numberOfChapters != "100 - 500 chapters")
                    {
                        stories = stories.Where(n => n.Chapers.Count() >= 100 && n.Chapers.Count() < 500).ToList();
                    }
                    else if(storyRequest.numberOfChapters != "100 - 500 chapters")
                    {
                        stories = stories.Where(n => n.Chapers.Count() >= 500 && n.Chapers.Count() <= 1000).ToList();
                    }
                    else
                    {
                        stories = stories.Where(n => n.Chapers.Count() > 1000).ToList();
                    }
                }
            }
            return Ok(stories);
        }

        [HttpGet]
        [Route("getStoryDetail/{id}")]
        public IActionResult getStoryByID(int id)
        {
            Story story = context.Stories.Include(n => n.Category).Include(n => n.Chapers).Include(n => n.Rates).Include(n => n.Reviews).ThenInclude(n => n.User).FirstOrDefault(n => n.Id == id);
            if(story != null)
            {
                return Ok(story);
            }
            else
            {
                return NotFound();
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpDelete]
        [Route("deletStory/{id}")]
        public IActionResult delStoryByID(int id)
        {
            Story story = context.Stories.Include(n => n.Chapers).Include(n => n.Reviews).Include(n => n.Reviews).FirstOrDefault(n => n.Id == id);
            if (story != null)
            {
                context.Reviews.RemoveRange(story.Reviews);
                context.Chapers.RemoveRange(story.Chapers);
                context.SaveChanges();
                context.Stories.Remove(story);
                context.SaveChanges();
                return Ok(story);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet]
        [Route("getChapterDetail/{id}")]
        public IActionResult getChapterDetailByID(int id)
        {
            Chaper chaper = context.Chapers.FirstOrDefault(n => n.Id == id);
            if (chaper != null)
            {
                if (chaper.Status == true)
                {
                    return Ok(chaper);
                }
                else
                {
                    var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
                    if(authHeader != null)
                    {
                        var token = authHeader.Substring("Bearer ".Length).Trim();

                        var handler = new JwtSecurityTokenHandler();
                        var jwtToken = handler.ReadJwtToken(token);

                        // Lấy thông tin từ JWT
                        var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
                        Account account = context.Accounts.Include(a => a.Chapters).FirstOrDefault(n => n.Email.Equals(email));
                        if (account != null && account.Chapters.Contains(chaper))
                        {
                            return Ok(chaper);
                        } else if (account.RoleId == 2)
                        {
                            return Ok(chaper);
                        }
                        else
                        {
                            return BadRequest("Bạn cần unlock để đọc trang truyện này");
                        }
                    }                  
                    else
                    {
                        return Unauthorized();
                    }
                }
            }
            else
            {
                return NotFound();
            }
            
            
        }
        [Authorize(Policy = "User")]
        [HttpPost]
        [Route("updateProfile")]
        public IActionResult getUserProfile([FromBody] AccountInfoDTO request)
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy thông tin từ JWT
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
            Account account = context.Accounts.FirstOrDefault(n => n.Email == email);
            account.Address = request.address;
            account.Phone = request.phone;
            account.Password = request.password;
            account.ModifiedDate = DateTime.Now;
            context.SaveChanges();
            return Ok(account);
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpPost]
        [Route("userprofile")]
        public IActionResult updateProfile()
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy thông tin từ JWT
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
            Account account = context.Accounts.Include(n => n.Role).Include(n => n.Chapters).Include(n => n.StoriesNavigation).FirstOrDefault(n => n.Email == email);
            return Ok(account);
        }

        [Authorize(Policy = "User")]
        [HttpGet]
        [Route("history")] 
        public IActionResult getHistory()
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy thông tin từ JWT
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
            List<Story> stories = context.Stories.Where(n => n.Users.FirstOrDefault().Email == email).ToList();
            return Ok(stories);
        }

        [HttpPost]
        [Route("unlock-all")]
        [Authorize(Policy = "User")]
        public IActionResult unlockStoryAll([FromBody] int storyID)
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy thông tin từ JWT
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
            Account account = context.Accounts.FirstOrDefault(n => n.Equals(email));
            Story story = context.Stories.Include(n => n.Chapers).FirstOrDefault(n => n.Id == storyID);
            if (story != null && account.AccountBalance == (10 * story.Chapers.Count()))
            {
                account.Chapters = story.Chapers.Where(n => n.Status == true).ToList();
                account.AccountBalance = account.AccountBalance - (10 * story.Chapers.Count());
                context.SaveChanges();
                return Ok();
            }
            else
            {
                return BadRequest("Không đủ xu. Vui lòng nạp thêm để đọc truyện");
            }
        }

        [HttpPost]
        [Route("unlockChapters")]
        [Authorize(Policy = "User")]
        public IActionResult unlockChapters([FromBody] List<long> chapterIDs)
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy thông tin từ JWT
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
            Account account = context.Accounts.FirstOrDefault(n => n.Email.Equals(email));
            List<Chaper> chapers = context.Chapers.Where(n => chapterIDs.Contains(n.Id)).ToList();
            if (chapers != null && account.AccountBalance >= (10 * chapers.Count()))
            {
                List<Chaper> combinedList = new List<Chaper>(account.Chapters);
                combinedList.AddRange(chapers);
                account.Chapters = combinedList;
                account.AccountBalance = account.AccountBalance - (10 * chapers.Count());
                context.SaveChanges();
                return Ok();
            }
            else
            {
                return BadRequest("Không đủ xu. Vui lòng nạp thêm để đọc truyện");
            }
        }

        [HttpPost]
        [Route("createReview")]
        [Authorize(Policy = "User")]
        public IActionResult createReview([FromBody] ReviewDTO reviewDTO)
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy thông tin từ JWT
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
            Account account = context.Accounts.FirstOrDefault(n => n.Email.Equals(email));
            Review review = new Review
            {
                Content = reviewDTO.content,
                CreatedDate = DateTime.Now,
                UserId = account.Id,
                StoryId = reviewDTO.storyID
            };
            context.Add(review);
            context.SaveChanges();
            return Ok("Create Review Successfully!");
        }

        [HttpPost]
        [Route("addStory")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult createStory([FromBody] StoryCreateRequest request)
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy thông tin từ JWT
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
            Account account = context.Accounts.FirstOrDefault(n => n.Email.Equals(email));
            Story story = new Story
            {
                Title = request.title,
                Description = request.description,
                CreatedDate = DateTime.Now,
                ModifiedDate = DateTime.Now,
                IsActive = true,
                Status = "Hot",
                Image = request.image,
                CategoryId = request.categoryID,
                Author = request.author
            };
            context.Add(story);
            context.SaveChanges();
            return Ok(story);
        }

        [HttpPost]
        [Route("editStory")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult editStory([FromBody] StoryCreateRequest request)
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy thông tin từ JWT
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
            Account account = context.Accounts.FirstOrDefault(n => n.Email.Equals(email));
            Story story = context.Stories.FirstOrDefault(n => n.Id == request.id);
            story.Title = request.title;
            story.Description = request.description;
            story.ModifiedDate = DateTime.Now;
            story.Image = request.image;
            story.CategoryId = request.categoryID;
            story.Author = request.author;

            context.SaveChanges();
            return Ok(story);
        }

        [HttpPost]
        [Route("addChapter")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult createChapter([FromBody] ChapterDTO request)
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader.Substring("Bearer ".Length).Trim();


            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy thông tin từ JWT
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
            Account account = context.Accounts.FirstOrDefault(n => n.Email.Equals(email));
            Chaper chapter = new Chaper
            {
                Content = request.content,
                Name = request.name,
                Order = request.order,
                Status = request.status,
                Story = context.Stories.FirstOrDefault(n => n.Id == request.storyID),
                StoryId = request.storyID
            };
            context.Add(chapter);
            context.SaveChanges();
            return Ok("Create Chapter Successfully!");
        }

        [HttpPost]
        [Route("editChapter")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult editChapter([FromBody] ChapterDTO request)
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy thông tin từ JWT
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
            Account account = context.Accounts.FirstOrDefault(n => n.Email.Equals(email));
            Chaper chapter = context.Chapers.FirstOrDefault(n => n.Id == request.id);

            chapter.Content = request.content;
            chapter.Name = request.name;
            chapter.Order = request.order;
            
            context.SaveChanges();
            return Ok("Edit Chapter Successfully!");
        }

        [HttpDelete]
        [Route("deleteChapter/{id}")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult deleteChapter(int id)
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy thông tin từ JWT
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
            Account account = context.Accounts.FirstOrDefault(n => n.Email.Equals(email));
            Chaper chapter = context.Chapers.FirstOrDefault(n => n.Id == id);

            context.Chapers.Remove(chapter);
            context.SaveChanges();
            return Ok("Remove Chapter Successfully!");
        }

        [HttpPost]
        [Route("rating")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult Rating([FromBody] RatingDTO request)
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy thông tin từ JWT
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
            Account account = context.Accounts.FirstOrDefault(n => n.Email.Equals(email));
            Rate rate = context.Rates.FirstOrDefault(n => n.AccountId == account.Id && n.StoryId == request.StoryId);
            if (rate != null)
            {
                rate.Rate1 = request.Rate1;
            }
            else
            {
                rate = new Rate
                {
                    AccountId = account.Id,
                    StoryId = request.StoryId,
                    Rate1 = request.Rate1,
                };
                context.Rates.Add(rate);
            }

            context.SaveChanges();
            return Ok(request);
        }

        [HttpPost]
        [Route("changePassword")]
        [Authorize(Policy = "User")]
        public IActionResult changePassword(ChangePasswordDTO request)
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy thông tin từ JWT
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
            Account account = context.Accounts.FirstOrDefault(n => n.Email.Equals(email));
            if(account!=null&&account.Password.Equals(request.oldPassword))
            {
                account.Password = request.newPassword;
                context.SaveChanges();
                return Ok("Change password Successfully!");
            }
            else
            {
                return BadRequest("Wrong password");
            }
            
        }


        [HttpPost]
        [Route("resetPassword")]
        public IActionResult resetPassword([FromBody] string email)
        {
            
            Account account = context.Accounts.FirstOrDefault(n => n.Email.Equals(email));
            if (account!=null)
            {
                string resetPassword = Helper.GenerateRandomString();
                string message = "Your password was reseted";
                string body = "Your reset password is " + resetPassword;
                account.Password = resetPassword;
                Helper.SendEmail(account.Email, message, body);
                context.SaveChanges();

                return Ok("Reset password Successfully!");
            }
            else
            {
                return NotFound();
            }

        }

        [HttpDelete]
        [Route("deleteReview/{id}")]
        [Authorize(Policy = "UserOrAdmin")]
        public IActionResult deleteReview(int id)
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy thông tin từ JWT
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
            Account account = context.Accounts.FirstOrDefault(n => n.Email.Equals(email));
            Review review = context.Reviews.FirstOrDefault(n => n.Id == id);

            context.Reviews.Remove(review);
            context.SaveChanges();
            return Ok("Remove review Successfully!");
        }

        [HttpPost]
        [Route("addView")]
        public IActionResult addView([FromBody]long storyId)
        {

            View view = new View
            {
                StoryId = storyId,
                ViewDate = DateTime.Now,
            };
            context.Views.Add(view);
            context.SaveChanges();
            return Ok(view);

        }


    }
}
