from app.cache_layer.CacheDelegator import Cache

### Exported interface

cache = Cache()

###############################################################################
###                             CACHE DOCUMENTATION                         ###
###############################################################################


## Example of using it in a Flask app.
## Assuming app and your config is already defined
## Currently, only `CACHE_IMPLEMENTATION = "redis"` in config is supported.

## --------------
## Initializing |
## --------------

# cache = Cache()
# cache.init_app(app)


## ------------------------------------------------------
## Getting, setting, and deleting basic key:value pairs |
## ------------------------------------------------------

# cache.set("1", "hello")
# print(cache.get("1"))                         # --> "hello"
# cache.delete("1")
# print(cache.get("1"))                         # --> None


## ----------------------------------------------------------------------------
## Getting, setting, and deleting key:value pairs where the values are hashes |
## ----------------------------------------------------------------------------

# cache.set("1", {"py": "Python", "js": "JavaScript"})
# print(cache.get("1", type_=dict))          # --> {"py": "Python", "js": "JavaScript"}
# cache.delete("1", field="js")
# print(cache.get("1", type_=dict))          # --> {"py": "Python"}


## -------------------------------------------------
## Register an expensive function call for caching |
## -------------------------------------------------

# @cache.register(timeout=60, return_type=int)  # 60 second cache
# def expensive_func(some_param: int):
#     time.sleep(10)
#     print(f"Ran expensive_func with {some_param}")
#     return 5 + some_param

# r = expensive_func(1)         # --> prints "Ran expensive func with 1"
# print(r)                      # --> 6
# (within timeout period...)
# b = expensive_func(1)         # Nothing is printed since the cached result is used
# print(b)                      # ---> 6


## ---------------------------------------------------
## To register a function with request.args included |
## ---------------------------------------------------

# @app.route("/")
# @cache.register(timeout=60, return_type=str, include_request=True)
# def home():
#     time.sleep(10)
#     return "hello"
