using Portal.Models;
using SharedEFClasses.Models.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.ViewModels.ComponentModels
{
    public class MemberSearchViewModel
    {
        public int? TradeAccountGroupID { get; set; }
        public int? TradeAccountID { get; set; }
        public string ButtonCssOverride { get; set; }
        public string ClientObjectName { get; set; }
        public bool ShowClearButton { get; set; }
        public string ValidationElement { get; set; }
        public List<KeyValuePair<string, ClientSideMember>> ExtraProperties { get; set; }
        public List<ClientSideMember> RecentlyUsedMembers { get; set; }

        public MemberSearchViewModel(
            int? _tradeAccountGroupId, 
            int? _tradeAccountId, 
            string _buttonCssOverride,
            string _clientObjectName,
            bool _showClearButton,
            string _validationElement,
            List<KeyValuePair<string, ClientSideMember>> _extraProperties,
            List<ClientSideMember> _recentlyUsedMembers
            )
        {
            TradeAccountGroupID = _tradeAccountGroupId;
            TradeAccountID = _tradeAccountId;
            ButtonCssOverride = _buttonCssOverride;
            ClientObjectName = _clientObjectName;
            ExtraProperties = _extraProperties;
            RecentlyUsedMembers = _recentlyUsedMembers;
            ShowClearButton = _showClearButton;
            ValidationElement = _validationElement;
        }
    }
}