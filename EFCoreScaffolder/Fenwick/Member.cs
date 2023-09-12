using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.Fenwicks;

[Table("Member", Schema = "mbr")]
[Index("Email", Name = "UQ_Member_Email", IsUnique = true)]
[Index("GUID", Name = "UQ_Member_GUID", IsUnique = true)]
[Index("Deleted", Name = "idx_Member_Deleted_MemberID")]
[Index("Deleted", "TradePermissionAccountAdmin", Name = "idx_Member_Deleted_TradePermissionAccountAdmin")]
[Index("Deleted", "TradePermissionAccountAdmin", Name = "idx_Member_Deleted_TradePermissionAccountAdmin_Plus4")]
[Index("CountryID", Name = "idx_Member_InvalidEmail")]
[Index("CountryID", Name = "idx_Member_MemberID_CountryID")]
public partial class Member
{
    [Key]
    public int MemberID { get; set; }

    public Guid GUID { get; set; }

    [Precision(2)]
    public DateTime CreatedDT { get; set; }

    [Precision(2)]
    public DateTime ModifiedDT { get; set; }

    [Precision(2)]
    public DateTime? LoginDT { get; set; }

    public short CountryID { get; set; }

    public byte LanguageID { get; set; }

    [StringLength(50)]
    public string? FullName { get; set; }

    [StringLength(256)]
    public string Email { get; set; } = null!;

    public bool EmailConfirmed { get; set; }

    [StringLength(64)]
    public string? Password { get; set; }

    [StringLength(40)]
    public string? OldPassword { get; set; }

    public bool PasswordUpgradeRequired { get; set; }

    public byte FailedLoginAttempts { get; set; }

    public bool? Locked { get; set; }

    [StringLength(64)]
    public string? Token { get; set; }

    [Precision(2)]
    public DateTime? TokenDT { get; set; }

    public long? DefaultMemberAddressID { get; set; }

    public byte SourceID { get; set; }

    [StringLength(10)]
    public string? SourceUser { get; set; }

    [Precision(2)]
    public DateTime? UnsubscribedDT { get; set; }

    [Column(TypeName = "date")]
    public DateTime? HardBounceDT { get; set; }

    public short? ThirdPartyID { get; set; }

    public long? BillingMemberAddressID { get; set; }

    [Precision(2)]
    public DateTime? DeletedDT { get; set; }

    public bool? Deleted { get; set; }

    public bool TradeAuthenticationComplete { get; set; }

    public Guid? TradeAuthenticationGUID { get; set; }

    [StringLength(10)]
    public string? DefaultOrderTaker { get; set; }

    public int? TradeAccountID { get; set; }

    public string? SecurityStamp { get; set; }

    [Precision(2)]
    public DateTime? LockoutEndDT { get; set; }

    public bool LockoutEnabled { get; set; }

    [StringLength(256)]
    public string UserName { get; set; } = null!;

    public bool DisplayTradePrice { get; set; }

    [StringLength(50)]
    public string? PhoneNumber { get; set; }

    public byte MemberTypeID { get; set; }

    [StringLength(5)]
    public string? Initials { get; set; }

    public byte? UnsubscribeReasonID { get; set; }

    public byte MarketingLanguageID { get; set; }

    public short MarketingCountryID { get; set; }

    public byte? UnsubscribeSourceID { get; set; }

    [StringLength(50)]
    public string? Segment { get; set; }

    public bool CustomerTypeID { get; set; }

    [Precision(2)]
    public DateTime? PostalMarketingUnsubscribedDT { get; set; }

    [Precision(2)]
    public DateTime? InvalidEmailDT { get; set; }

    public bool? InvalidEmail { get; set; }

    public bool Distributor { get; set; }

    public byte MemberSegmentID { get; set; }

    public byte? DepartmentID { get; set; }

    [Required]
    public bool? ValidEmail { get; set; }

    [StringLength(50)]
    public string? FirstName { get; set; }

    [StringLength(50)]
    public string? LastName { get; set; }

    [Precision(2)]
    public DateTime? FirstBrontoSyncDT { get; set; }

    [Precision(2)]
    public DateTime? LastBrontoSyncDT { get; set; }

    public bool TradePermissionAccountAdmin { get; set; }

    public bool TradePermissionPlaceOrder { get; set; }

    public bool TradePermissionViewAccounts { get; set; }

    public bool TradePermissionDownloadPricelistsBrochures { get; set; }

    public bool TradePermissionDownloadProductFeeds { get; set; }

    [Precision(2)]
    public DateTime? TradeWebtexSyncDT { get; set; }

    [Precision(2)]
    public DateTime? TradeDeletedDT { get; set; }

    [Precision(2)]
    public DateTime? TradeAuthEmailSentDT { get; set; }

    [Precision(2)]
    public DateTime? TradeAuthenticationGUIDExpiryDT { get; set; }

    [Precision(2)]
    public DateTime? BrontoFirstSyncDT { get; set; }

    public bool TradePermissionRequestSample { get; set; }

    public byte? DotDigitalAccountID { get; set; }

    public bool? Unsubscribed { get; set; }

    [StringLength(20)]
    public string? HardBounceSource { get; set; }

    public bool? HardBounce { get; set; }

    public byte TradeAuthEmailSent { get; set; }

    [InverseProperty("ModifiedMember")]
    public virtual ICollection<Branch> Branches { get; set; } = new List<Branch>();

    [InverseProperty("ModifiedMember")]
    public virtual ICollection<Range> Ranges { get; set; } = new List<Range>();

    [InverseProperty("SignedOffMember")]
    public virtual ICollection<SelfBillInvoice> SelfBillInvoices { get; set; } = new List<SelfBillInvoice>();

    [ForeignKey("TradeAccountID")]
    [InverseProperty("Members")]
    public virtual TradeAccount? TradeAccount { get; set; }
}
