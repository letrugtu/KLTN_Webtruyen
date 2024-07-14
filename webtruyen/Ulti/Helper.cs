using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using System.Net.Mail;
using System.Net;
using System.Text;

namespace webtruyen.Ulti
{
    public class Helper
    {
        private static string CLOUD_NAME = "dspq82lmr";
        private static string API_KEY = "977788362272316";
        private static string API_SECRET = "BY2hb1uuR_LyiFapfoJ4ig-yFok";
        private static string senderEmail = "todentsukanai@gmail.com";
        private static string senderPassword = "ldyy yapj lqqb nkhv";

        public static string UploadPhoto(Stream stream)
        {
            Account account = new Account(
             CLOUD_NAME,
              API_KEY,
             API_SECRET);

            Cloudinary cloudinary = new Cloudinary(account);
            var uploadParams = new CloudinaryDotNet.Actions.ImageUploadParams()
            {
                File = new FileDescription(Guid.NewGuid().ToString(), stream),
            };
            ImageUploadResult uploadResult = cloudinary.Upload(uploadParams);
            return cloudinary.Api.UrlImgUp.BuildUrl(String.Format("{0}.{1}", uploadResult.PublicId, uploadResult.Format));
        }

        public static void SendEmail(string recipientEmail, string subject, string body)
        {
            string smtpServer = "smtp.gmail.com";
            int smtpPort = 587;

            using (SmtpClient smtpClient = new SmtpClient(smtpServer, smtpPort))
            {
                smtpClient.EnableSsl = true;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential(senderEmail, senderPassword);

                using (MailMessage mailMessage = new MailMessage())
                {
                    mailMessage.From = new MailAddress(senderEmail);
                    mailMessage.To.Add(recipientEmail);
                    mailMessage.Subject = subject;
                    mailMessage.Body = body;

                    smtpClient.Send(mailMessage);
                }
            }
        }

        public static string GenerateRandomString()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            StringBuilder sb = new StringBuilder();
            Random random = new Random();

            for (int i = 0; i < 8; i++)
            {
                sb.Append(chars[random.Next(chars.Length)]);
            }

            return sb.ToString();
        }
    }
}
