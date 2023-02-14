using Newtonsoft.Json.Linq;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;

namespace SharedEFClasses.Utilities.NewtonsoftExtensions
{
    // adapted from with thanks https://stackoverflow.com/questions/54177982/deep-find-or-search-the-key-at-any-level-in-json-and-replace-its-value-in-c-shar
    public static class JsonExtensions
    {
        public static JToken FindAndReplace(this JToken obj, string key, JToken value, int? occurence = null)
        {
            var searchedTokens = obj.FindTokens(key);
            int count = searchedTokens.Count;

            if (count == 0)
                return $"The key you have to search is not present in json, Key: {key}";

            foreach (JToken token in searchedTokens)
            {
                if (!occurence.HasValue)
                    obj.SetByPath(token.Path, value);
                else 
                if (occurence.Value == searchedTokens.IndexOf(token))
                    obj.SetByPath(token.Path, value);
            }

            return obj;
        }

        public static JToken FindAndReplace(this JToken obj, string key, Func<string, JToken> processingFunction, int? occurence = null)
        {
            var searchedTokens = obj.FindTokens(key, !occurence.HasValue);
            var count = searchedTokens.Count;

            if (count == 0)
                return $"The key you have to search is not present in json, Key: {key}";

            foreach (JToken token in searchedTokens)
            {
                if (!occurence.HasValue)
                {
                    if (token.Type != JTokenType.Null)
                    {
                        obj.SetByPath(token.Path, processingFunction(token.Value<string>()));
                    }
                }
                else
                {
                    if (token.Type != JTokenType.Null)
                    {
                        if (occurence.Value == searchedTokens.IndexOf(token))
                        {
                            obj.SetByPath(token.Path, processingFunction(token.Value<string>()));
                        }
                    }
                }
            }

            return obj;
        }

        public static void SetByPath(this JToken obj, string path, JToken value)
        {
            JToken token = obj.SelectToken(path);
            token.Replace(value);
        }

        public static List<JToken> FindTokens(this JToken containerToken, string name, bool includeNulls = true)
        {
            List<JToken> matches = new List<JToken>();
            FindTokens(containerToken, name, includeNulls, matches);
            return matches;
        }

        private static void FindTokens(JToken containerToken, string name, bool includeNulls, List<JToken> matches)
        {
            if (containerToken.Type == JTokenType.Object)
            {
                foreach (JProperty child in containerToken.Children<JProperty>())
                {
                    if (child.Name == name && (includeNulls ? true : child.Value.Type != JTokenType.Null))
                    {
                        matches.Add(child.Value);
                    }
                    FindTokens(child.Value, name, includeNulls, matches);
                }
            }
            else if (containerToken.Type == JTokenType.Array)
            {
                foreach (JToken child in containerToken.Children())
                {
                    FindTokens(child, name, includeNulls, matches);
                }
            }
        }
    }
}