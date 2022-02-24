from typing import *
from datetime import datetime

def extractInfo(original_infos: Dict, updated_infos: Dict, key_list: List):
    for key in key_list:
        updated_infos[key] = original_infos[key]

def isValidNews(news: Dict)  -> bool:
    check_keys = ['image', 'url', 'headline', 'datetime']
    for key in check_keys:
        if key not in news:
            return False
        elif isinstance(news[key], str) and len(news[key]) <= 0:
            return False
        elif isinstance(news[key], int) and news[key] <= 0:
            return False
    return True

def extractNews(news_list: List, infos: Dict):
    selected_news = []
    num = 0
    for news in news_list:
        if isValidNews(news):
            date_time = datetime.fromtimestamp(news['datetime'])
            news['datetime'] = date_time.strftime('%d %B, %Y')
            keys_list = ['image', 'url', 'headline', 'datetime']
            news_filtered = {}
            extractInfo(news, news_filtered, keys_list)
            selected_news.append(news_filtered)
            num += 1
            if num >= 5:
                break
    infos['news_list'] = selected_news