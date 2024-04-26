//泰盛 teison ocpp to mqtt server , cpid = 1001 , v1.0 , 2023_0723 edited.
var express = require('express');
var fs = require('fs');
var app = express();
var favicon = require('serve-favicon')
var path = require('path')
//app.use(express.static('public'));
const axios = require('axios');
const cors = require('cors');
const qs = require('qs');

var mqtt = require('mqtt');
var cht_mqtt_opt={
  port:1883,
  clientId:'mqttjs',
  username:'PKFXTUCBYPRPTGS1Y7',
  password:'PKFXTUCBYPRPTGS1Y7'
};

var client=mqtt.connect('mqtt://59.127.130.167');
//var client=mqtt.connect('mqtt://127.0.0.1');


client.subscribe('/mqtt_charger/cp_id/1001/ocpp_raw');
client.subscribe('/mqtt_charger/cp_id/1001/ocpp_input');

client.subscribe('/mqtt_charger/cp_id/1001/status');
client.subscribe('/mqtt_charger/cp_id/1001/cmd');
client.subscribe('/mqtt_charger/cp_id/1001/testcmd');


client.on('message',function(topic,msg)
{

  if(topic=="/mqtt_charger/cp_id/1001/ocpp_raw"){

    console.log('cp_id/1001/ocpp_raw:' + new Date(+new Date() + 8 * 3600 * 1000).toISOString() + msg);
     let ocpp_raw_msg = JSON.parse(msg)
     console.log("ocpp_raw[1]="+ocpp_raw_msg[1])

   }

   if(topic=="/mqtt_charger/cp_id/1001/ocpp_input"){

     console.log('cp_id/1001/ocpp_input:' + new Date(+new Date() + 8 * 3600 * 1000).toISOString() + msg);

    }

    if(topic=="/mqtt_charger/cp_id/1001/status"){

      console.log('cp_id/1001/status:' + new Date(+new Date() + 8 * 3600 * 1000).toISOString() + msg);

     }

     if(topic=="/mqtt_charger/cp_id/1001/testcmd"){

       console.log('cp_id/1001/testcmd:' + new Date(+new Date() + 8 * 3600 * 1000).toISOString() + msg);
       if (msg == "mqtt_start_charging"){
           console.log("into mqtt_start_charging")
             ocpp_cmd_start_charging();
         }

       if (msg == "mqtt_stop_charging"){
           console.log("into mqtt_stop_charging")
             ocpp_cmd_stop_charging();
         }
      }

    if(topic=="/mqtt_charger/cp_id/1001/cmd"){

      console.log('cp_id/1001/cmd:' + new Date(+new Date() + 8 * 3600 * 1000).toISOString() + msg);
         var cp_cmd_all=JSON.parse(msg)
         var cp_cmd = cp_cmd_all.cmd
      //   var cp_cmd_data1 = cp_cmd_all.data1
         // {"cmd":"mqtt_get_cp_data","data1":"123"}
         console.log("cp_cmd="+cp_cmd)
      //   console.log("cp_cmd_data1="+cp_cmd_data1)

        if (cp_cmd == "mqtt_start_charging"){
            console.log("into mqtt_start_charging")
              ocpp_cmd_start_charging();
          }

        if (cp_cmd == "mqtt_stop_charging"){
            console.log("into mqtt_stop_charging")
              ocpp_cmd_stop_charging();
          }


        if (cp_cmd == "mqtt_get_cp_data"){
           console.log("into mqtt_get_cp_data")
           client.publish('/mqtt_charger/cp_id/1001/status',JSON.stringify({
             cpid: cpid,
             cmd:'report_cp_status',
             cp_online: cp_online,
             current_status: cp_current_status,
             data1: cp_data1,
             data2: cp_data2,
             data3: cp_data3,
             data4: cp_data4,
             data5: cp_data5,
             data6: cp_data6
           }));
          }


     }

})


app.use(cors());
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
const SocketServer = require('ws').Server
var bodyParser = require('body-parser');
 var urlencodedParser = bodyParser.urlencoded({ extended: false });
// var server = require('http').createServer(app);
 app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
 app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
   extended: true
 }));




