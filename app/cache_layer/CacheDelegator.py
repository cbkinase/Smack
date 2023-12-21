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

    def set(self, key, value, **kwargs):
        return self._cache_instance.set(key, value, **kwargs)

    def get(self, key, **kwargs):
        return self._cache_instance.get(key, **kwargs)

    def bulk_get(self, *args, **kwargs):
        return self._cache_instance.bulk_get(*args, **kwargs)

    def delete(self, key, field=None):
        return self._cache_instance.delete(key, field)

    def add_channel_messages(self, channel_id: int, channel_info: dict) -> None:
        return self._cache_instance.add_channel_messages(channel_id, channel_info)

    def add_channel_metadata(self, channel_id: int, channel_info: dict) -> None:
        return self._cache_instance.add_channel_metadata(channel_id, channel_info)

    def get_channel(self, channel_id: int):
        return self._cache_instance.get_channel(channel_id)

    def invalidate_channel(self, channel_id: int) -> None:
        return self._cache_instance.invalidate_channel(channel_id)

    def user_active_sessions_quantity(self, user_key: str) -> bool:
        return self._cache_instance.user_active_sessions_quantity(user_key)
