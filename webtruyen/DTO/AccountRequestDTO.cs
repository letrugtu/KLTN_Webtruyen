namespace webtruyen.DTO
{
    public class AccountRequestDTO
    {
        public string? searchValue { get;set; }
        public int? roleID { get; set; }
        public int? balance { get; set; }
        public bool? isActive { get; set; }
    }
}
