using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace webtruyen.Model;

public partial class WebtruyenContext : DbContext
{
    public WebtruyenContext()
    {
    }

    public WebtruyenContext(DbContextOptions<WebtruyenContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Chaper> Chapers { get; set; }

    public virtual DbSet<Rate> Rates { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Story> Stories { get; set; }

    public virtual DbSet<View> Views { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("server =DESKTOP-6A025HU\\SQL2019; database = webtruyen;uid=sa;pwd=123;TrustServerCertificate=true");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.ToTable("Account");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountBalance)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("accountBalance");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.ExpireTime)
                .HasColumnType("datetime")
                .HasColumnName("expireTime");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.ModifiedDate)
                .HasColumnType("datetime")
                .HasColumnName("modifiedDate");
            entity.Property(e => e.Password).HasColumnName("password");
            entity.Property(e => e.Phone)
                .HasMaxLength(50)
                .HasColumnName("phone");
            entity.Property(e => e.RoleId).HasColumnName("roleID");
            entity.Property(e => e.Token).HasColumnName("token");

            entity.HasOne(d => d.Role).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Account_Role");

            entity.HasMany(d => d.Chapters).WithMany(p => p.Accounts)
                .UsingEntity<Dictionary<string, object>>(
                    "AccountChaper",
                    r => r.HasOne<Chaper>().WithMany()
                        .HasForeignKey("ChapterId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_AccountChaper_Chaper"),
                    l => l.HasOne<Account>().WithMany()
                        .HasForeignKey("AccountId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_AccountChaper_Account"),
                    j =>
                    {
                        j.HasKey("AccountId", "ChapterId");
                        j.ToTable("AccountChaper");
                        j.IndexerProperty<long>("AccountId").HasColumnName("accountID");
                        j.IndexerProperty<long>("ChapterId").HasColumnName("chapterID");
                    });

            entity.HasMany(d => d.Stories).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "History",
                    r => r.HasOne<Story>().WithMany()
                        .HasForeignKey("StoryId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_History_Story"),
                    l => l.HasOne<Account>().WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_History_Account"),
                    j =>
                    {
                        j.HasKey("UserId", "StoryId");
                        j.ToTable("History");
                        j.IndexerProperty<long>("UserId").HasColumnName("userID");
                        j.IndexerProperty<long>("StoryId").HasColumnName("storyID");
                    });
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Category");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<Chaper>(entity =>
        {
            entity.ToTable("Chaper");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content)
                .HasColumnType("ntext")
                .HasColumnName("content");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Order).HasColumnName("order");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.StoryId).HasColumnName("storyID");

            entity.HasOne(d => d.Story).WithMany(p => p.Chapers)
                .HasForeignKey(d => d.StoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Chaper_Story");
        });

        modelBuilder.Entity<Rate>(entity =>
        {
            entity.ToTable("Rate");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.Rate1).HasColumnName("rate");
            entity.Property(e => e.StoryId).HasColumnName("storyId");

            entity.HasOne(d => d.Account).WithMany(p => p.Rates)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK_Rate_Account");

            entity.HasOne(d => d.Story).WithMany(p => p.Rates)
                .HasForeignKey(d => d.StoryId)
                .HasConstraintName("FK_Rate_Story");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.ToTable("Review");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.StoryId).HasColumnName("storyID");
            entity.Property(e => e.UserId).HasColumnName("userID");

            entity.HasOne(d => d.Story).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.StoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Review_Story");

            entity.HasOne(d => d.User).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Review_Account");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Role");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<Story>(entity =>
        {
            entity.ToTable("Story");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Author).HasColumnName("author");
            entity.Property(e => e.CategoryId).HasColumnName("categoryID");
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Image).HasColumnName("image");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.ModifiedDate)
                .HasColumnType("datetime")
                .HasColumnName("modifiedDate");
            entity.Property(e => e.NumOfPeopleReview).HasColumnName("numOfPeopleReview");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.TotalReview).HasColumnName("totalReview");

            entity.HasOne(d => d.Category).WithMany(p => p.Stories)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Story_Category");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.StoriesNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_Story_Account");
        });

        modelBuilder.Entity<View>(entity =>
        {
            entity.ToTable("View");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StoryId).HasColumnName("storyId");
            entity.Property(e => e.ViewDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("viewDate");

            entity.HasOne(d => d.Story).WithMany(p => p.Views)
                .HasForeignKey(d => d.StoryId)
                .HasConstraintName("FK_View_Story");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
