from app.cache_layer.CacheDelegator import Cache

### Exported interface

cache = Cache()

###############################################################################
###                             CACHE DOCUMENTATION                         ###
###############################################################################

## Example of using it in a Flask app
## assuming app and your config is already defined

## Currently, only CACHE_IMPLEMENTATION = "redis" is supported


# cache = Cache()
# cache.init_app(app)

# cache.set("1", "hello")
# print(cache.get("1"))  # "hello"

# cache.set("1", {"hello": "world"})
# print(cache.get("1"))  # {"hello": "world"}
