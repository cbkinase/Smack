import os
from redis import Redis
from redis.exceptions import RedisError
from typing import Optional, Type
from flask import current_app, Flask


class GenericCacheInterface:
    def set(self, key, value):
        raise NotImplementedError


    def get(self, key):
        raise NotImplementedError


    def add_channel_messages(self, channel_id: int, channel_info: dict) -> None:
        raise NotImplementedError


    def add_channel_metadata(self, channel_id: int, channel_info: dict) -> None:
        raise NotImplementedError


    def get_channel(self, channel_id: int) -> Optional[dict]:
        raise NotImplementedError


    def invalidate_channel(self, channel_id: int) -> None:
        raise NotImplementedError


class RedisCache(GenericCacheInterface):
    def __init__(self):
        self._url = os.environ.get("REDIS_HOST")

        if self._url is None or self._url == "redis":
            self._redis = Redis(host="redis", port=6379, decode_responses=True)
        else:
            self._redis = Redis.from_url(self._url, decode_responses=True)


    def set(self, key, value):
        pass


    def get(self, key):
        pass


    def add_channel_messages(self, channel_id: int, channel_info: dict) -> None:
        pass


    def add_channel_metadata(self, channel_id: int, channel_info: dict) -> None:
        pass


    def get_channel(self, channel_id: int) -> Optional[dict]:
        pass


    def invalidate_channel(self, channel_id: int) -> None:
        pass


class Cache(GenericCacheInterface):
    def __init__(self):
        self._cache_instance: Type[GenericCacheInterface] = None


    def init_app(self, app: Flask):
        with app.app_context():
            if current_app.config["CACHE_IMPLEMENTATION"] == "redis":
                self._cache_instance = RedisCache()
            else:
                raise ValueError("Invalid cache strategy provided in app config")

    def set(self, key, value):
        return self._cache_instance.set(key, value)


    def get(self, key):
        return self._cache_instance.get(key)


    def add_channel_messages(self, channel_id: int, channel_info: dict) -> None:
        return self._cache_instance.add_channel_messages(channel_id, channel_info)


    def add_channel_metadata(self, channel_id: int, channel_info: dict) -> None:
        return self._cache_instance.add_channel_metadata(channel_id, channel_info)


    def get_channel(self, channel_id: int):
        return self._cache_instance.get_channel(channel_id)


    def invalidate_channel(self, channel_id: int) -> None:
        """Completely clears the cache entry for the given channel ID"""
        return self._cache_instance.invalidate_channel(channel_id)


###############################################################################
###                             CACHE DOCUMENTATION                         ###
###############################################################################

if __name__ == "__main__":
    # Example of direct usage:
    cache = RedisCache()

    # Adding channel info to the cache
    cache.add_channel_metadata("channel123", {"name": "General", "members": ["user1", "user2"]})

    # Retrieving channel info from the cache
    channel_info = cache.get_channel("channel123")

    # Invalidating the cache for a specific channel
    cache.invalidate_channel("channel123")

    ## In a Flask app, you'd use it like this
    ## Assuming app is already defined
    # cache = Cache()
    # cache.init_app(app)
