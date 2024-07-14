namespace webtruyen.DTO
{
    public class ChapterDTO
    {
        public long? id { get; set; }
        public string content { get; set; }
        public string name { get; set; }
        public long storyID { get; set; }
        public long order {  get; set; }
        public bool status { get; set; } = true;
    }
}
