from typing import *

def extracInfo(original_infos: Dict, updated_infos: Dict, key_list: List):
    for key in key_list:
        updated_infos[key] = original_infos[key]