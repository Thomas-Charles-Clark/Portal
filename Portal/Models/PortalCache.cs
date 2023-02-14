using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Caching;

namespace Portal.Models
{
    public class PortalCache<T>
    {
        private ObjectCache Cache { get { return MemoryCache.Default; } }

        private string identifier { get; set; }

        public PortalCache(string identifier)
        {
            this.identifier = identifier;
        }

        public T Get(DateTime date)
        {
            String key = buildKey(date);
            return (T)Cache[key];
        }


        public void Set(DateTime date, T data, Int16 CacheTimeMinutes)
        {
            CacheItemPolicy policy = new CacheItemPolicy();
            policy.AbsoluteExpiration = DateTime.Now + TimeSpan.FromMinutes(CacheTimeMinutes);

            String key = buildKey(date);
            Cache.Add(new CacheItem(key, data), policy);
        }


        public bool IsSet(DateTime date)
        {
            String key = buildKey(date);
            return (Cache[key] != null);
        }


        public void Invalidate(DateTime date)
        {
            String key = buildKey(date);
            Cache.Remove(key);
        }


        private string buildKey(DateTime date)
        {
            return String.Format("{0}-{1}", identifier, date.ToString("dd-MM-yyyy"));
        }

    }
}