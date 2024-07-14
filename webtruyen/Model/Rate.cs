using System;
using System.Collections.Generic;

namespace webtruyen.Model;

public partial class Rate
{
    public int Id { get; set; }

    public int? Rate1 { get; set; }

    public long? AccountId { get; set; }

    public long? StoryId { get; set; }

    public virtual Account? Account { get; set; }

    public virtual Story? Story { get; set; }
}
