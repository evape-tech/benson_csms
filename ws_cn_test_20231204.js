var express = require('express');
var expressWs = require('express-ws');

var app = express();
expressWs(app);
app.listen(8089, () => console.log(`test WS server Listening on 8089`))
//var wss = new WebSocketServer({server: server, path: "/hereIsWS"});

var start_testing_time=0;
var end_testing_time=0;
var wss_live=0;
let com_data=[];
let com_data_backup=[];
let testing_status=[];

var idtag_id="wangtest1234"
var trans_id=12341234
var ocpp_id_send="408";

//////////////////////////////////////////////////******************************
//////////////////////////////////////////////////******************************
var sim_mode = 1 //if 1 = sim mode, 0 = normal mode
/////////////////////
let nIntervId;
var sim_data1=0.00
var sim_data2=0.00
//


var cpid="1002";
var cp_online="online"
var cp_current_status="Available"
var cp_data1='0.00'
var cp_data2='0.00'
var cp_data3='0.0'
var cp_data4=''
var cp_data5=''
var cp_data6=''

var before_status = "Available";

var now_time=new Date(+new Date() + 8 * 3600 * 1000).toISOString()
console.log('nowtime_20231204:'+now_time)

//cschargingprofile , TxDefaultProfile , TxProfile ,ChargePointMaxProfile
//  duration: 86400 = 24hrs
// when using ChargePointMaxProfile then do not to use transactionId


/*

let cschargingprofile =
{
  chargingProfileId:14,
  stackLevel:0,
  chargingProfilePurpose:"TxDefaultProfile",
  chargingProfileKind:"Recurring",
  recurrencyKind:"Daily",
//  validFrom:"2023-05-8T00:00:00.000Z",
//  validTo:"2023-05-19T00:00:00.000Z",
  chargingSchedule:
    {
      startSchedule: "2022–05–08T00:00:00.0Z",
      duration:86400,
      chargingRateUnit:"A",
      chargingSchedulePeriod:[
      {startPeriod:0,limit:16},
      {startPeriod:28800,limit:8},
      {startPeriod:57600,limit:0},
      {startPeriod:79200,limit:16}
      ]
    }
  }
*/


  let cschargingprofile =
  {
      chargingProfileId:26,
      stackLevel:4,
      chargingProfilePurpose: "TxDefaultProfile",
      chargingProfileKind: "Absolute",
      //  chargingProfilePurpose: "TxProfile",
    //   chargingProfilePurpose: "ChargePointMaxProfile",
    //    chargingProfilePurpose: "TxDefaultProfile",
      chargingSchedule: {
         duration:86400,
          chargingRateUnit: "A",
          //  chargingRateUnit: "W",
         startSchedule: "2023-05-10T14:00:00.000Z",

          chargingSchedulePeriod: [
              {
                 startPeriod:0,
                 limit:8,
          //    limit: 2000,
                numberPhases:3
              }
            ]


          }
      // stackLevel: 6,
      //  transactionId: null,
      // transactionId: 12348888
      // validFrom: "2023–05–08T00:32:00.100Z",
      // validTo: "2023–05–20T00:32:00.100Z"
    }




  let chargingprofile = {
      chargingProfileId: 6,
      chargingProfileKind: "Absolute",
        chargingProfilePurpose: "TxProfile",
      chargingSchedule: {
          chargingRateUnit: "A",
      //  chargingRateUnit: "W",
          chargingSchedulePeriod: [
              {
                 limit: 8,
          //     limit: 2000.0,
                 startPeriod: 0
              }
            ],
          duration: 86400,

          },
       stackLevel: 6,

    //   transactionId: trans_id
      // validFrom: "2023–03–06T14:32:00.100Z",
      // validTo: "2023–03–08T14:32:00.100Z"
    }


/*
bk chargingProfileId

let cschargingprofile = {
    chargingProfileId: 158798,
    chargingProfileKind: "Absolute",
    chargingProfilePurpose: "TxProfile",
    chargingSchedule: {
        chargingRateUnit: "W",
      //  duration: 1680,
        chargingSchedulePeriod: [
            {
               limit: 1000.0,
               startPeriod: 0
            },
            {
               limit: 1000.0,
               startPeriod: 780
            },
            {
               limit: 1000.0,
               startPeriod: 1680
            }

          ]
        },
     stackLevel: 10
  }


  let cschargingprofile = {
      chargingProfileId: 158799,
      chargingProfileKind: "Absolute",
        chargingProfilePurpose: "TxDefaultProfile",
      chargingSchedule: {
          chargingRateUnit: "A",
          chargingSchedulePeriod: [
              {
                 limit: 20,
                 startPeriod: 0
              }
            ],
          duration: 86400
          },
       stackLevel: 16,
    //   transactionId: null,
      // validFrom: "2023–03–06T14:32:00.100Z",
      // validTo: "2023–03–08T14:32:00.100Z"
    }


*/


