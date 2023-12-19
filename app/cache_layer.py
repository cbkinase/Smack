import os
from redis import Redis
from redis.exceptions import RedisError
from typing import Optional, Type
from flask import current_app, Flask
from abc import ABC, abstractmethod


class GenericCacheInterface(ABC):
    @abstractmethod
    def set(self, key, value):
        raise NotImplementedError


    @abstractmethod
    def get(self, key):
        raise NotImplementedError


    @abstractmethod
    def delete(self, key):
        raise NotImplementedError


    @abstractmethod
    def add_channel_messages(self, channel_id: int, channel_info: dict) -> None:
        raise NotImplementedError


    @abstractmethod
    def add_channel_metadata(self, channel_id: int, channel_info: dict) -> None:
        raise NotImplementedError


    @abstractmethod
    def get_channel(self, channel_id: int) -> Optional[dict]:
        raise NotImplementedError


    @abstractmethod
    def invalidate_channel(self, channel_id: int) -> None:
        raise NotImplementedError


class RedisCache(GenericCacheInterface):
    def __init__(self):
        self._redis = self._create_redis_instance()

    def _create_redis_instance(self):
        url = os.environ.get("REDIS_HOST", "redis")
        if url == "redis":
            return Redis(host="redis", port=6379, decode_responses=True)
        else:
            return Redis.from_url(url, decode_responses=True)


    def set(self, key, value):
        pass


    def get(self, key):
        pass


    def delete(self, key):
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
                self._implementation = RedisCache
            else:
                raise ValueError("Invalid cache strategy provided in app config")


    def set(self, key, value):
        return self._cache_instance.set(key, value)


    def get(self, key):
        return self._cache_instance.get(key)


    def delete(self, key):
        return self._cache_instance.delete(key)


    def add_channel_messages(self, channel_id: int, channel_info: dict) -> None:
        return self._cache_instance.add_channel_messages(channel_id, channel_info)


    def add_channel_metadata(self, channel_id: int, channel_info: dict) -> None:
        return self._cache_instance.add_channel_metadata(channel_id, channel_info)


    def get_channel(self, channel_id: int):
        return self._cache_instance.get_channel(channel_id)


    def invalidate_channel(self, channel_id: int) -> None:
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