//指定開啟的 port
//const PORT = 3000
//const server = app.listen(8092, () => console.log(`Ean-易安充 Server Listening on 8080`))
const server = app.listen(8087, () => console.log(`Teison_cpid_1001 Server Listening on 8087`))

var start_testing_time=0;
var end_testing_time=0;
var wss_live=0;
let com_data=[];
let com_data_backup=[];
let testing_status=[];

var idtag_id="wangtest1234"
var trans_id=12341234
var ocpp_id_send="408";
var charging_times=0;
var start_charging_id="";
//30秒一次
var set_loop_time=30000;
//////////////////////////////////////////////////******************************
//////////////////////////////////////////////////******************************
var sim_mode = 1 //if 1 = sim mode, 0 = normal mode
/////////////////////
let nIntervId;
var sim_data1=0.00
var sim_data2=0.00
var sim_data6=""
//
//var dateTimeStamp_cp_data5 = Date.now();
var dateTimeStamp_cp_data5 = Date.now();
console.log(" Current Timestamp :: " + dateTimeStamp_cp_data5);

var cpid="1001";
var cp_online="online"
var start_charging_id="";
var cp_current_status="Available"
var cp_data1=0
var cp_data2='0.00'
var cp_data3='0.0'
var cp_data4=0
var cp_data5=0
var cp_data6=''

var before_status = "Available";
var before_cp_data1 = "0.00";
let meter_start=0;

//cschargingprofile , TxDefaultProfile , TxProfile ,ChargePointMaxProfile
//  duration: 86400 = 24hrs
let cschargingprofile = {
    chargingProfileId: 158800,
    chargingProfileKind: "Absolute",
      chargingProfilePurpose: "TxProfile",
    chargingSchedule: {
        chargingRateUnit: "A",
        chargingSchedulePeriod: [
            {
               limit: 3,
               startPeriod: 0
            }
          ],
        duration: 86400
        },
     stackLevel: 17,
  //   transactionId: null,
    // validFrom: "2023–03–06T14:32:00.100Z",
    // validTo: "2023–03–08T14:32:00.100Z"
  }
