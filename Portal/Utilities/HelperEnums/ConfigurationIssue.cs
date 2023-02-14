using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Utilities.HelperEnums
{
    public enum AccountConfigurationIssue
    {
        NoTradeAccount = 47
    }

    public static class AccountConfigurationEnumHelper
    {
        public static string FetchText(AccountConfigurationIssue issue)
        {
            string result = "";

            switch((int)issue)
            {
                case 47:
                    result = "No trade account is associated with your login.";
                    break;

                default:
                    break;
            }

            return result;
        }
    }
}