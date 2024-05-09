from Nav_Analytics import *
from Nav_ClickHouse import *

import websockets
import asyncio
import json
import pandas as pd
import sqlalchemy as sa
from crate import client
import clickhouse_connect
from geojson import LineString

import time
from datetime import datetime, timedelta


# def loaddata():
#     global df

#     f_loc = '/Users/zultan/sources/python/Pinc_ATONDashboard_VDP/docs/atonlist.csv'
#     # f_loc = '/home/srvadmin/vdp/Pinc_ATONDashboard_VDP/docs/atonlist.csv'
#     df = pd.read_csv(f_loc) 



# def getAton(mmsi):
#     aton = df[df['mmsi'] == mmsi]
#     return aton



HEARTBEAT_INTERVAL = 30
aton_summary = {
    'aton_cnt': 0,
    'msg21_cnt': 0,
    'msg6_cnt': 0,
    'msg8_cnt': 0,

    'light_cnt': 0,
    'light_cnt_p': 0,
    'battAton_cnt': 0,
    'battAton_cnt_p': 0,
    'battLant_cnt': 0,
    'battLant_cnt_p': 0,
    'ldr_cnt': 0,
    'ldr_cnt_p': 0,
    'offpos_cnt': 0,
    'offpos_cnt_p': 0,
    'no_msg6_cnt': 0,
    'no_msg6_cnt_p': 0
}


print('Server is running.....')


async def handler(websocket, path):
    # Start a task for sending ping messages periodically
    ping_task = asyncio.create_task(send_ping(websocket))

    print(f"[PATH]:: {path}")

    try:
        # Receive messages from the client
        async for message in websocket:
            print(f"[MEESSAGE]:: {message}")
            msg = message.split(':')

            if msg[0] == 'getatoninitialcount':
                data = {
                    'payload': 'getatoninitialcount'
                }

                data.update(aton_summary) 
                await websocket.send(json.dumps(data)) 


            if msg[0] == 'getallaton':
                atons = PyCH.get_all_aton()
                atons_cnt = 0
                light_err_cnt = 0
                battAton_cnt = 0
                battLant_cnt = 0
                offpos_cnt = 0
                ldr_cnt = 0
                no_msg6_cnt = 0

                for i in atons:                  
                    aton_info = {
                        'atonname': i['al_name'],
                        'region': i['al_region'],
                        'type': i['al_type'],
                        'status': 1
                    }

                    # generate counting summary
                    atons_cnt += 1

                    if i['aa_rowcountby_mmsi'] == 0:
                        no_msg6_cnt += 1
                        aton_info['status'] = 0  
                    
                    if i['light'] == 3:
                        light_err_cnt += 1
                        aton_info['status'] = 0
                    
                    if i['volt_int'] < 12.0:
                        battAton_cnt += 1
                        aton_info['status'] = 0
                    
                    if i['volt_ex1'] < 12.0:
                        battLant_cnt += 1
                        aton_info['status'] = 0
                    
                    if i['off_pos'] != 0:
                        offpos_cnt += 1
                        aton_info['status'] = 0
                    
                    if i['ambient'] == 0:
                        ldr_cnt += 1
                        aton_info['status'] = 0
                      

                    i.update(aton_info)

                    data = {
                        'payload': 'getallaton'
                    }

                    data.update(i)
                    await websocket.send(json.dumps(data))  
  
                
                aton_summary['aton_cnt'] = atons_cnt
                aton_summary['no_msg6_cnt'] = no_msg6_cnt
                aton_summary['no_msg6_cnt_p'] = "{:.2f}%".format((no_msg6_cnt / atons_cnt) * 100)
                aton_summary['light_cnt'] = light_err_cnt
                aton_summary['light_cnt_p'] = "{:.2f}%".format(((light_err_cnt) / atons_cnt) * 100)
                aton_summary['battAton_cnt'] = battAton_cnt
                aton_summary['battAton_cnt_p'] = "{:.2f}%".format(((battAton_cnt) / atons_cnt) * 100)
                aton_summary['battLant_cnt'] = battLant_cnt
                aton_summary['battLant_cnt_p'] = "{:.2f}%".format(((battLant_cnt) / atons_cnt) * 100)
                aton_summary['offpos_cnt'] = offpos_cnt
                aton_summary['offpos_cnt_p'] = "{:.2f}%".format(((offpos_cnt) / atons_cnt) * 100)
                aton_summary['ldr_cnt'] = ldr_cnt
                aton_summary['ldr_cnt_p'] = "{:.2f}%".format(((ldr_cnt) / atons_cnt) * 100)

                summary = {
                    'payload': 'getatoninitialcount'
                }

                summary.update(aton_summary) 
                await websocket.send(json.dumps(summary)) 

                # Process last 24 hours statistical data
                atons_statistic = PyCH.get_aton_statistic()
                data_cnt = 0

                for i in atons_statistic:
                    data_cnt += 1

                    data = {
                        'payload': 'getatonstatistic',
                        'no': data_cnt
                    }

                    data.update(i)
                    await websocket.send(json.dumps(data))  

                data = {
                    'payload': 'getatonstatistic_done'
                } 

                await websocket.send(json.dumps(data))  


            if msg[0] == 'getallatonvoltdata':
                atons = PyCH.get_aton_voltdata(msg[1])

                for i in atons:
                    data = {
                        'payload': 'getallatonvoltdata',
                        'mmsi': msg[1]
                    }

                    data.update(i)
                    await websocket.send(json.dumps(data)) 

                data = {
                    'payload': 'getallatonvoltdata_done'
                } 

                await websocket.send(json.dumps(data))  


            if msg[0] == 'getallatonmsg':
                atons = PyCH.get_all_aton_msg()

                for i in atons:
                    data = {
                        'payload': 'getallatonmsg'
                    }

                    data.update(i)
                    await websocket.send(json.dumps(data))    


            if msg[0] == 'getatonmsgcount':
                message_cnt_result = PyCH.get_init_msg_count()
                data = {
                    'payload': 'getatonmsgcount',
                    'items': message_cnt_result
                } 
                 
                await websocket.send(json.dumps(data))  


            if msg[0] == 'getweatherwaterlevel':
                waterlevel_result = PyCH.get_weather_waterLevel()
                data = {
                    'payload': 'getweatherwaterlevel',
                    'items': waterlevel_result
                } 
                 
                await websocket.send(json.dumps(data))    


    finally:
        # Cancel the ping task when the connection is closed
        ping_task.cancel()


async def send_ping(websocket):
    # Send ping messages periodically
    while True:
        # Wait for the heartbeat interval
        await asyncio.sleep(HEARTBEAT_INTERVAL)
        # Send a ping message and wait for a pong response
        await websocket.ping()
        print("Send a ping message!")


# Create a WebSocket server using the handler function
# server = websockets.serve(handler, "localhost", 38381)
server = websockets.serve(handler, "10.10.20.200", 38389)

# Run the server using the asyncio event loop
asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()
