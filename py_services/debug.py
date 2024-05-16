import json
import pandas as pd
import sqlalchemy as sa
import clickhouse_connect
import time
from datetime import datetime, timedelta
import requests

now = datetime.now()
new_time = datetime(now.year, now.month, now.day, now.hour, 0, 0)
new_time1 = new_time - timedelta(hours=1)

print(new_time)
print(new_time1)
print(new_time1.hour)

abc = datetime.strptime('2024-05-16 22:00:00', '%Y-%m-%d %H:%M:%S')
print(abc)

