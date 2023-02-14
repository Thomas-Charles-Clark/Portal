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
        public ProductPageInfoReturn ProductPage_LoadInfo(int _productPageId, byte _languageId, DateTime _date)
        {
            ProductPageInfoReturn result = new ProductPageInfoReturn();

            SqlParameter productPageId = new SqlParameter("@ProductPageID", _productPageId);
            SqlParameter languageId = new SqlParameter("@LanguageID", _languageId);
            SqlParameter date = new SqlParameter("@Date", _date);

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[ProductPage_Info_Select_Samples]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add(productPageId);
            cmd.Parameters.Add(languageId);
            cmd.Parameters.Add(date);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.Description = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<string>(reader).SingleOrDefault();

                reader.NextResult();

                result.Collections = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductPageCollection>(reader).ToList();

                reader.NextResult();

                result.TechInfoCore = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductPageTechInfoCore>(reader).SingleOrDefault();

                reader.NextResult();

                result.TechInfoTests = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductPageTechInfoTest>(reader).ToList();

                reader.NextResult();

                result.TechInfoAftercares = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductPageTechInfoAftercare>(reader).ToList();

                reader.NextResult();

                result.TechInfoUsages = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductPageTechInfoUsage>(reader).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }

        public Int32? SampleOrder_Submit(int userId, SampleOrder objOrder)
        {
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[SampleTransaction_Generate]";

            try
            {
                int? result = -1;

                DataSet ds = new DataSet();

                DataTable DeliveryAddress = new DataTable();
                DeliveryAddress.Columns.Add("FullName", typeof(string));
                DeliveryAddress.Columns.Add("CompanyName", typeof(string));
                DeliveryAddress.Columns.Add("AddressLine1", typeof(string));
                DeliveryAddress.Columns.Add("AddressLine2", typeof(string));
                DeliveryAddress.Columns.Add("Town", typeof(string));
                DeliveryAddress.Columns.Add("County", typeof(string));
                DeliveryAddress.Columns.Add("Postcode", typeof(string));
                DeliveryAddress.Columns.Add("CountryID", typeof(short));
                DeliveryAddress.Columns.Add("PhoneNumber", typeof(string));

                DeliveryAddress.Rows.Add(
                    objOrder.Address.Name,
                    null,
                    objOrder.Address.AddressLine1,
                    objOrder.Address.AddressLine2,
                    objOrder.Address.AddressLine3,
                    objOrder.Address.AddressLine4,
                    objOrder.Address.Postcode,
                    objOrder.Address.Country.CountryID,
                    objOrder.Phone
                );

                DataTable Basket = new DataTable();
                Basket.Columns.Add("Code", typeof(string));
                Basket.Columns.Add("Quantity", typeof(short));
                Basket.Columns.Add("LineRef", typeof(string));
                Basket.Columns.Add("Discontinued", typeof(bool));
                Basket.Columns.Add("UnitPrice", typeof(decimal));

                for (var i = 0; i < objOrder.Basket.Count; i++)
                {
                    Basket.Rows.Add(
                        objOrder.Basket[i].Code,
                        objOrder.Basket[i].QuantityTotal,
                        objOrder.Basket[i].LineRef,
                        objOrder.Basket[i].Status == "D" ? true : false,
                        objOrder.Basket[i].UnitPrice);
                }

                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter flockUserId = new SqlParameter("@FlockUserID", userId);
                SqlParameter mertexCustomerAccountNumber = new SqlParameter("@MertexCustomerAccountNumber", objOrder.TradeAccountCode);
                SqlParameter customerOrderReference = new SqlParameter("@CustomerOrderReference", objOrder.CustomerOrderReference);
                SqlParameter email = new SqlParameter("@Email", objOrder.Email);
                SqlParameter deliveryAddress = new SqlParameter("@DeliveryAddress", DeliveryAddress);
                SqlParameter haulCode = new SqlParameter("@HaulCode", objOrder.SelectedDespatchMethod.HAULCODE);
                SqlParameter carrCode = new SqlParameter("@CarrCode", objOrder.SelectedDespatchMethod.CARRCODE);

                SqlParameter customerPayingForDespatch = new SqlParameter("@CustomerPayingForDispatch", objOrder.CustomerPayingForDespatch);
                SqlParameter freeDispatchReason = new SqlParameter("@FreeDispatchReason", objOrder.FreeDespatchReason ?? (object)DBNull.Value);
                SqlParameter despatchPrice = new SqlParameter("@DispatchPrice", objOrder.DespatchPrice ?? (object)DBNull.Value);

                SqlParameter sampleBasket = new SqlParameter("@SampleBasket", Basket);
                SqlParameter orderHeadId = new SqlParameter("@OrderHeadID", result);
                SqlParameter customerWantsOrderConfirmation = new SqlParameter("@CustomerWantsOrderConfirmation", objOrder.SendConfirmationEmail);
                SqlParameter languageId = new SqlParameter("@LanguageID", objOrder.SelectedOrderConfirmationLanguage);
                SqlParameter orderTaker = new SqlParameter("@OrderTaker", objOrder.OrderTaker?.Code);
                SqlParameter contactPreference = new SqlParameter("@CustomerContactPreference", objOrder.ContactPreference);
                SqlParameter customEmailText = new SqlParameter("@CustomEmailText", objOrder.ExtraConfirmationText);

                SqlParameter orderValue = new SqlParameter("@OrderValue", objOrder.OrderValue ?? (object)DBNull.Value);

                deliveryAddress.SqlDbType = SqlDbType.Structured;
                deliveryAddress.TypeName = "adm.AddressTableType";

                sampleBasket.SqlDbType = SqlDbType.Structured;
                sampleBasket.TypeName = "adm.SampleBasketTableType2";

                orderHeadId.Direction = ParameterDirection.Output;

                cmd.Parameters.Add(flockUserId);
                cmd.Parameters.Add(mertexCustomerAccountNumber);
                cmd.Parameters.Add(customerOrderReference);
                cmd.Parameters.Add(email);
                cmd.Parameters.Add(deliveryAddress);
                cmd.Parameters.Add(haulCode);
                cmd.Parameters.Add(carrCode);
                cmd.Parameters.Add(customerPayingForDespatch);
                cmd.Parameters.Add(despatchPrice);
                cmd.Parameters.Add(freeDispatchReason);
                cmd.Parameters.Add(sampleBasket);
                cmd.Parameters.Add(orderHeadId);
                cmd.Parameters.Add(customerWantsOrderConfirmation);
                cmd.Parameters.Add(languageId);
                cmd.Parameters.Add(orderTaker);
                cmd.Parameters.Add(contactPreference);
                cmd.Parameters.Add(customEmailText);
                cmd.Parameters.Add(orderValue);

                this.Database.Connection.Open();

                cmd.ExecuteNonQuery();

                this.Database.Connection.Close();

                result = cmd.Parameters["@OrderHeadID"].Value as int?;

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (this.Database.Connection.State == ConnectionState.Open)
                {
                    this.Database.Connection.Close();
                }
            }
        }
    }
}