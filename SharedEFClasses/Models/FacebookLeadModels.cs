using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SharedEFClasses.Models.FBLeads
{
    public class FBLeadGen
    {
        public List<FBLeadEntry> entry { get; set; }
        public string @object { get; set; }

        public override string ToString()
        {
            var entriesString = "";

            entry.ForEach(c => entriesString += c.ToString());

            return $"\r\nobject: {@object}\r\nentries: [{entriesString}\r\n]\r\n";
        }
    }

    public class FBLeadEntry
    {
        public List<FBLeadChange> changes { get; set; }
        public string id { get; set; }
        public long time { get; set; }

        public override string ToString()
        {
            var changesString = "";

            changes.ForEach(c => changesString += c.ToString());

            return $"\r\n\tid: {id}\r\n\ttime: {time}\r\n\tchanges: [{changesString}\r\n\t]";
        }
    }

    public class FBLeadChange
    {
        public string field { get; set; }

        public FBLeadValue value { get; set; }

        public override string ToString()
        {
            return $"\r\n\t\tfield: {field}\r\n\t\tvalue: {value}";
        }
    }

    public class FBLeadValue
    {
        public long created_time { get; set; }
        public string page_id { get; set; }
        public string form_id { get; set; }
        public string leadgen_id { get; set; }

        public override string ToString()
        {
            return $"\r\n\t\t\tcreated_time: {created_time}\r\n\t\t\tpage_id: {page_id}\r\n\t\t\tform_id: {form_id}\r\n\t\t\tleadgen_id: {leadgen_id}";
        }
    }

    public class FBLeadData
    {
        public DateTime created_time { get; set; }
        public string id { get; set; }
        public List<FBLeadKVP> field_data { get; set; }

        public override string ToString()
        {
            var fieldDataString = "";

            field_data.ForEach(c => fieldDataString += c.ToString());

            return $"\r\nid: {id}\r\ncreated_time: {created_time}\r\nfield_data: [{fieldDataString}\r\n]\r\n";
        }
    }

    public class FBLeadKVP
    {
        public string name { get; set; }
        public List<string> values { get; set; }

        public override string ToString()
        {
            var valuesString = "";

            values.ForEach(c => valuesString += $"\r\n\t\t{c}");

            return $"\r\n\tname: {name}\r\n\tvalues: [{valuesString}\r\n\t]";
        }
    }
}