from app.cache_layer.CacheDelegator import Cache

### Exported interface

cache = Cache()

###############################################################################
###                             CACHE DOCUMENTATION                         ###
###############################################################################


## Example of using it in a Flask app.
## Assuming app and your config is already defined
## Currently, only `CACHE_IMPLEMENTATION = "redis"` in config is supported.


## Initializing

# cache = Cache()
# cache.init_app(app)


## Getting, setting, and deleting basic key:value pairs

# cache.set("1", "hello")
# print(cache.get("1"))                         # --> "hello"
# cache.delete("1")
# print(cache.get("1"))                         # --> None


## Getting, setting, and deleting key:value pairs where the values are hashes

# cache.set("1", {"py": "Python", "js": "JavaScript"})
# print(cache.get("1", type_=dict))          # --> {"py": "Python", "js": "JavaScript"}
# cache.delete("1", field="js")
# print(cache.get("1", type_=dict))          # --> {"py": "Python"}
