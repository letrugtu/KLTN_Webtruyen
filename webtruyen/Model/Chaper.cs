using System;
using System.Collections.Generic;

namespace webtruyen.Model;

public partial class Chaper
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public string Content { get; set; } = null!;

    public long StoryId { get; set; }

    public long Order { get; set; }

    public bool Status { get; set; }

    public virtual Story Story { get; set; } = null!;

    public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
}