/*
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
     stackLevel: 15,
     transactionId: null,
     validFrom: "2023–03–07T14:32:00.100Z",
     validTo: "2023–03–08T14:32:00.100Z"
  }
  */
  /////// check status
  setInterval(check_current_status, 500);

  function check_current_status(){
    //console.log("into check_current_status()");
      if(cp_current_status == "Charging" && before_status=="Preparing"){
        charging_times ++ ;
        console.log("current_charging_times =" + charging_times);
      }
    if(cp_current_status == "Available"){
    //  console.log("checked_current_status==Available");
    //  trans_id = 0;
    //  clearInterval(nIntervId);

    //  nIntervId = null;
    }
    if(cp_current_status == "Preparing"){
    //  console.log("checked_current_status==Preparing");
    //  trans_id = 0;
    //  clearInterval(nIntervId);
      // release our intervalID from the variable
    //  nIntervId = null;
    }
    if(cp_current_status == "Finishing"){
    //  console.log("checked_current_status==Available");
    //  trans_id = 0;
    //  clearInterval(nIntervId);
      // release our intervalID from the variable
  //    nIntervId = null;
    //  last_cp_data1 = cp_data1;

    }
    if(before_status != cp_current_status){
      console.log("check_status: current_status_changed!!!! =" + cp_current_status);
      before_status=cp_current_status;
      //  console.log("send_cp_to_kw_api()");
      send_cp_to_kw_api();
    }
    if(before_cp_data1 != cp_data1){
      console.log("check_cp_data1: current_cp_data1_changed!!!! =" + cp_data1);
      before_cp_data1=cp_data1;
      //  console.log("send_cp_to_kw_api()");
      send_cp_to_kw_api();
    }

  }

  function send_cp_to_kw_api() {
    //外站接口
      console.log("into send cp to kw api_cp_currentstatus:"+cp_current_status);
    //if(cp_current_status!="Available" && cp_current_status!="Preparing"){cp_data4=trans_id;}
    //  cp_data5 = Date.now();
       cp_data4="";
       cp_data5="";
      // cp_data6=sim_data6;
    //  cp_data1 = cp_data1 - last_cp_data1;
      //if(cp_data1<0){cp_data1=0};
       console.log("into send cp to kw_data1:"+cp_data1);
       console.log("into send cp to kw_data2:"+cp_data2);
       console.log("into send cp to kw_data3:"+cp_data3);
          console.log("into send cp to kw_data4:"+cp_data4);
              console.log("into send cp to kw_data5:"+cp_data5);
                console.log("into send cp to kw_data6:"+cp_data6);
    //const api = 'http://localhost/api/cp-callback';
    client.publish('/mqtt_charger/cp_id/1001/status',JSON.stringify({
      cpid: cpid,
      cmd:'report_cp_status',
      cp_online: cp_online,
      current_status: cp_current_status,
      data1: cp_data1,
      data2: cp_data2,
      data3: cp_data3,
      data4: cp_data4,
      data5: cp_data5,
      data6: cp_data6
    }));

    axios.post('http://localhost/api/cp-callback',
         qs.stringify({
      apikey:'cp_api_key16888',
      cpid: cpid,
      cmd:'report_cp_status',
      cp_online: cp_online,
      current_status: cp_current_status,
      data1: cp_data1,
      data2: cp_data2,
      data3: cp_data3,
      data4: cp_data4,
      data5: cp_data5,
      data6: cp_data6
    }))
    .then(function (response) {
      //这里获得整个请求响应对象
      //console.log(response);
      var aaa=response.data;
      var bbb=JSON.stringify(aaa);
      console.log('new_url_kwfeeback:'+ bbb);

    })
    .catch(function (error) {
      console.log("kw_error:"+error);
      //  console.log("kw_new_url_error");
    })
    .then(function () {
    });

  }


  function cp_status_changed(){
      send_cp_to_kw_api();
      console.log('!!!!!!!!!!!!! cp_status_changed !!!!!!!!!!!!!!!');
  }

  function get_cp_data() {
      console.log("into get_cp_data()");
    get_meter_data();
   //  get_ocpp_4_data();
  }

  function get_meter_data(){
    var api = 'http://localhost:8080/ocpp_get_meters';
    //const api = 'https://www.hermes.com/tw/zh/category/men/bags-and-small-leather-goods/bags/#|';


    //axios通过提供对应HTTP请求方法，实现GET/POST/PUT 等对应的请求发送
    // 这里调用对/products接口的GET方法，获取产品
    axios.get(api)
      .then(function (response) {
        //这里获得整个请求响应对象
        //console.log(response);
        var aaa=response.data;
        JSON.stringify(aaa)
        console.log('get_cp_data:'+ response.data);
       //   get_ocpp_4_data();
      })
      .catch(function (error) {
      //  console.log(error);
          console.log("error");
      })
      .then(function () {
      });

  }


  function ocpp_cmd_start_charging(){
    console.log('into /ocpp_start_charging')
    cp_data4=cp_data1;
    var api = 'http://localhost:8080/ocpp_start_charging';
    //const api = 'https://www.hermes.com/tw/zh/category/men/bags-and-small-leather-goods/bags/#|';


    //axios通过提供对应HTTP请求方法，实现GET/POST/PUT 等对应的请求发送
    // 这里调用对/products接口的GET方法，获取产品
    axios.get(api)
      .then(function (response) {
        //这里获得整个请求响应对象
        //console.log(response);
        var aaa=response.data;
        JSON.stringify(aaa)
        console.log('ocpp_cmd_start_charging():'+ response.data);
       //   get_ocpp_4_data();
      })
      .catch(function (error) {
      //  console.log(error);
          console.log("ocpp_cmd_start_charging():error");
      })
      .then(function () {
      });
  }

  function ocpp_cmd_stop_charging(){
    console.log('into /ocpp_stop_charging')
    var api = 'http://localhost:8080/ocpp_stop_charging';
    //const api = 'https://www.hermes.com/tw/zh/category/men/bags-and-small-leather-goods/bags/#|';


    //axios通过提供对应HTTP请求方法，实现GET/POST/PUT 等对应的请求发送
    // 这里调用对/products接口的GET方法，获取产品
    axios.get(api)
      .then(function (response) {
        //这里获得整个请求响应对象
        //console.log(response);
        var aaa=response.data;
        JSON.stringify(aaa)
        console.log('ocpp_cmd_start_charging():'+ response.data);
       //   get_ocpp_4_data();
      })
      .catch(function (error) {
      //  console.log(error);
          console.log("ocpp_cmd_start_charging():error");
      })
      .then(function () {
      });
  }

