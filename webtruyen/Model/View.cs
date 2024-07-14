using System;
using System.Collections.Generic;

namespace webtruyen.Model;

public partial class View
{
    public int Id { get; set; }

    public long? StoryId { get; set; }

    public DateTime? ViewDate { get; set; }

    public virtual Story? Story { get; set; }
}
