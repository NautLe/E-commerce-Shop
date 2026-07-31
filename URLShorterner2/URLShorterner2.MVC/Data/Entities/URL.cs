namespace URLShorterner2.MVC.Data.Entities
{
    public class URL
    {
        //=== Properties ===//
        public Guid Id { get; set; }
        public string OriginURL { get; set; } = string.Empty;
        public string ShortenedURL { get; set; } = string.Empty;
        public int Position { get; set; }
        //=== Methods ===//
    }
}
