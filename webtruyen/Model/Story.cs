using System;
using System.Collections.Generic;

namespace webtruyen.Model;

public partial class Story
{
    public long Id { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string? Author { get; set; }

    public long CategoryId { get; set; }

    public bool? IsActive { get; set; }

    public long? TotalReview { get; set; }

    public long? NumOfPeopleReview { get; set; }

    public string? Status { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime ModifiedDate { get; set; }

    public string Image { get; set; } = null!;

    public long? CreatedBy { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<Chaper> Chapers { get; set; } = new List<Chaper>();

    public virtual Account? CreatedByNavigation { get; set; }

    public virtual ICollection<Rate> Rates { get; set; } = new List<Rate>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<View> Views { get; set; } = new List<View>();

    public virtual ICollection<Account> Users { get; set; } = new List<Account>();
}
