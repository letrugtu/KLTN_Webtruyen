namespace webtruyen.DTO
{
    public class StoryCreateRequest
    {
        public long? id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public long categoryID { get; set; }
        public string image { get; set; }
        public string author { get; set; }
        public long createdBy { get; set; }
    }
}