////////////
app.get('/ctrlpage', function (req, res) {
  res.sendFile( __dirname + "/" + "teison_1001.html" );
  //res.send("ok got it");
})

app.get('/ttt', function (req, res) {
  res.sendFile( __dirname + "/" + "ws_ttt.html" );
  //res.send("ok got it");
})

///////////

//////////////////////////////////////////////////////////////////////////////////
//HTTP api with KW
// charger cp api
//////////////////////////////////////////////////////////////////////////////////

app.post('/spacepark_cp_api', function (req, res) {

     console.log("into /spacepark_cp_api");
  //  console.log(req.body);
  //  console.log(req.body.apikey);
  //  console.log(req.body.start_charging_id);
    let cp_api=req.body.apikey;
    var cp_cmd=req.body.cmd;
  //  start_charging_id = req.body.start_charging_id;
  //  console.log(start_charging_id);
  //  cp_data6=req.body.start_charging_id;

    let res_data={
      cp_res: 'start_charging_now'
    }

    let res_cp_status={
      cp_res: 'cp_status',
      cpid: cpid,
      cp_online: cp_online,
      current_status: cp_current_status,
      data1: cp_data1,
      data2: cp_data2,
      data3: cp_data3,
      data4: cp_data4,
      data5: cp_data5,
      data6: cp_data6
    }

   //get_cp_data();

  if(cp_api=='cp_api_key16888'){
    switch (cp_cmd) {
        case 'cmd_start_charging':
        res.status(200)
        start_charging_id = req.body.start_charging_id;
        console.log("start_charging_id="+start_charging_id);
        cp_data6=start_charging_id;
          console.log("cp_data6="+cp_data6);
        res_data.cp_res='start_charging_now'
        var str = JSON.stringify(res_data);
        console.log('res.send:' + str );

         res.setHeader('content-type', 'application/json');
         res.send(str);
         //設定自動pulling metervalues , 3 秒一次
      //   if (!nIntervId) {
      //    nIntervId = setInterval(get_cp_data, set_loop_time);
      //  }

         ocpp_cmd_start_charging();

            break;

        case 'cmd_stop_charging':
        res.status(200)
        res_data.cp_res='stop_charging_now'
        var str = JSON.stringify(res_data);
        console.log('res.send:' + str );
         res.setHeader('content-type', 'application/json');
         res.send(str);

          //結束 - 設定自動pulling metervalues , 3 秒一次
    //     clearInterval(nIntervId);
         // release our intervalID from the variable
    //     nIntervId = null;
                 ocpp_cmd_stop_charging();
               break;

        case 'get_cp_status':
        res.status(200)
        var str = JSON.stringify(res_cp_status);
        console.log('res.send:' + str );

         res.setHeader('content-type', 'application/json');
         res.send(str);
        // get_cp_data();
        // send_cp_to_kw_api()
                  break;

        default:
          console.log(`Sorry,out of cmd:`+cp_cmd);
          var error_code = {	status: 'err',
                              msg: 'cmd不存在'}
          res.setHeader('content-type', 'application/json');
          res.status(400).send(JSON.stringify(error_code));
        }
     // end of this case-switch
  } else{
    console.log(`Sorry,worng cp_api_key:`+cp_api);
    var error_code = {	status: 'err',
                        msg: 'key不存在'}
    res.setHeader('content-type', 'application/json');
    res.status(400).send(JSON.stringify(error_code));

  }



})





//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
// ocpp process start here!!!!
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------

