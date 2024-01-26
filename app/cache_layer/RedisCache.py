from redis import Redis
import os
from app.cache_layer.BaseCacheInterface import BaseCacheInterface
from app.cache_layer.DataTypes import DataType
from typing import Optional, Iterable
import json


class RedisCache(BaseCacheInterface):
    def __init__(self):
        self._redis: Redis = self._create_redis_instance()

    def _create_redis_instance(self):
        url = os.environ.get("REDIS_HOST", "redis")
        if url == "redis":
            return Redis(host="redis", port=6379, decode_responses=True)
        else:
            return Redis.from_url(url, decode_responses=True)

    def set(self, key, value, expiration=None, jsonify=False):
        if jsonify:
            value = json.dumps(value, default=str)
        if isinstance(value, dict):
            self._redis.hset(key, mapping=value)
        elif isinstance(value, set):
            self._redis.sadd(key, *value)
        elif isinstance(value, list):
            self._redis.lpush(key, *value)
        else:
            # May as well only make one call when we can
            if expiration:
                self._redis.setex(key, expiration, value)
            else:
                self._redis.set(key, value)

        if isinstance(value, (dict, set, list)):
            if expiration:
                self._redis.expire(key, expiration)

    def get(self, key, type_=DataType.DEFAULT):
        if type_ == DataType.DICT:
            return self._redis.hgetall(key)
        elif type_ == DataType.SET:
            return self._redis.smembers(key)
        elif type_ == DataType.LIST:
            return self._redis.lrange(key, 0, -1)
        elif type_ == DataType.JSON:
            rv = self._redis.get(key)
            if rv is not None:
                rv = json.loads(rv)
            return rv
        else:
            return self._redis.get(key)

    def bulk_get(
        self,
        *,
        keys: Iterable[str],
        prepend_key_with: str = "",
        hash_keys: bool = False,
        command=None,
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

    def delete(self, key, field=None):
        if field is not None:
            return self._redis.hdel(key, field)
        else:
            return self._redis.delete(key)

    def add_channel_metadata(self, channel_id: int, channel_info: dict) -> None:
        self._redis.hset(f"channel:{channel_id}", mapping=channel_info)

    def get_channel(self, channel_id: int) -> Optional[dict]:
        pass

    def invalidate_channel(self, channel_id: int) -> None:
        pass

    def user_active_sessions_quantity(self, user_key) -> int:
        return self._redis.hlen(user_key)
