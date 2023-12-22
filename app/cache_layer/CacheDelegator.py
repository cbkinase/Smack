from flask import current_app, Flask, request
from app.cache_layer.BaseCacheInterface import BaseCacheInterface
from app.cache_layer.RedisCache import RedisCache
from functools import wraps


class Cache(BaseCacheInterface):
    def __init__(self):
        self._cache_instance: BaseCacheInterface = None

    def init_app(self, app: Flask):
        with app.app_context():
            if current_app.config["CACHE_IMPLEMENTATION"] == "redis":
                self._cache_instance = RedisCache()
            else:
                raise ValueError("Invalid cache strategy provided in app config")

    def set(self, key, value, **kwargs):
        return self._cache_instance.set(key, value, **kwargs)

    def get(self, key, type_=str):
        return self._cache_instance.get(key, type_)

    def bulk_get(self, *args, **kwargs):
        return self._cache_instance.bulk_get(*args, **kwargs)

    def delete(self, key, field=None):
        return self._cache_instance.delete(key, field)

    def add_channel_metadata(self, channel_id: int, channel_info: dict) -> None:
        return self._cache_instance.add_channel_metadata(channel_id, channel_info)

    def get_channel(self, channel_id: int):
        return self._cache_instance.get_channel(channel_id)

    def invalidate_channel(self, channel_id: int) -> None:
        return self._cache_instance.invalidate_channel(channel_id)

    def user_active_sessions_quantity(self, user_key) -> int:
        return self._cache_instance.user_active_sessions_quantity(user_key)

    def register(self, timeout, return_type, include_request=False):
        def decorator(fn):
            @wraps(fn)
            def wrapped(*args, **kwargs):
                # Check if the cache is initialized
                if self._cache_instance:
                    cache_key = make_cache_key(fn, include_request, *args, **kwargs)
                    result = self._cache_instance.get(cache_key, type_=return_type)

                    # TODO: handle when cache.get() actually returns empty/None
                    if result:
                        return result
                    result = fn(*args, **kwargs)
                    try:
                        self._cache_instance.set(cache_key, result, expiration=timeout)
                    except:  # noqa E722
                        # TODO: serialization/deserialization
                        pass
                    return result
                else:
                    # If cache is not ready (i.e. app not yet initialized),
                    # Just call the function without caching
                    return fn(*args, **kwargs)

            return wrapped

        return decorator


def make_cache_key(fn, include_request=False, *args, **kwargs):
    module = fn.__module__
    fn_name = fn.__name__

    parts = [module, fn_name]

    if args:
        args_str = ":".join(map(str, args))
        parts.append(args_str)

    if kwargs:
        kwargs_str = ":".join(f"{k}={v}" for k, v in kwargs.items())
        parts.append(kwargs_str)

    if include_request and request:
        request_args_str = ":".join(f"{k}={v}" for k, v in request.args.items())
        parts.append(request_args_str)

    key = ":".join(parts)
    return key
