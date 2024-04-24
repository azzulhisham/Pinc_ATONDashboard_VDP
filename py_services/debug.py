import json
import pandas as pd
import sqlalchemy as sa
import clickhouse_connect
import time
from datetime import datetime, timedelta

now = datetime.now()
today = datetime(now.year, now.month, now.day)
utc_now = now - timedelta(hours=8)
utc_n_day_b4 = utc_now - timedelta(hours=168)
utc_n_day_b4_x = utc_now - timedelta(hours=192)

client = clickhouse_connect.get_client(host='10.10.20.50', port=8123)
result = client.query(
f'''
    with 
        aton_static as (
            with rowcountdata as (
                select *, row_number() over (partition by mmsi order by ts desc) as rowcountby_mmsi
                from pnav.ais_type21
                where ts>='{utc_n_day_b4_x.strftime("%Y-%m-%d %H:%M:%S")}' and ts<'{utc_now.strftime("%Y-%m-%d %H:%M:%S")}' 
            )
            select *
            from rowcountdata
            where rowcountby_mmsi = 1
        ),
        aton_meas as (  
            with rowcountdata as (
                select *, row_number() over (partition by mmsi order by ts desc) as rowcountby_mmsi
                from pnav.ais_type6_533
                where ts>='{utc_n_day_b4.strftime("%Y-%m-%d %H:%M:%S")}' and ts<'{utc_now.strftime("%Y-%m-%d %H:%M:%S")}' 
            )
            select *
            from rowcountdata
            where rowcountby_mmsi = 1
        )
    select *
    from aton_meas aa
    join aton_static ss on aa.mmsi = ss.mmsi
'''
)

ret_result = []

for i in result.result_rows:
    data = {
        'ts': i[0].strftime("%Y-%m-%d %H:%M:%S"),
        'packageType': i[1],
        'packageID': i[2],
        'packageCh': i[3],
        'messageType': i[4],
        'messageTypeDesc': i[5],
        'repeat': i[6],
        'mmsi': i[7],
        'seqno': i[8],
        'dest_mmsi': i[9],
        'retransmit': i[10],
        'dac': i[11],
        'fid': i[12],
        'volt_int': i[13],
        'volt_ex1': i[14],
        'volt_ex2': i[15],
        'off_pos': i[16],
        'ambient': i[17],
        'racon': i[18],
        'light': i[19],
        'health': i[20],
        'beat': i[21],
        'alarm_active': i[22],
        'buoy_led_power': i[23],
        'buoy_low_vin': i[24],
        'buoy_photocell': i[25],
        'buoy_temp': i[26],
        'buoy_force_off': i[27],
        'buoy_islight': i[28],
        'buoy_errled_short': i[29],
        'buoy_errled_open': i[30],
        'buoy_errled_voltlow': i[31],
        'buoy_errled_vinlow': i[32],
        'buoy_errled_power': i[33],
        'buoy_adjmaxpower': i[34],
        'buoy_sensor_interrupt': i[35],
        'buoy_solarcharging': i[36],

        'ss_ts': i[38].strftime("%Y-%m-%d %H:%M:%S"),
        'ss_packageType': i[39],
        'ss_packageID': i[40],
        'ss_packageCh': i[41],
        'ss_messageType': i[42],
        'ss_messageTypeDesc': i[43],
        'ss_repeat': i[44],
        'ss_mmsi': i[45],
        'ss_aidType': i[46],
        'ss_aidTypeDesc': i[47],
        'ss_aidName': i[48],
        'ss_positionAccuracy': i[49],
        'ss_positionAccuracyDesc': i[50],
        'ss_longitude': i[51],
        'ss_latitude': i[52],
        'ss_to_bow': i[53],
        'ss_to_stern': i[54],
        'ss_to_port': i[55],
        'ss_to_starboard': i[56],
        'ss_epfd': i[57],
        'ss_epfdDesc': i[58],
        'ss_utc_second': i[59],
        'ss_off_position': i[60],
        'ss_regional': i[61],
        'ss_raimFlag': i[62],
        'ss_virtualAid': i[63],
        'ss_assigned': i[64]
    }

    ret_result.append(data)

    print(data)