//abcd1234
//app.ws('/abcd1234', function (ws, req){
  app.ws('/spacepark001', function (ws, req){
      console.log("spacepark001_connected")
  //  ws.send('你连接成功了')
  app.get('/ocpp_4', function (req, res) {
    console.log('into ocpp4 statusnotification RequestMessage,trigger')
    ocpp_id_send="bb3651d6-dcc7-4be5-b0ef-07fa25468g21";
    var tt_obj=[2,ocpp_id_send,"TriggerMessage",{"connectorId":1,"requestedMessage":"StatusNotification"}]
      ws.send(JSON.stringify(tt_obj))
  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("ocpp4 RequestMessage,trigger ok");
  })
  app.get('/ocpp_5', function (req, res) {
    console.log('into ocpp4 statusnotification RequestMessage,trigger')
    ocpp_id_send="785773-666";
    var tt_obj=[2,ocpp_id_send,"TriggerMessage",{"requestedMessage":"StatusNotification"}]
      ws.send(JSON.stringify(tt_obj))
  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("ocpp4 RequestMessage,trigger ok");
  })
  app.get('/ocpp_error', function (req, res) {
    console.log('into ocpp4 statusnotification RequestMessage,trigger')
    ocpp_id_send="785773-666";
    var tt_obj=[2,ocpp_id_send,"123123TriggerMessage",{"123requestedMessage123":"StatusNotification"}]
      ws.send(JSON.stringify(tt_obj))
  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("ocpp4 RequestMessage,trigger ok");
  })

  app.get('/ocpp_get_composite', function (req, res) {
    console.log('into /ocpp_get_composite')
    var tt_obj=[2,"667701","GetCompositeSchedule",{"connectorId":1,"duration":0,"ChargingRateUnitType":"A"}]


    ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_get_composite ok");

  })



    app.get('/ocpp_get_meters', function (req, res) {
    console.log('into /ocpp_get_meters')
//      ocpp_id_send++;
    var tt_obj=[2,"21b49e76-6d8b-4ea5-9e73-2f27d6338499","TriggerMessage",{"requestedMessage":"MeterValues","connectorId":1}]

    ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("RequestMessage /ocpp_get_meters ok");
  })

  app.get('/ocpp_set_chargingprofile', function (req, res) {
    console.log('into /ocpp_set_chargingprofile')
      //cschargingprofile.transactionId = trans_id ;
    var tt_obj=[2,"21b49e76-6d8b-4ea5-9e73-2f27d6338488","SetChargingProfile",{"connectorId":1,"csChargingProfiles": cschargingprofile}]

    ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_set_chargingprofile");
//  res.redirect("http://220.130.209.126:8086/start_to_charging");

  })

  app.get('/ocpp_start_charging', function (req, res) {
    console.log('into /ocpp_start_charging')
    var tt_obj=[2,"667701","RemoteStartTransaction",{"idTag":idtag_id,"connectorId":1}]


      ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_start_charging ok");
//  res.redirect("http://220.130.209.126:8086/start_to_charging");

  })

  app.get('/ocpp_smart_charging', function (req, res) {
    console.log('into /ocpp_smart_charging')
    var tt_obj=[2,"667701","RemoteStartTransaction",{"idTag":idtag_id,"connectorId":1,"ChargingProfiles": chargingprofile}]

   ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_smart_charging ok");
//  res.redirect("http://220.130.209.126:8086/start_to_charging");

  })



  app.get('/ocpp_set_to_5A', function (req, res) {
    console.log('into /ocpp_set_chargingprofile set to 5A')
    cschargingprofile.chargingSchedule.chargingSchedulePeriod[0].limit = 5 ;

    var tt_obj=[2,"667701","SetChargingProfile",{"connectorId":1,"csChargingProfiles": cschargingprofile}]

   ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_start_charging ok");
//  res.redirect("http://220.130.209.126:8086/start_to_charging");

  })

  app.get('/ocpp_set_to_15A', function (req, res) {
    console.log('into /ocpp_set_chargingprofile set to 15A')
    cschargingprofile.chargingSchedule.chargingSchedulePeriod[0].limit = 15 ;

    var tt_obj=[2,"667701","SetChargingProfile",{"connectorId":1,"csChargingProfiles": cschargingprofile}]

  ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_start_charging ok");
//  res.redirect("http://220.130.209.126:8086/start_to_charging");

  })

  app.get('/ocpp_clear_charging_profile', function (req, res) {
    console.log('into /ocpp_clear_charging_profile')

    var tt_obj=[2,"667701","ClearChargingProfile",{"id":158798}]

  ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_clear_charging_profile");
//  res.redirect("http://220.130.209.126:8086/start_to_charging");

  })

  app.get('/ocpp_stop_charging', function (req, res) {
    console.log('into /ocpp_stop_charging')
    //var tt_obj=[2,"667701","RemoteStopTransaction",{"transactionId":trans_id}]
    var tt_obj=[2,"667701","RemoteStopTransaction",{"transactionId":0}]

  ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_stop_charging ok");
//  res.redirect("http://220.130.209.126:8086/start_to_billing");

  })

// end of connection
    ws.on('message', function (msg) {
        // 业务代码
        var data = msg
       console.log(msg)

       console.log("all_message:"+new Date(+new Date() + 8 * 3600 * 1000).toISOString()+data)
           var j_aa=JSON.parse(data)
//        console.log("j_aa:"+j_aa)
  //      console.log("j_aa[0]:"+j_aa[0])
  //      console.log("j_aa[1]:"+j_aa[1])
  //      console.log("j_aa[2]:"+j_aa[2])
  //      console.log("j_aa[3]:"+j_aa[3].chargePointSerialNumber)

  if(j_aa[2]=="BootNotification"){
    console.log('into BootNotification proc')
//2022-10-04T15:05:486Z
    var tt_obj=[3,"6677543",{

  //  "registrationStatus":"Accepted"
    "currentTime":"2022-10-04T15:05:486Z",
    "interval":30,
    "status":"Accepted"
  }]
     tt_obj[1]=j_aa[1]
//     var cur_dateiso=new Date()+8 * 3600 * 1000
 now_time=new Date(+new Date() + 8 * 3600 * 1000).toISOString()
    tt_obj[2].currentTime=now_time
        ws.send(JSON.stringify(tt_obj))
console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))

  }

  if(j_aa[2]=="StatusNotification"){
    console.log('into "StatusNotification" proc')
  //  console.log('status='+j_aa[3].status)
  // status changed!!
   if(cp_current_status!=j_aa[3].status){
     cp_current_status=j_aa[3].status;
//     cp_status_changed();
   }
    cp_current_status=j_aa[3].status;
    console.log('status='+cp_current_status)
    var tt_obj=[3,6677543,{}]
     tt_obj[1]=j_aa[1]

        ws.send(JSON.stringify(tt_obj))
console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))

  }

  if(j_aa[2]=="Heartbeat"){
    console.log('into "Heartbeat" proc')

    var tt_obj=[3,6677543,{"currentTime":"2022-10-04T15:05:486Z"}]
     tt_obj[1]=j_aa[1]
     now_time=new Date(+new Date() + 8 * 3600 * 1000).toISOString()
     tt_obj[2].currentTime=now_time
         ws.send(JSON.stringify(tt_obj))
 console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  }

  if(j_aa[2]=="Authorize"){
    console.log('into "Authorize" proc')

    var tt_obj=[3,6677543,{"idTagInfo":{"status":"Accepted"}}]
     tt_obj[1]=j_aa[1]
       ws.send(JSON.stringify(tt_obj))
 console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  }

  if(j_aa[2]=="StartTransaction"){
    console.log('into "StartTransaction" proc')
    //expiryDate=taipei time + 24h
    exp_time=new Date(+new Date() + 8 * 3600 * 1000 * 24).toISOString()
    var tt_obj=[3,6677543,{"idTagInfo":{"expiryDate":exp_time,"status":"Accepted","transactionId":trans_id}}]
     tt_obj[1]=j_aa[1]
       ws.send(JSON.stringify(tt_obj))
 console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  }

  if(j_aa[2]=="StopTransaction"){
    console.log('into "StopTransaction" proc')
    //expiryDate=taipei time + 24h
    exp_time=new Date(+new Date() + 8 * 3600 * 1000 * 24).toISOString()
    var tt_obj=[3,6677543,{}]
     tt_obj[1]=j_aa[1]
       ws.send(JSON.stringify(tt_obj))
 console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  }

  if(j_aa[2]=="DataTransfer"){
    console.log('into "DataTransfer" proc')
    //expiryDate=taipei time + 24h
    exp_time=new Date(+new Date() + 8 * 3600 * 1000 * 24).toISOString()
    var tt_obj=[3,6677543,{"status":"Accepted"}]
     tt_obj[1]=j_aa[1]
       ws.send(JSON.stringify(tt_obj))
 console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  }
  if(j_aa[2]=="MeterValues"){
    console.log('into "MeterValues" proc')
  //need to catch all_message[3].meterValue[0].sampledValue[0]=data1,[1]=data2,[4]=data3
//if(j_aa[3].meterValue[0].sampledValue[0].value>0){cp_data1 = j_aa[3].meterValue[0].sampledValue[0].value;}
//if(j_aa[3].meterValue[0].sampledValue[1].value>0){cp_data2 = j_aa[3].meterValue[0].sampledValue[1].value;}
//if(j_aa[3].meterValue[0].sampledValue[4].value>0){cp_data3 = j_aa[3].meterValue[0].sampledValue[4].value;}

           console.log('metervalue_khw_cp_data1:'+cp_data1);
            console.log('metervalue_A_cp_data2:'+cp_data2);
            console.log('metervalue_V_cp_data3:'+cp_data3);

  if(cp_current_status=="Charging")
  {
    //send_cp_to_kw_api();
  }

    exp_time=new Date(+new Date() + 8 * 3600 * 1000 * 24).toISOString()
    var tt_obj=[3,6677543,{"status":"Accepted"}]
     tt_obj[1]=j_aa[1]
       ws.send(JSON.stringify(tt_obj))
 console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  //get_ocpp_4_data();
  }

    // end of ws.on(message)
    })
    // 當連線關閉
    ws.on('close', () => {
      console.log('spacepark001_Close connected')
    })
})
//AT2206110194
//aabbcc
app.ws('/aabbcc', function (ws, req){
      console.log("aabbcc_connected")
  //  ws.send('你连接成功了')
  app.get('/ocpp_4', function (req, res) {
    console.log('into ocpp4 statusnotification RequestMessage,trigger')
    ocpp_id_send="bb3651d6-dcc7-4be5-b0ef-07fa25468g21";
    var tt_obj=[2,ocpp_id_send,"TriggerMessage",{"connectorId":1,"requestedMessage":"StatusNotification"}]
      ws.send(JSON.stringify(tt_obj))
  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("ocpp4 RequestMessage,trigger ok");
  })
  app.get('/ocpp_5', function (req, res) {
    console.log('into ocpp4 statusnotification RequestMessage,trigger')
    ocpp_id_send="785773-666";
    var tt_obj=[2,ocpp_id_send,"TriggerMessage",{"requestedMessage":"StatusNotification"}]
      ws.send(JSON.stringify(tt_obj))
  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("ocpp4 RequestMessage,trigger ok");
  })
  app.get('/ocpp_error', function (req, res) {
    console.log('into ocpp4 statusnotification RequestMessage,trigger')
    ocpp_id_send="785773-666";
    var tt_obj=[2,ocpp_id_send,"123123TriggerMessage",{"123requestedMessage123":"StatusNotification"}]
      ws.send(JSON.stringify(tt_obj))
  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("ocpp4 RequestMessage,trigger ok");
  })

  app.get('/ocpp_get_composite', function (req, res) {
    console.log('into /ocpp_get_composite')
    var tt_obj=[2,"667701","GetCompositeSchedule",{"connectorId":1,"duration":0,"ChargingRateUnitType":"A"}]


    ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_get_composite ok");

  })



    app.get('/ocpp_get_meters', function (req, res) {
    console.log('into /ocpp_get_meters')
//      ocpp_id_send++;
    var tt_obj=[2,"21b49e76-6d8b-4ea5-9e73-2f27d6338499","TriggerMessage",{"requestedMessage":"MeterValues","connectorId":1}]

    ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("RequestMessage /ocpp_get_meters ok");
  })

  app.get('/ocpp_set_chargingprofile', function (req, res) {
    console.log('into /ocpp_set_chargingprofile')
      //cschargingprofile.transactionId = trans_id ;
    var tt_obj=[2,"21b49e76-6d8b-4ea5-9e73-2f27d6338488","SetChargingProfile",{"connectorId":1,"csChargingProfiles": cschargingprofile}]

    ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_set_chargingprofile");
//  res.redirect("http://220.130.209.126:8086/start_to_charging");

  })

  app.get('/ocpp_start_charging', function (req, res) {
    console.log('into /ocpp_start_charging')
    var tt_obj=[2,"667701","RemoteStartTransaction",{"idTag":idtag_id,"connectorId":1}]


      ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_start_charging ok");
//  res.redirect("http://220.130.209.126:8086/start_to_charging");

  })

  app.get('/ocpp_smart_charging', function (req, res) {
    console.log('into /ocpp_smart_charging')
    var tt_obj=[2,"667701","RemoteStartTransaction",{"idTag":idtag_id,"connectorId":1,"ChargingProfiles": chargingprofile}]

   ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_smart_charging ok");
//  res.redirect("http://220.130.209.126:8086/start_to_charging");

  })



  app.get('/ocpp_set_to_5A', function (req, res) {
    console.log('into /ocpp_set_chargingprofile set to 5A')
    cschargingprofile.chargingSchedule.chargingSchedulePeriod[0].limit = 5 ;

    var tt_obj=[2,"667701","SetChargingProfile",{"connectorId":1,"csChargingProfiles": cschargingprofile}]

   ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_start_charging ok");
//  res.redirect("http://220.130.209.126:8086/start_to_charging");

  })

  app.get('/ocpp_set_to_15A', function (req, res) {
    console.log('into /ocpp_set_chargingprofile set to 15A')
    cschargingprofile.chargingSchedule.chargingSchedulePeriod[0].limit = 15 ;

    var tt_obj=[2,"667701","SetChargingProfile",{"connectorId":1,"csChargingProfiles": cschargingprofile}]

  ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_start_charging ok");
//  res.redirect("http://220.130.209.126:8086/start_to_charging");

  })

  app.get('/ocpp_clear_charging_profile', function (req, res) {
    console.log('into /ocpp_clear_charging_profile')

    var tt_obj=[2,"667701","ClearChargingProfile",{"id":158798}]

  ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_clear_charging_profile");
//  res.redirect("http://220.130.209.126:8086/start_to_charging");

  })

  app.get('/ocpp_stop_charging', function (req, res) {
    console.log('into /ocpp_stop_charging')
    //var tt_obj=[2,"667701","RemoteStopTransaction",{"transactionId":trans_id}]
    var tt_obj=[2,"667701","RemoteStopTransaction",{"transactionId":0}]

  ws.send(JSON.stringify(tt_obj))

  console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  res.send("/ocpp_stop_charging ok");
//  res.redirect("http://220.130.209.126:8086/start_to_billing");

  })

// end of connection
    ws.on('message', function (msg) {
        // 业务代码
        var data = msg
       console.log(msg)

       console.log("all_message:"+new Date(+new Date() + 8 * 3600 * 1000).toISOString()+data)
           var j_aa=JSON.parse(data)
//        console.log("j_aa:"+j_aa)
  //      console.log("j_aa[0]:"+j_aa[0])
  //      console.log("j_aa[1]:"+j_aa[1])
  //      console.log("j_aa[2]:"+j_aa[2])
  //      console.log("j_aa[3]:"+j_aa[3].chargePointSerialNumber)

  if(j_aa[2]=="BootNotification"){
    console.log('into BootNotification proc')
//2022-10-04T15:05:486Z
    var tt_obj=[3,"6677543",{

  //  "registrationStatus":"Accepted"
    "currentTime":"2022-10-04T15:05:486Z",
    "interval":30,
    "status":"Accepted"
  }]
     tt_obj[1]=j_aa[1]
//     var cur_dateiso=new Date()+8 * 3600 * 1000
  //  tt_obj[2].currentTime=new Date(+new Date() + 8 * 3600 * 1000).toISOString()
  tt_obj[2].currentTime=new Date(+new Date() + 7 * 3600 * 1000).toISOString()

        ws.send(JSON.stringify(tt_obj))
console.log('send_to_ev_charger_20231204:'+JSON.stringify(tt_obj))

  }

  if(j_aa[2]=="StatusNotification"){
    console.log('into "StatusNotification" proc')
  //  console.log('status='+j_aa[3].status)
  // status changed!!
   if(cp_current_status!=j_aa[3].status){
     cp_current_status=j_aa[3].status;
//     cp_status_changed();
   }
    cp_current_status=j_aa[3].status;
    console.log('status='+cp_current_status)
    var tt_obj=[3,6677543,{}]
     tt_obj[1]=j_aa[1]

        ws.send(JSON.stringify(tt_obj))
console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))

  }

  if(j_aa[2]=="Heartbeat"){
    console.log('into "Heartbeat" proc')

    var tt_obj=[3,6677543,{"currentTime":"2022-10-04T15:05:486Z"}]
     tt_obj[1]=j_aa[1]
     tt_obj[2].currentTime=new Date(+new Date() + 8 * 3600 * 1000).toISOString()
         ws.send(JSON.stringify(tt_obj))
 console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  }

  if(j_aa[2]=="Authorize"){
    console.log('into "Authorize" proc')

    var tt_obj=[3,6677543,{"idTagInfo":{"status":"Accepted"}}]
     tt_obj[1]=j_aa[1]
       ws.send(JSON.stringify(tt_obj))
 console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  }

  if(j_aa[2]=="StartTransaction"){
    console.log('into "StartTransaction" proc')
    //expiryDate=taipei time + 24h
    exp_time=new Date(+new Date() + 8 * 3600 * 1000 * 4).toISOString()
    var tt_obj=[3,6677543,{"idTagInfo":{"expiryDate":exp_time,"status":"Accepted","transactionId":trans_id}}]
     tt_obj[1]=j_aa[1]
       ws.send(JSON.stringify(tt_obj))
 console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  }

  if(j_aa[2]=="StopTransaction"){
    console.log('into "StopTransaction" proc')
    //expiryDate=taipei time + 24h
    exp_time=new Date(+new Date() + 8 * 3600 * 1000 * 4).toISOString()
    var tt_obj=[3,6677543,{}]
     tt_obj[1]=j_aa[1]
       ws.send(JSON.stringify(tt_obj))
 console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  }

  if(j_aa[2]=="DataTransfer"){
    console.log('into "DataTransfer" proc')
    //expiryDate=taipei time + 24h
    exp_time=new Date(+new Date() + 8 * 3600 * 1000 * 4).toISOString()
    var tt_obj=[3,6677543,{"status":"Accepted"}]
     tt_obj[1]=j_aa[1]
       ws.send(JSON.stringify(tt_obj))
 console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  }
  if(j_aa[2]=="MeterValues"){
    console.log('into "MeterValues" proc')
  //need to catch all_message[3].meterValue[0].sampledValue[0]=data1,[1]=data2,[4]=data3
//if(j_aa[3].meterValue[0].sampledValue[0].value>0){cp_data1 = j_aa[3].meterValue[0].sampledValue[0].value;}
//if(j_aa[3].meterValue[0].sampledValue[1].value>0){cp_data2 = j_aa[3].meterValue[0].sampledValue[1].value;}
//if(j_aa[3].meterValue[0].sampledValue[4].value>0){cp_data3 = j_aa[3].meterValue[0].sampledValue[4].value;}

           console.log('metervalue_khw_cp_data1:'+cp_data1);
            console.log('metervalue_A_cp_data2:'+cp_data2);
            console.log('metervalue_V_cp_data3:'+cp_data3);

  if(cp_current_status=="Charging")
  {
    //send_cp_to_kw_api();
  }

    exp_time=new Date(+new Date() + 8 * 3600 * 1000 * 4).toISOString()
    var tt_obj=[3,6677543,{"status":"Accepted"}]
     tt_obj[1]=j_aa[1]
       ws.send(JSON.stringify(tt_obj))
 console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
  //get_ocpp_4_data();
  }

    // end of ws.on(message)
    })
    // 當連線關閉
    ws.on('close', () => {
      console.log('AT2206110194_Close connected')
    })
})

app.ws('/cpid_1001', function (ws, req){
      console.log("cpid_1001_connected")
    ws.send('你连接成功了')

    ws.on('message', function (msg) {
        // 业务代码
       console.log(msg)
       ws.send("cpid_1001"+msg)
    })
    // 當連線關閉
    ws.on('close', () => {
      console.log('cpid_1001_Close connected')
    })
})

app.ws('/cpid_1002', function (ws, req){
      console.log("cpid_1002_connected")
    ws.send('你连接成功了')

    ws.on('message', function (msg) {
        // 业务代码
       console.log(msg)
       ws.send("cpid_1002"+msg)
    })
    // 當連線關閉
    ws.on('close', () => {
      console.log('cpid_1002_Close connected')
    })
})
