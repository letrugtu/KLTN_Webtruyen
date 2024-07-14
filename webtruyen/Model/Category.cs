using System;
using System.Collections.Generic;

namespace webtruyen.Model;

public partial class Category
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public bool IsActive { get; set; }

    public virtual ICollection<Story> Stories { get; set; } = new List<Story>();
}
