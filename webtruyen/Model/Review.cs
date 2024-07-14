using System;
using System.Collections.Generic;

namespace webtruyen.Model;

public partial class Review
{
    public long Id { get; set; }

    public string Content { get; set; } = null!;

    public long UserId { get; set; }

    public DateTime CreatedDate { get; set; }

    public long StoryId { get; set; }

    public virtual Story Story { get; set; } = null!;

    public virtual Account User { get; set; } = null!;
}
