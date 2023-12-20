from abc import ABC, abstractmethod
from typing import Optional


class BaseCacheInterface(ABC):
    @abstractmethod
    def set(self, key, value):
        raise NotImplementedError

    @abstractmethod
    def get(self, key):
        raise NotImplementedError

    # @abstractmethod
    # def bulk_get(self, *args, **kwargs):
    #     raise NotImplementedError

    @abstractmethod
    def delete(self, key):
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
