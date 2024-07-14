
using Microsoft.AspNetCore.Mvc;
using webtruyen.Model;
using webtruyen.Ulti;
using System.IdentityModel.Tokens.Jwt;
using ZXing.QrCode;
using ZXing;
using ZXing.Windows.Compatibility;
using System.Drawing;
using System.Web;
using Microsoft.AspNetCore.Authorization;
namespace webtruyen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VNPayController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private WebtruyenContext context;
        private string url = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        private string tmnCode = "698PAAJG";
        private string hashSecret = "T3B56PHJUPRMF62RRZKYN4B5KH8G73V6";
        private Dictionary<string, string> codes = new Dictionary<string, string>();
        public VNPayController(IHttpContextAccessor httpContextAccessor)
        {
            this.context = new WebtruyenContext();
            _httpContextAccessor = httpContextAccessor;
            codes.Add("00", "Giao dịch thành công");
            codes.Add("07", "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)");
            codes.Add("09", "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.");
            codes.Add("10", "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần");
            codes.Add("11", "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.");
            codes.Add("12", "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.");
            codes.Add("13", "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.");
            codes.Add("24", "Giao dịch không thành công do: Khách hàng hủy giao dịch");
            codes.Add("51", "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.");
            codes.Add("65", "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.");
            codes.Add("75", "Ngân hàng thanh toán đang bảo trì.");
            codes.Add("79", "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch");
            codes.Add("99", "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)");
        }
        [HttpPost]
        [Route("createQR")]
        [Authorize(Policy = "User")]
        public IActionResult createQR([FromBody] int coin)
        {
            string returnUrl = "http://" + _httpContextAccessor.HttpContext.Request.Host + "/api/VNPay/PaymentConfirm";
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = authHeader.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Lấy thông tin từ JWT
            var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
            string hostName = System.Net.Dns.GetHostName();
            string clientIPAddress = System.Net.Dns.GetHostAddresses(hostName).GetValue(0).ToString();
            PayLib pay = new PayLib();
            pay.AddRequestData("vnp_Version", "2.1.0"); //Phiên bản api mà merchant kết nối. Phiên bản hiện tại là 2.1.0
            pay.AddRequestData("vnp_Command", "pay"); //Mã API sử dụng, mã cho giao dịch thanh toán là 'pay'
            pay.AddRequestData("vnp_TmnCode", tmnCode); //Mã website của merchant trên hệ thống của VNPAY (khi đăng ký tài khoản sẽ có trong mail VNPAY gửi về)
            pay.AddRequestData("vnp_Amount", (coin * 100 * 1000).ToString()); //số tiền cần thanh toán, công thức: số tiền * 100 - ví dụ 10.000 (mười nghìn đồng) --> 1000000
            pay.AddRequestData("vnp_BankCode", ""); //Mã Ngân hàng thanh toán (tham khảo: https://sandbox.vnpayment.vn/apis/danh-sach-ngan-hang/), có thể để trống, người dùng có thể chọn trên cổng thanh toán VNPAY
            pay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss")); //ngày thanh toán theo định dạng yyyyMMddHHmmss
            pay.AddRequestData("vnp_CurrCode", "VND"); //Đơn vị tiền tệ sử dụng thanh toán. Hiện tại chỉ hỗ trợ VND
            pay.AddRequestData("vnp_IpAddr", clientIPAddress); //Địa chỉ IP của khách hàng thực hiện giao dịch
            pay.AddRequestData("vnp_Locale", "vn"); //Ngôn ngữ giao diện hiển thị - Tiếng Việt (vn), Tiếng Anh (en)
            pay.AddRequestData("vnp_OrderInfo", "Thanh toán cho tài khoản " + email.Substring(0, email.IndexOf("@"))); //Thông tin mô tả nội dung thanh toán
            pay.AddRequestData("vnp_OrderType", "other"); //topup: Nạp tiền điện thoại - billpayment: Thanh toán hóa đơn - fashion: Thời trang - other: Thanh toán trực tuyến
            pay.AddRequestData("vnp_ReturnUrl", returnUrl); //URL thông báo kết quả giao dịch khi Khách hàng kết thúc thanh toán
            pay.AddRequestData("vnp_TxnRef", Guid.NewGuid().ToString()); //mã hóa đơn
            string paymentUrl = pay.CreateRequestUrl(url, hashSecret);
            HttpContext.Session.SetString("email", email);
            return Ok(GenerateQRCode(paymentUrl));
        }

        private FileContentResult GenerateQRCode(string qrContent)
        {
            BarcodeWriter writer = new BarcodeWriter
            {
                Format = BarcodeFormat.QR_CODE,
                Options = new QrCodeEncodingOptions
                {
                    Height = 300,
                    Width = 300
                }
            };

            Bitmap qrBitmap = writer.Write(qrContent);
            // Chuyển đổi Bitmap thành byte array
            using (var stream = new System.IO.MemoryStream())
            {
                qrBitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                var byteArray = stream.ToArray();
                // Trả về hình ảnh dưới dạng file stream
                return File(byteArray, "image/png");
            }
            return null;
        }
        [HttpGet]
        [Route("PaymentConfirm")]
        public IActionResult PaymentConfirm()
        {
            if (Request.QueryString.HasValue)
            {
                //lấy toàn bộ dữ liệu trả về
                var queryString = Request.QueryString.Value;
                var json = HttpUtility.ParseQueryString(queryString);
                string email = HttpContext.Session.GetString("email");
                HttpContext.Session.Clear();
                long amount = Convert.ToInt64(json["vnp_Amount"]);
                long orderId = Convert.ToInt64(json["vnp_TxnRef"]); //mã hóa đơn
                string orderInfor = json["vnp_OrderInfo"].ToString(); //Thông tin giao dịch
                long vnpayTranId = Convert.ToInt64(json["vnp_TransactionNo"]); //mã giao dịch tại hệ thống VNPAY
                string vnp_ResponseCode = json["vnp_ResponseCode"].ToString(); //response code: 00 - thành công, khác 00 - xem thêm https://sandbox.vnpayment.vn/apis/docs/bang-ma-loi/
                string vnp_SecureHash = json["vnp_SecureHash"].ToString(); //hash của dữ liệu trả về
                var pos = Request.QueryString.Value.IndexOf("&vnp_SecureHash");
                //return Ok(Request.QueryString.Value.Substring(1, pos-1) + "\n" + vnp_SecureHash + "\n"+ PayLib.HmacSHA512(hashSecret, Request.QueryString.Value.Substring(1, pos-1)));
                bool checkSignature = ValidateSignature(Request.QueryString.Value.Substring(1, pos - 1), vnp_SecureHash, hashSecret); //check chữ ký đúng hay không?
                if (checkSignature && tmnCode == json["vnp_TmnCode"].ToString())
                {
                    if (vnp_ResponseCode == "00")
                    {
                        Account account = context.Accounts.FirstOrDefault(n => n.Email == email);
                        account.AccountBalance = amount / (100 * 1000);
                        account.ModifiedDate = DateTime.Now;
                        context.SaveChanges();
                        //Thanh toán thành công
                        return Ok(codes[vnp_ResponseCode]);
                    }
                    else
                    {
                        //Thanh toán không thành công. Mã lỗi: vnp_ResponseCode
                        return BadRequest(codes[vnp_ResponseCode]);
                    }
                }
                else
                {
                    //phản hồi không khớp với chữ ký
                    return BadRequest("đường dẫn nếu phản hồi ko hợp lệ");
                }
            };
            return null;
        }

        private bool ValidateSignature(string rspraw, string inputHash, string secretKey)
        {
            string myChecksum = PayLib.HmacSHA512(secretKey, rspraw);
            return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        }
    }
}
