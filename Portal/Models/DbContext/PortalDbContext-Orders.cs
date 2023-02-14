using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Portal.Models
{

    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public List<OrderEntryProductSearchResult> OrderEntryProductSearch(PassOrderEntryProductSearch objSearch)
        {
            SqlParameter tradeAccountId = new SqlParameter("@TradeAccountID", objSearch.TradeAccountID);
            SqlParameter productTypeGroupId = new SqlParameter("@ProductTypeGroupID", objSearch.ProductTypeGroupID ?? (object)DBNull.Value);
            SqlParameter searchTerm = new SqlParameter("@SearchTerm", objSearch.SearchTerm ?? (object)DBNull.Value);
            SqlParameter productTypeId = new SqlParameter("@ProductTypeID", objSearch.ProductTypeID ?? (object)DBNull.Value);
            SqlParameter brandId = new SqlParameter("@BrandID", objSearch.BrandID ?? (object)DBNull.Value);
            SqlParameter collectionId = new SqlParameter("@CollectionID", objSearch.CollectionID ?? (object)DBNull.Value);
            SqlParameter qualityId = new SqlParameter("@QualityID", objSearch.QualityID ?? (object)DBNull.Value);
            SqlParameter productId = new SqlParameter("@ProductID", objSearch.ProductID ?? (object)DBNull.Value);
            SqlParameter codeLike = new SqlParameter("@CodeLike", objSearch.CodeLike ?? (object)DBNull.Value);
            SqlParameter codeNotLike = new SqlParameter("@CodeNotLike", objSearch.CodeNotLike ?? (object)DBNull.Value);
            SqlParameter filter = new SqlParameter("@Filter", objSearch.ProductRangeFilter ?? (object)DBNull.Value);
            SqlParameter seasonal = new SqlParameter("@Seasonal", objSearch.Seasonal);

            var results = this.Database.SqlQuery<OrderEntryProductSearchResult>(@"portal.OrderEntry_Product_Search 
                @TradeAccountID, 
                @ProductTypeGroupID,
                @SearchTerm,
                @ProductTypeID,
                @BrandID,
                @CollectionID,
                @QualityID,
                @ProductID,
                @CodeLike,
                @CodeNotLike,
                @Filter,
                @Seasonal", 
                tradeAccountId, 
                productTypeGroupId,
                searchTerm,
                productTypeId,
                brandId,
                collectionId,
                qualityId,
                productId,
                codeLike,
                codeNotLike,
                filter,
                seasonal
            ).ToList();

            return results;
        }
        
        internal List<ProductRangeButton> ProductRangeButton_Select(string filter)
        {
            SqlParameter filterParam = new SqlParameter("@Filter", filter ?? (object)DBNull.Value);
            
            var results = this.Database.SqlQuery<ProductRangeButton>(@"portal.ProductRange_Select @Filter",
                filterParam
            ).ToList();

            return results;
        }
    }
}