const wss = new SocketServer({ server })
  //當 WebSocket 從外部連結時執行
  wss.on('connection', ws => {

      console.log('Client connected')
      //ws.send(com_data)
        ws.send("websocket server is ready")
        let clients = wss.clients



        app.get('/ocpp_1', function (req, res) {
          console.log('into /ocpp_1 proc:GetLocalListVersion')

        var tt_obj1=[2,"120","GetLocalListVersion",{}]
        clients.forEach(client => {
            client.send(JSON.stringify(tt_obj1))
        })
      //        ws.send(JSON.stringify(tt_obj1))
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj1))
        res.send("/ocpp_1 ok");
        })

        app.get('/ocpp_2', function (req, res) {
          console.log('into /ocpp_2 proc:GetConfiguration')
          //var tt_obj=[3,"667701","Reset",{"type":"Soft"}]
        var tt_obj=[2,"120","GetConfiguration",{"key":"HeartbeatInterval"}]
        clients.forEach(client => {
            client.send(JSON.stringify(tt_obj))
        })
          //    ws.send(JSON.stringify(tt_obj))
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
        res.send("/ocpp_2 ok");
        })

        app.get('/ocpp_3', function (req, res) {
          console.log('into /ocpp_2 proc:reset')
          var tt_obj=[2,"667701","Reset",{"type":"Soft"}]
      //  var tt_obj=[2,"120","GetConfiguration",{}]
        //      ws.send(JSON.stringify(tt_obj))
        clients.forEach(client => {
            client.send(JSON.stringify(tt_obj))
        })
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
        res.send("/ocpp_3 reset ok");
        })

        app.get('/ocpp_4', function (req, res) {
          console.log('into ocpp4 statusnotification RequestMessage,trigger')
          ocpp_id_send++;
          var tt_obj=[2,ocpp_id_send,"TriggerMessage",{"RequestedMessage":"StatusNotification","ConnectorId":1}]

        clients.forEach(client => {
            client.send(JSON.stringify(tt_obj))
        })
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
        res.send("ocpp4 RequestMessage,trigger ok");
        })

        app.get('/ocpp_5', function (req, res) {
          console.log('into Reserve now')
          var tt_obj=[2,"667701","ReserveNow",{"connectorId":"1","expiryDate":"","reservationId":"2022081207100003"}]
  tt_obj[3].expiryDate=new Date(+new Date() + 9 * 3600 * 1000).toISOString()
        clients.forEach(client => {
            client.send(JSON.stringify(tt_obj))
        })
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
        res.send("Reserve now ok");
        })

        app.get('/ocpp_6', function (req, res) {
          console.log('into change configuration')
          var tt_obj=[2,"667701","ChangeConfiguration",{"key":"HeartbeatInterval","value":"30"}]

      clients.forEach(client => {
            client.send(JSON.stringify(tt_obj))
        })
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
        res.send("change configuration ok");
        })

        app.get('/ocpp_7', function (req, res) {
          console.log('into RequestMessage,trigger:heartbeat')
          var tt_obj=[2,"667701","TriggerMessage",{"RequestedMessage":"StatusNotification","ConnectorId":1}]

        clients.forEach(client => {
            client.send(JSON.stringify(tt_obj))
        })
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
        res.send("RequestMessage,trigger:heartbeat ok");
        })

        app.get('/ocpp_8', function (req, res) {
          console.log('into RequestMessage,trigger:heartbeat')
          var tt_obj=[2,"667701","TriggerMessage",{"requestMessage":"FirmwareStatusNotification","connectorId":"1"}]

        clients.forEach(client => {
            client.send(JSON.stringify(tt_obj))
        })
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
        res.send("RequestMessage,trigger:heartbeat ok");
        })

        app.get('/ocpp_start_charging', function (req, res) {
          console.log('into /ocpp_start_charging')

          var tt_obj=[2,"cmd-start-charging","RemoteStartTransaction",{"idTag":idtag_id,"connectorId":1}]

        clients.forEach(client => {
            client.send(JSON.stringify(tt_obj))
        })
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
        res.send("/ocpp_start_charging ok");
      //  res.redirect("http://220.130.209.126:8086/start_to_charging");

        })

        app.get('/ocpp_stop_charging', function (req, res) {
          console.log('into /ocpp_stop_charging')

          var tt_obj=[2,"cmd-stop-charging","RemoteStopTransaction",{"connectorId":1,"transactionId":trans_id}]

        clients.forEach(client => {
            client.send(JSON.stringify(tt_obj))
        })
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
       res.send("/ocpp_stop_charging ok");
    //  res.redirect("http://220.130.209.126:8086/start_to_billing");

        })

        app.get('/ocpp_stop_charging_2', function (req, res) {
          console.log('into /ocpp_stop_charging')

          var tt_obj=[2,"667701","RemoteStopTransaction",{"connectorId":1,"transactionId":"12341234"}]

        clients.forEach(client => {
            client.send(JSON.stringify(tt_obj))
        })
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
       res.send("/ocpp_stop_charging ok");
    //  res.redirect("http://220.130.209.126:8086/start_to_billing");

        })

        app.get('/ocpp_get_meters', function (req, res) {
          console.log('into /ocpp_get_meters')
          //  ocpp_id_send++;
          var tt_obj=[2,"21b49e76-6d8b-4ea5-9e73-2f27d6338499","TriggerMessage",{"requestedMessage":"MeterValues","connectorId":1}]

        clients.forEach(client => {
            client.send(JSON.stringify(tt_obj))
        })
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
        res.send("RequestMessage /ocpp_get_meters ok");
        })

        app.get('/ocpp_set_chargingprofile', function (req, res) {
          console.log('into /ocpp_set_chargingprofile')
      //    cschargingprofile.chargingSchedule.chargingSchedulePeriod[0].limit = 5000.0 ;

        //  var tt_obj=[2,"667701","SetChargingProfile",{"connectorId":1,"csChargingProfiles": cschargingprofile}]
         var tt_obj=[2,"667701","SetChargingProfile",{"connectorId":1,"csChargingProfiles": cschargingprofile}]

        clients.forEach(client => {
            client.send(JSON.stringify(tt_obj))
        })
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
        res.send("/ocpp_set_chargingprofile");
      //  res.redirect("http://220.130.209.126:8086/start_to_charging");

        })


        app.get('/ocpp_set_to_5000', function (req, res) {
          console.log('into /ocpp_set_chargingprofile set to 5000')
      //    cschargingprofile.chargingSchedule.chargingSchedulePeriod[0].limit = 5000.0 ;

        //  var tt_obj=[2,"667701","SetChargingProfile",{"connectorId":1,"csChargingProfiles": cschargingprofile}]
         var tt_obj=[2,"667701","SetChargingProfile",{"connectorId":1,"csChargingProfiles": cschargingprofile}]

        clients.forEach(client => {
            client.send(JSON.stringify(tt_obj))
        })
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
        res.send("/ocpp_start_charging ok");
      //  res.redirect("http://220.130.209.126:8086/start_to_charging");

        })

        app.get('/ocpp_set_to_1000', function (req, res) {
          console.log('into /ocpp_set_chargingprofile set to 1000')
          cschargingprofile.chargingSchedule.chargingSchedulePeriod[0].limit = 1000 ;

          var tt_obj=[2,"667701","SetChargingProfile",{"connectorId":1,"csChargingProfiles": cschargingprofile}]

        clients.forEach(client => {
            client.send(JSON.stringify(tt_obj))
        })
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
        res.send("/ocpp_start_charging ok");
      //  res.redirect("http://220.130.209.126:8086/start_to_charging");

        })

        app.get('/test_send_to_kw', function (req, res) {
          console.log('into /test_send_to_kw')
          //send_cp_to_kw_api();
       to_kw_cp();

        })

        app.get('/test_mqtt_cmd', function (req, res) {
          console.log('into /test_mqtt_cmd')
          var tt_mqtt_data={
          "cmd":"mqtt_get_cp_data",
          "data1":"",
          "data2":""
        }
          client.publish('/mqtt_charger/cp_id/1001/cmd',JSON.stringify(tt_mqtt_data));


        })
      //對 message 設定監聽，接收從 Client 發送的訊息
      ws.on('message', data => {
         console.log("all_message:"+new Date(+new Date() + 8 * 3600 * 1000).toISOString()+data)
        // let send_to_mqtt_data = "1001_ocpp_RX:" +new Date(+new Date() + 8 * 3600 * 1000).toISOString()+data
         client.publish('/mqtt_charger/cp_id/1001/ocpp_raw',data);
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
            tt_obj[2].currentTime=new Date(+new Date() + 8 * 3600 * 1000).toISOString()
                ws.send(JSON.stringify(tt_obj))
        console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
        client.publish('/mqtt_charger/cp_id/1001/ocpp_raw',JSON.stringify(tt_obj));
        client.publish('/mqtt_charger/cp_id/1001/status',JSON.stringify({
          cpid: cpid,
          cmd:'report_cp_status',
          cp_online: cp_online,
          current_status: cp_current_status,
          data1: cp_data1,
          data2: cp_data2,
          data3: cp_data3,
          data4: cp_data4,
          data5: cp_data5,
          data6: cp_data6
        }));

    }

    if(j_aa[2]=="StatusNotification"){
      console.log('into "StatusNotification" proc')
    //  console.log('status='+j_aa[3].status)
    // status changed!!
      var status_temp = j_aa[3].status;
    if(status_temp == "SuspendedEV"){
      console.log("got SuspendedEV status!!!!!!!!!!")
    }else{

      if(cp_current_status!=j_aa[3].status){
        cp_current_status=j_aa[3].status;
        cp_status_changed();
      }

       cp_current_status=j_aa[3].status;
       console.log('status='+cp_current_status)
       var tt_obj=[3,6677543,{}]
        tt_obj[1]=j_aa[1]

           ws.send(JSON.stringify(tt_obj))
   console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
   client.publish('/mqtt_charger/cp_id/1001/ocpp_raw',JSON.stringify(tt_obj));
   client.publish('/mqtt_charger/cp_id/1001/status',JSON.stringify({
     cpid: cpid,
     cmd:'report_cp_status',
     cp_online: cp_online,
     current_status: cp_current_status,
     data1: cp_data1,
     data2: cp_data2,
     data3: cp_data3,
     data4: cp_data4,
     data5: cp_data5,
     data6: cp_data6
   }));
    }


    }

    if(j_aa[2]=="Heartbeat"){
      console.log('into "Heartbeat" proc')

      var tt_obj=[3,6677543,{"currentTime":"2022-10-04T15:05:486Z"}]
       tt_obj[1]=j_aa[1]
       tt_obj[2].currentTime=new Date(+new Date() + 8 * 3600 * 1000).toISOString()
           ws.send(JSON.stringify(tt_obj))
   console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
   client.publish('/mqtt_charger/cp_id/1001/ocpp_raw',JSON.stringify(tt_obj));
   // every 30sec get_meters
      get_meter_data();
    }

    if(j_aa[2]=="Authorize"){
      console.log('into "Authorize" proc')

      var tt_obj=[3,6677543,{"idTagInfo":{"status":"Accepted"}}]
       tt_obj[1]=j_aa[1]
         ws.send(JSON.stringify(tt_obj))
   console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
   client.publish('/mqtt_charger/cp_id/1001/ocpp_raw',JSON.stringify(tt_obj));

    }

    if(j_aa[2]=="StartTransaction"){
      console.log('into "StartTransaction" proc')
      //expiryDate=taipei time + 24h
      console.log('meterStart:' + j_aa[3].meterStart)
      meter_start= j_aa[3].meterStart / 1000;
      exp_time=new Date(+new Date() + 8 * 3600 * 1000 * 4).toISOString()
      var tt_obj=[3,6677543,{"idTagInfo":{"expiryDate":exp_time,"status":"Accepted","transactionId":trans_id}}]
       tt_obj[1]=j_aa[1]
         ws.send(JSON.stringify(tt_obj))
   console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
   client.publish('/mqtt_charger/cp_id/1001/ocpp_raw',JSON.stringify(tt_obj));

    }

    if(j_aa[2]=="StopTransaction"){
      console.log('into "StopTransaction" proc')
      //expiryDate=taipei time + 24h
      exp_time=new Date(+new Date() + 8 * 3600 * 1000 * 4).toISOString()
      var tt_obj=[3,6677543,{"idTagInfo":{"status":"Accepted"}}]
       tt_obj[1]=j_aa[1]
         ws.send(JSON.stringify(tt_obj))
   console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
   client.publish('/mqtt_charger/cp_id/1001/ocpp_raw',JSON.stringify(tt_obj));

    }

    if(j_aa[2]=="DataTransfer"){
      console.log('into "DataTransfer" proc')
      //expiryDate=taipei time + 24h
      exp_time=new Date(+new Date() + 8 * 3600 * 1000 * 4).toISOString()
      var tt_obj=[3,6677543,{"status":"Accepted"}]
       tt_obj[1]=j_aa[1]
         ws.send(JSON.stringify(tt_obj))
   console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
   client.publish('/mqtt_charger/cp_id/1001/ocpp_raw',JSON.stringify(tt_obj));

    }

    if(j_aa[2]=="MeterValues"){
      console.log('into "MeterValues" proc')
    //need to catch all_message[3].meterValue[0].sampledValue[0]=data1,[1]=data2,[4]=data3
  //  if(j_aa[3].transactionId > 0){    console.log('transactionId:'+ j_aa[3].transactionId);}

  //if(j_aa[3].meterValue[0].sampledValue[0].value>0){cp_data1 = j_aa[3].meterValue[0].sampledValue[0].value;}
  //if(j_aa[3].meterValue[0].sampledValue[2].value>0){cp_data2 = j_aa[3].meterValue[0].sampledValue[2].value;}
  //if(j_aa[3].meterValue[0].sampledValue[3].value>0){cp_data3 = j_aa[3].meterValue[0].sampledValue[3].value;}
  var temp_data1= j_aa[3].meterValue[0].sampledValue[4].value / 1000;
  cp_data1 = temp_data1.toFixed(3)-meter_start;
  cp_data1 = cp_data1.toFixed(3);
  if(cp_data1<0){cp_data1=0}
  cp_data2 = j_aa[3].meterValue[0].sampledValue[1].value;
  cp_data3 = j_aa[3].meterValue[0].sampledValue[0].value;

//  cp_data4 = j_aa[3].meterValue[0].sampledValue[4].value / 1000;
//  cp_data5 = meter_start;
//  cp_data5 = cp_data1-cp_data4;
             console.log('cp_data1_current:'+cp_data1);
              console.log('cp_data2:'+cp_data2);
              console.log('cp_data3:'+cp_data3);
              console.log('cp_data4_tatal:'+cp_data4);
               console.log('cp_data5_meterStart:'+cp_data5);
               console.log('cp_data6:'+cp_data6);

                console.log('metervalue_data0:'+ j_aa[3].meterValue[0].sampledValue[0].value);
                console.log('metervalue_data1:'+ j_aa[3].meterValue[0].sampledValue[1].value);
                console.log('metervalue_data2:'+ j_aa[3].meterValue[0].sampledValue[2].value);
                console.log('metervalue_data3:'+ j_aa[3].meterValue[0].sampledValue[3].value);
                console.log('metervalue_data4:'+ j_aa[3].meterValue[0].sampledValue[4].value);




    if(cp_current_status=="Charging"){send_cp_to_kw_api();}

      exp_time=new Date(+new Date() + 8 * 3600 * 1000 * 4).toISOString()
      var tt_obj=[3,6677543,{"status":"Accepted"}]
       tt_obj[1]=j_aa[1]
         ws.send(JSON.stringify(tt_obj))
   console.log('send_to_ev_charger_json:'+JSON.stringify(tt_obj))
   client.publish('/mqtt_charger/cp_id/1001/ocpp_raw',JSON.stringify(tt_obj));
   client.publish('/mqtt_charger/cp_id/1001/status',JSON.stringify({
     cpid: cpid,
     cmd:'report_cp_status',
     cp_online: cp_online,
     current_status: cp_current_status,
     data1: cp_data1,
     data2: cp_data2,
     data3: cp_data3,
     data4: cp_data4,
     data5: cp_data5,
     data6: cp_data6
   }));
   // get_ocpp_4_data();
    }


  console.log('end of ws.message')

      })

      ws.on('close', () => {
          console.log('Close connected')
      })
      ws.on('error', () => {
          console.log('ws is e')
      })
  })
