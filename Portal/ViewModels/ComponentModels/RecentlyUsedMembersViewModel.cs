using Portal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SharedEFClasses.Models;

namespace Portal.ViewModels.ComponentModels
{
    public class RecentlyUsedMembersViewModel
    {
        public List<Member> RecentlyUsedMembers { get; set; }
        public string ButtonCssOverride { get; set; }

        public RecentlyUsedMembersViewModel(
            List<Member> _recentlyUsedMembers,
            string _buttonCssOverride)
        {
            this.RecentlyUsedMembers = _recentlyUsedMembers;
            this.ButtonCssOverride = _buttonCssOverride;
        }
    }
}