
import json
import pandas as pd
import sqlalchemy as sa
import clickhouse_connect
import math
from datetime import datetime, timedelta


class PyCH:
    def get_init_msg_count():
        now = datetime.now()
        today = datetime(now.year, now.month, now.day)
        utc_today = today - timedelta(hours=8)
        utc_next_day = utc_today + timedelta(hours=24)


        try:
            # total sites
            client = clickhouse_connect.get_client(host='10.10.20.50', port=8123)
            result = client.query(
            f'''
                with rowcountdata as (
                    select *, row_number() over (partition by mmsi order by ts desc) as rowcountby_mmsi
                    from pnav.ais_type21
                    where ts>='{utc_today.strftime("%Y-%m-%d %H:%M:%S")}' and ts<'{utc_next_day.strftime("%Y-%m-%d %H:%M:%S")}' 
                )
                select count()
                from rowcountdata
                where rowcountby_mmsi = 1
            '''
            )

            aton_cnt = result.result_rows[0][0]       


            # total message received from station

            result = client.query(
            f'''
                with rowcountdata as (
                    select *, row_number() over (partition by mmsi order by ts desc) as rowcountby_mmsi
                    from pnav.ais_type6_533
                    where ts>='{utc_today.strftime("%Y-%m-%d %H:%M:%S")}' and ts<'{utc_next_day.strftime("%Y-%m-%d %H:%M:%S")}' 
                )
                select count()
                from rowcountdata
                where rowcountby_mmsi = 1
            '''
            )

            msg6_recv_cnt = result.result_rows[0][0]    


            # message counting 

            result = client.query(
            f'''
                select count(*) from pnav.ais_type21
                where ts>='{utc_today.strftime("%Y-%m-%d %H:%M:%S")}' and ts<'{utc_next_day.strftime("%Y-%m-%d %H:%M:%S")}' 
            '''
            )
            
            msg21_cnt = result.result_rows[0][0]


            result = client.query(
            f'''
                select count(*) from pnav.ais_type6_533
                where ts>='{utc_today.strftime("%Y-%m-%d %H:%M:%S")}' and ts<'{utc_next_day.strftime("%Y-%m-%d %H:%M:%S")}' 
            '''
            )

            msg6_cnt = result.result_rows[0][0]


            result = client.query(
            f'''
                select count(*) from pnav.ais_meteorological
                where ts>='{utc_today.strftime("%Y-%m-%d %H:%M:%S")}' and ts<'{utc_next_day.strftime("%Y-%m-%d %H:%M:%S")}' 
            '''
            )

            msg8_cnt = result.result_rows[0][0]     


            # Alarm Section   

            result = client.query(
            f'''
                with rowcountdata as (
                    select *, row_number() over (partition by mmsi order by ts desc) as rowcountby_mmsi
                    from pnav.ais_type6_533
                    where ts>='{utc_today.strftime("%Y-%m-%d %H:%M:%S")}' and ts<'{utc_next_day.strftime("%Y-%m-%d %H:%M:%S")}' 
                )
                select count()
                from rowcountdata
                where rowcountby_mmsi = 1 and light=3
            '''
            )

            light_cnt = result.result_rows[0][0] 


            result = client.query(
            f'''
                with rowcountdata as (
                    select *, row_number() over (partition by mmsi order by ts desc) as rowcountby_mmsi
                    from pnav.ais_type6_533
                    where ts>='{utc_today.strftime("%Y-%m-%d %H:%M:%S")}' and ts<'{utc_next_day.strftime("%Y-%m-%d %H:%M:%S")}' 
                )
                select count()
                from rowcountdata
                where rowcountby_mmsi = 1 and ambient=1
            '''
            )

            ldr_cnt = result.result_rows[0][0] 

            result = client.query(
            f'''
                with rowcountdata as (
                    select *, row_number() over (partition by mmsi order by ts desc) as rowcountby_mmsi
                    from pnav.ais_type6_533
                    where ts>='{utc_today.strftime("%Y-%m-%d %H:%M:%S")}' and ts<'{utc_next_day.strftime("%Y-%m-%d %H:%M:%S")}' 
                )
                select count()
                from rowcountdata
                where rowcountby_mmsi = 1 and off_pos=1
            '''
            )

            offpos_cnt = result.result_rows[0][0] 


            result = client.query(
            f'''
                with rowcountdata as (
                    select *, row_number() over (partition by mmsi order by ts desc) as rowcountby_mmsi
                    from pnav.ais_type6_533
                    where ts>='{utc_today.strftime("%Y-%m-%d %H:%M:%S")}' and ts<'{utc_next_day.strftime("%Y-%m-%d %H:%M:%S")}' 
                )
                select count()
                from rowcountdata
                where rowcountby_mmsi = 1 and volt_int<12.5
            '''
            )

            battAton_cnt = result.result_rows[0][0] 


            result = client.query(
            f'''
                with rowcountdata as (
                    select *, row_number() over (partition by mmsi order by ts desc) as rowcountby_mmsi
                    from pnav.ais_type6_533
                    where ts>='{utc_today.strftime("%Y-%m-%d %H:%M:%S")}' and ts<'{utc_next_day.strftime("%Y-%m-%d %H:%M:%S")}' 
                )
                select count()
                from rowcountdata
                where rowcountby_mmsi = 1 and volt_ex1<12.5
            '''
            )

            battLant_cnt = result.result_rows[0][0] 


            result = {
                'aton_cnt': aton_cnt,
                'msg21_cnt': msg21_cnt,
                'msg6_cnt': msg6_cnt,
                'msg8_cnt': msg8_cnt,
                'light_cnt': light_cnt,
                'ldr_cnt': ldr_cnt,
                'offpos_cnt': offpos_cnt,
                'battAton_cnt': battAton_cnt,
                'battLant_cnt': battLant_cnt,
                'no_msg6_cnt': aton_cnt - msg6_recv_cnt
            }

        except:
             result = {
                'aton_cnt': 0,
                'msg21_cnt': 0,
                'msg6_cnt': 0,
                'msg8_cnt': 0,
                'light_cnt': 0,
                'ldr_cnt': 0,
                'offpos_cnt': 0,
                'battAton_cnt': 0,
                'battLant_cnt': 0,
                'no_msg6_cnt': 0 
            }

        return result           


    def get_all_aton():
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

        return ret_result    


    def get_all_aton_msg():
        now = datetime.now()
        today = datetime(now.year, now.month, now.day)
        utc_today = today - timedelta(hours=8)
        utc_next_day = utc_today + timedelta(hours=48)

        client = clickhouse_connect.get_client(host='10.10.20.50', port=8123)
        result = client.query(
        f'''
            with rowcountdata as (
                select *, row_number() over (partition by mmsi order by ts desc) as rowcountby_mmsi
                from pnav.ais_type6_533
                where ts>='{utc_today.strftime("%Y-%m-%d %H:%M:%S")}' and ts<'{utc_next_day.strftime("%Y-%m-%d %H:%M:%S")}' 
            )
            select *
            from rowcountdata
            where rowcountby_mmsi = 1
        '''
        )

        ret_result = []

        for i in result.result_rows:
            data = {
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
                'buoy_solarcharging': i[36]    
            }   

            ret_result.append(data)    

        return ret_result     

    def get_aton_statistic():
        now = datetime.now() 
        #today = datetime(now.year, now.month, now.day)
        utc_today = now - timedelta(hours=8)
        utc_last24 = utc_today - timedelta(hours=24)


        client = clickhouse_connect.get_client(host='10.10.20.50', port=8123)
        result = client.query(
        f'''
            with 
            anal as (
                select 
                ts,  
                mmsi,
                min(volt_ex2) over (PARTITION BY mmsi) as minTemp,
                max(volt_ex2) over (PARTITION BY mmsi) as maxTemp,
                
                min(volt_int) over (PARTITION BY mmsi) as minBattAton,
                max(volt_int) over (PARTITION BY mmsi) as maxBattAton,
                avg(volt_int) over (PARTITION BY mmsi) as meanBattAton,
                median(volt_int) over (PARTITION BY mmsi) as medianBattAton,
                stddevPop(volt_int) over (PARTITION BY mmsi) as stddevBattAton,
                skewPop(volt_int) over (PARTITION BY mmsi) as skewBattAton,
                kurtPop(volt_int) over (PARTITION BY mmsi) as kurtBattAton,
                
                min(volt_ex1) over (PARTITION BY mmsi) as minBattLant,
                max(volt_ex1) over (PARTITION BY mmsi) as maxBattLant,
                avg(volt_ex1) over (PARTITION BY mmsi) as meanBattLant,
                median(volt_ex1) over (PARTITION BY mmsi) as medianBattLant,
                stddevPop(volt_ex1) over (PARTITION BY mmsi) as stddevBattLant,
                skewPop(volt_ex1) over (PARTITION BY mmsi) as skewBattLant,
                kurtPop(volt_ex1) over (PARTITION BY mmsi) as kurtBattLant,
                
                count() over (PARTITION BY mmsi) as msg6,
                row_number() over (PARTITION BY mmsi  order by ts desc) as rownum
                
                from pnav.ais_type6_533
                where ts >= '{utc_last24.strftime("%Y-%m-%d %H:%M:%S")}' --and ts < '2024-04-25' 
            ),
            aton_alive as (
                select ts, mmsi,
                row_number() over (PARTITION BY mmsi  order by ts desc) as rownum
                from pnav.ais_type6_533
                where ts >= '{utc_last24.strftime("%Y-%m-%d %H:%M:%S")}'
            )
            select *, age('second', toDateTime(at.ts), now()) as lastseen
            from anal aa
            join aton_alive at on aa.rownum=1 and at.rownum=1 and aa.mmsi=at.mmsi
            order by mmsi
        '''
        )

        ret_result = []  

        for i in result.result_rows:
            data = {
                'ts': i[0].strftime("%Y-%m-%d %H:%M:%S"),
                'mmsi':	i[1],
                'minTemp': round(i[2], 2),
                'maxTemp': round(i[3], 2),
                'minBattAton': round(i[4], 2),
                'maxBattAton': round(i[5], 2),
                'meanBattAton':	round(i[6], 2),
                'medianBattAton': round(i[7], 2),
                'stddevBattAton': round(i[8], 2),
                'skewBattAton':	round(i[9], 2) if not math.isnan(i[9]) else -999,
                'kurtBattAton':	round(i[10], 2) if not math.isnan(i[10]) else -999,
                'minBattLant':	round(i[11], 2),
                'maxBattLant':	round(i[12], 2),
                'meanBattLant':	round(i[13], 2),
                'medianBattLant': round(i[14], 2),
                'stddevBattLant': round(i[15], 2),
                'skewBattLant':	round(i[16], 2) if not math.isnan(i[16]) else -999, 
                'kurtBattLant':	round(i[17], 2) if not math.isnan(i[16]) else -999,
                'msg6Count': i[18],
                'rownum': i[19],
                'at.ts': i[20].strftime("%Y-%m-%d %H:%M:%S"),
                'at.mmsi': i[21],
                'at.rownum': i[22],
                'lastseen':	i[23]
            }

            ret_result.append(data)   

        return ret_result   


    def get_weather_waterLevel():
        client = clickhouse_connect.get_client(host='10.10.20.50', port=8123)
        result = client.query(
        f'''
            with rowcountdata as (
                select *, row_number() over (partition by mmsi order by ts desc) as rowcountby_mmsi
                from pnav.ais_meteorological 
                where waterLevel > 0
            )
            select top 4 ts, mmsi, latitude, longitude, (waterLevel/100 - 10) as waterLevel
            from rowcountdata
            where rowcountby_mmsi = 1
            order by mmsi
        '''
        )

        ret_result = []

        for i in result.result_rows:
            data = {
                'ts': (i[0] + timedelta(hours=8)).strftime("%Y-%m-%d %H:%M:%S"),
                'mmsi': i[1],
                'latitude': i[2],
                'longitude': i[3],
                'waterLevel': i[4]
            }

            ret_result.append(data)    

        return ret_result 