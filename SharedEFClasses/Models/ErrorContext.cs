using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace SharedEFClasses.Models.ErrorContext
{
    public class ErrorDbContext : DbContext
    {
        public ErrorDbContext()
            : base("VM-SQL1")
        {
        }

        static ErrorDbContext()
        {
            System.Data.Entity.Database.SetInitializer<ErrorDbContext>(new CreateDatabaseIfNotExists<ErrorDbContext>());
        }
        
        public void SaveToErrorLog(
            int _memberId, 
            string _exceptionType, 
            string _exceptionMessage, 
            string _exceptionSource, 
            string _stackTrace, 
            string _innerExceptionType, 
            string _innerExceptionMessage, 
            string _innerExceptionSource, 
            string _innerExceptionStackTrace, 
            string _urlOfPage, 
            string _userAgent, 
            string _ipAddress)
        {
            try
            {
                SqlParameter visitorId = new SqlParameter("@VisitorID", DBNull.Value);
                SqlParameter errorDt = new SqlParameter("@ErrorDT", DateTime.Now);
                SqlParameter memberId = new SqlParameter("@MemberID", _memberId);
                SqlParameter exceptionType = new SqlParameter("@ExceptionType", _exceptionType ?? (object)DBNull.Value);
                SqlParameter exceptionMessage = new SqlParameter("@ExceptionMessage", _exceptionMessage ?? (object)DBNull.Value);
                SqlParameter exceptionSource = new SqlParameter("@ExceptionSource", _exceptionSource ?? (object)DBNull.Value);
                SqlParameter stackTrace = new SqlParameter("@StackTrace", _stackTrace ?? (object)DBNull.Value);
                SqlParameter innerExceptionType = new SqlParameter("@InnerExceptionType", _innerExceptionType ?? (object)DBNull.Value);
                SqlParameter innerExceptionMessage = new SqlParameter("@InnerExceptionMessage", _innerExceptionMessage ?? (object)DBNull.Value);
                SqlParameter innerExceptionSource = new SqlParameter("@InnerExceptionSource", _innerExceptionSource ?? (object)DBNull.Value);
                SqlParameter innerExceptionStackTrace = new SqlParameter("@InnerExceptionStackTrace", _innerExceptionStackTrace ?? (object)DBNull.Value);
                SqlParameter urlOfPage = new SqlParameter("@UrlOfPage", _urlOfPage ?? (object)DBNull.Value);
                SqlParameter userAgent = new SqlParameter("@UserAgent", _userAgent ?? (object)DBNull.Value);
                SqlParameter ipAddress = new SqlParameter("@IP", _ipAddress ?? (object)DBNull.Value);
                SqlParameter platformSwitch = new SqlParameter("@PlatformSwitch", (byte)2);

                var results = this.Database.ExecuteSqlCommand(@"pub.LogError @VisitorID, @ErrorDT, @ExceptionType, @ExceptionMessage, @ExceptionSource, 
                                                                @StackTrace, @InnerExceptionType, @InnerExceptionMessage, @InnerExceptionSource, 
                                                                @InnerExceptionStackTrace, @UrlOfPage, @UserAgent, @IP, @PlatformSwitch, @MemberID",
                                                                    visitorId,
                                                                    errorDt,
                                                                    exceptionType,
                                                                    exceptionMessage,
                                                                    exceptionSource,
                                                                    stackTrace,
                                                                    innerExceptionType,
                                                                    innerExceptionMessage,
                                                                    innerExceptionSource,
                                                                    innerExceptionStackTrace,
                                                                    urlOfPage,
                                                                    userAgent,
                                                                    ipAddress,
                                                                    platformSwitch,
                                                                    memberId);
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return;
        }
    }
}