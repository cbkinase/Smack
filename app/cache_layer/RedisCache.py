from redis import Redis
import os
from app.cache_layer.BaseCacheInterface import BaseCacheInterface
from typing import Optional, Iterable


class RedisCache(BaseCacheInterface):
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

    def bulk_get(
        self,
        *,
        keys: Iterable[str],
        prepend_key_with: str = "",
        hash_keys: bool = False,
        command=str,
    ):
        pipeline = self._redis.pipeline()
        for key in keys:
            full_key = f"{prepend_key_with}{key}"

            if command:
                if callable(command):
                    pipeline = command(pipeline, full_key)
                # If command is a string, dynamically call the method on pipeline
                else:
                    getattr(pipeline, command)(full_key)
            else:
                # Default behavior based on hash_keys
                if hash_keys:
                    pipeline.hgetall(full_key)
                else:
                    pipeline.get(full_key)

        results = pipeline.execute()
        return results

    def delete(self, key):
        pass

    def add_channel_metadata(self, channel_id: int, channel_info: dict) -> None:
        pass

    def get_channel(self, channel_id: int) -> Optional[dict]:
        pass

    def invalidate_channel(self, channel_id: int) -> None:
        pass
