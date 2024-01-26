from enum import Enum


class DataType(Enum):
    DICT = dict
    SET = set
    LIST = list
    JSON = "json"
    DEFAULT = "default"
