from flask import current_app, Flask
from app.cache_layer.BaseCacheInterface import BaseCacheInterface
from app.cache_layer.RedisCache import RedisCache


class Cache(BaseCacheInterface):
    def __init__(self):
        self._cache_instance: BaseCacheInterface = None

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

    def bulk_get(self, *args, **kwargs):
        return self._cache_instance.bulk_get(*args, **kwargs)

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
