from typing import *

def extracInfo(original_infos: Dict) -> Dict:
    result = {}
    key_list = ['logo', 'name', 'ticker', 'exchange', 'ipo', 'finnhubIndustry']
    for key in key_list:
        result[key] = original_infos[key]
    return result