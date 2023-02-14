using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Caching;
using System.Configuration;
using SharedEFClasses.Models;

namespace SharedEFClasses.Utilities
{
    public class ResourcesList
    {
        public List<ResourceSelect> ResourceSelects { get; set; }

        public string this [string key]
        {
            get
            {
                return ResourceSelects.Where(p => p.Name == key).Select(p => p.Value).SingleOrDefault();
            }
        }
    }

    public class ResourceFetcher
    {
        public async Task<ResourcesList> loadResources(byte languageId)
        {
            // Is page in cache?
            ResourcesList resourceStore = new ResourcesList();
            ResourceCacheProvider objResourceCache = new ResourceCacheProvider();
            resourceStore.ResourceSelects = objResourceCache.Get(languageId);

            if (resourceStore.ResourceSelects == null)
            {
                resourceStore = await System.Threading.Tasks.Task.FromResult<ResourcesList>(loadResourcesDatabase(languageId));
                objResourceCache.Set(languageId, resourceStore.ResourceSelects);
            }

            return resourceStore;
        }

        private ResourcesList loadResourcesDatabase(byte languageId)
        {
            var dataContext = new PortalDbContext();

            var resources = dataContext.Resource_Select(languageId);

            var resourceStore = new ResourcesList();
            resourceStore.ResourceSelects = resources;

            return resourceStore;
        }
    }

    public class ResourceCacheProvider
    {
        private ObjectCache Cache { get { return MemoryCache.Default; } }

        public List<ResourceSelect> Get(byte languageId)
        {
            String key = buildKey(languageId);
            return (List<ResourceSelect>)Cache[key];
        }
        
        public void Set(byte languageId, List<ResourceSelect> data)
        {
            var cacheEnabled = true;

            short cacheDurationMinutes = -1;

            Boolean.TryParse(ConfigurationManager.AppSettings["resourceCacheEnabled"], out cacheEnabled);

            if (cacheEnabled)
            {
                var policy = new CacheItemPolicy();

                if (Int16.TryParse(ConfigurationManager.AppSettings["resourceCacheDuration"], out cacheDurationMinutes))
                {
                    policy.AbsoluteExpiration = DateTime.Now + TimeSpan.FromMinutes(cacheDurationMinutes);
                }
                else
                {
                    policy.AbsoluteExpiration = DateTime.Today.AddDays(1).Date;
                }

                var key = buildKey(languageId);

                Cache.Add(new CacheItem(key, data), policy);
            }
        }


        public bool IsSet(byte languageId)
        {
            String key = buildKey(languageId);
            return (Cache[key] != null);
        }


        public void Invalidate(byte languageId)
        {
            String key = buildKey(languageId);
            Cache.Remove(key);
        }


        private string buildKey(byte languageId)
        {
            return $"RESOURCES~{languageId}";
        }
    }
}