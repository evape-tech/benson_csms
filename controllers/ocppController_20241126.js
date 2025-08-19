const db = require('../models')
const Order = db.Order
const OrderItem = db.OrderItem
const Cart = db.Cart
const Payment = db.Payment
const Cp_log = db.Cp_log
const nodeMailer = require('../utils/nodemailer')
const mpgData = require('../utils/mpgData')
const axios = require('axios')
const ecpay_payment = require('ecpay_aio_nodejs')
const util = require('util')
const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors')

const app = new express();
expressWs(app);
const wsClients = {}
//app.wsClients = wsClients;
//const express = require('express')
//const route = express.Router() // 实例化路由对象


const ocppController = {
  /*
     功能: ocpp test
     方法: get

  */
  ocpp_test: async (req, res) => {
      console.log("into ocpp_test")
      var cpid = "1001"
     return res.render('ocpp', {cpid})

  },
  /*
     功能: ocpp see connections
     方法: get

  */
  ocpp_see_connections: async (req, res) => {
      console.log("into ocpp_see_connections")
      setInterval(() => {
          // 定时打印连接池数量
          console.log('websocket connection counts:')
          Object.keys(wsClients).forEach(key => {
              console.log(key, ':', wsClients[key].length);
          })
          console.log('-----------------------------');
      }, 5000);
      res.send("ok");

  },

  /*
     功能: ocpp test
     方法: get

  */
  ocpp_cpid: async (req, res) => {
      console.log("into get_ocpp_cpid")
      const cpid = req.params.id
      var from = "benson:"
    const result = { succeed: true };
    if(wsClients[cpid] !== undefined) {
        wsClients[cpid].forEach((client) => {
            client.send(JSON.stringify({
                from,
                content: "slkerjw"
            }));
        });
    } else {
        // 如果消息接收方没有连接，则返回错误信息
        result.succeed = false;
        result.msg = '对方不在线';
    }
    res.json(result);

  },


  /*
     功能: ocpp test
     方法: get

  */

  ocpp_ws: async (ws, req) => {
    /*
    setInterval(() => {
        // 定时打印连接池数量
        console.log('websocket connection counts:')
        Object.keys(wsClients).forEach(key => {
            console.log(key, ':', wsClients[key].length);
        })
        console.log('-----------------------------');
    }, 5000);
 */
         console.log('连接成功')
         var ocpp_message="";
              const id = req.params.id;
        var jj_data=JSON.stringify(ws);
         console.log("req.params="+req.params.id);
      //      console.log("req.all="+jj_data);
         if(!wsClients[req.params.id]) {
             wsClients[req.params.id] = []
         }
         // 将连接记录在连接池中
         wsClients[req.params.id].push(ws);

         ws.on('message', data => {
             //data 為 Client 發送的訊息，現在將訊息原封不動發送出去
                  console.log("message="+req.params.id+data );
                  ocpp_message = data
               ws.send("server_feedback:"+req.params.id+":"+data)
               // 建立 cp_log
          Cp_log.create({
                 cpid: id,
                 cpsn: id,
                 log: ocpp_message,
                 time: new Date(),
                 inout: "in",
               })



         })

         ws.onclose = () => {
             // 连接关闭时，wsClients进行清理
             wsClients[req.params.id] = wsClients[req.params.id].filter((client) => {
                 return client !== ws;
             });
             if(wsClients[req.params.id].length === 0) {
                 delete wsClients[req.params.id];
             }
         }

/*
         //start to creat
         try {
             const id = req.params.id
               console.log("cp_id="+id)
           // 訂單
        //   const order = await Order.findOne({ where: { sn: id } })


             // 建立 payment
             await Cp_log.create({
               id: 2,
               cpid: id,
               cpsn: id,
               log: "test",
               inout: "in",
             })


        //     req.flash('success_msg', `訂單編號:${order.id} Linepay付款成功!`)
        console.log("update ok")
        //   return res.redirect(`/order/${order.id}`)
              return res.send("cp log update ok")
         } catch (e) {
           console.log(e)
         }
         //end of creat
*/

  },

/*
  ocpp_ws: async (ws, req) => {

         console.log('连接成功')
      //   var jj_data=JSON.stringify(ws);
         console.log("req.params="+req.params.id);
    //  var jj_data= ws.getWss()
      //  console.log("jj_data="+jj_data);
         console.log("clients="+ wsClients);
         ws.send("this is websocket server");
         ws.on('message', function (msg) {
           ws.send(`收到客户端的消息为：${msg}，再返回去`)
           console.log("jj_data="+msg);
         })
         ws.on('close', function (e) {
               console.log('连接关闭')
              })

  },
*/


  /*
     功能: ecpay 交易後回傳
     方法: get

  */
  ecpay_into_db_payment: async (req, res) => {
      console.log("into ecpay into_db_payment")
        console.log("call robot")

      axios.get('http://rcu.dq1.tw:8093/robot_auto_sale',{
        //URL参數放在params屬性裏面
        params: {
            final_target: '101'
        }
    })
    .then((response) => console.log(response.data))
    .catch((error) => console.log(error))

    try {
        const id = req.params.id
          console.log("sn_id="+id)
      // 訂單
      const order = await Order.findOne({ where: { sn: id } })


        // 建立 payment
        await Payment.create({
          OrderId: order.id,
          payment_method: "ecpay",
          isSuccess: true,
          failure_message: "ecpay messages",
          payTime: new Date()
        })
        await order.update({
          ...req.body,
          payment_status: '1'
        })

        req.flash('success_msg', `訂單編號:${order.id} 信用卡(綠界ECpay)付款成功!`)

      return res.redirect(`/order/${order.id}`)
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: ecpay result (from https://4bec-59-125-1-112.ngrok-free.app/order/ecpay/callback)
     方法: post
  */
  ecpay_call_back: async (req, res) => {
    console.log("into_ecpay_call_back");
    var jj_data=JSON.stringify(req.params);
    console.log("req.params="+req.params);
    console.log("jj_data="+jj_data);
      console.log("req.body="+req.body);
          jj_data=JSON.stringify(req.body);
        console.log("req="+jj_data);
        //"MerchantTradeNo"
                console.log("MerchantTradeNo(sn)="+req.body.MerchantTradeNo);

       return res.redirect(`/order/ecpay_into_db_payment/${req.body.MerchantTradeNo}`)
        },
        /*
           功能: ecpay Client端方式(POST)(OrderResultURL) (from https://4bec-59-125-1-112.ngrok-free.app/order/ecpay/callback)
           方法: post
        */
        ecpay_return_url: async (req, res) => {
          console.log("into_ecpay_return_url");
        //  var jj_data=JSON.stringify(req.params);
        //  console.log("req.params="+req.params);
        //  console.log("jj_data="+jj_data);
           return res.send("1|OK")
              },


  /*
     功能: ecpay_all test
     方法: get
  */
  ecpay_all: async (req, res) => {
      console.log("into_ecpay_all")
    const id = req.params.id
    const order = await Order.findByPk(id)
      var ecpayorder_id=order.sn
    let base_param = {
      MerchantTradeNo: 'spacepark', //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
      MerchantTradeDate: '2017/02/13 15:45:31', //ex: 2017/02/13 15:45:30
      TotalAmount: '1000',
      TradeDesc: 'spacepark',
      ItemName: 'charger',
      ReturnURL: 'https://4bec-59-125-1-112.ngrok-free.app/order/ecpay_return_url',
      // ChooseSubPayment: '',
       OrderResultURL: 'https://4bec-59-125-1-112.ngrok-free.app/order/ecpay_callback',
      // NeedExtraPaidInfo: '1',
       ClientBackURL: 'https://4bec-59-125-1-112.ngrok-free.app',
      // ItemURL: 'http://item.test.tw',
      // Remark: '交易備註',
      // HoldTradeAMT: '1',
      // StoreID: '',
      // CustomField1: '',
      // CustomField2: '',
      // CustomField3: '',
      // CustomField4: ''
    }

    const options = {
      "OperationMode": "Test", //Test or Production
      "MercProfile": {
        "MerchantID": "2000132",
        "HashKey": "5294y06JbISpM5x9",
        "HashIV": "v77hoKGq4kWxNNIS"
      },
      "IgnorePayment": [
    //    "Credit",
    //    "WebATM",
    //    "ATM",
    //    "CVS",
    //    "BARCODE",
    //    "AndroidPay"
      ],
      "IsProjectContractor": false
    }
    //電子發票
    let inv_params = {
      // RelateNumber: 'PLEASE MODIFY',  //請帶30碼uid ex: SJDFJGH24FJIL97G73653XM0VOMS4K
      // CustomerID: 'MEM_0000001',  //會員編號
      // CustomerIdentifier: '',   //統一編號
      // CustomerName: '測試買家',
      // CustomerAddr: '測試用地址',
      // CustomerPhone: '0123456789',
      // CustomerEmail: 'johndoe@test.com',
      // ClearanceMark: '2',
      // TaxType: '1',
      // CarruerType: '',
      // CarruerNum: '',
      // Donation: '2',
      // LoveCode: '',
      // Print: '1',
      // InvoiceItemName: '測試商品1|測試商品2',
      // InvoiceItemCount: '2|3',
      // InvoiceItemWord: '個|包',
      // InvoiceItemPrice: '35|10',
      // InvoiceItemTaxType: '1|1',
      // InvoiceRemark: '測試商品1的說明|測試商品2的說明',
      // DelayDay: '0',
      // InvType: '07'
    }


    var create = new ecpay_payment(options)
    var send_data_to_ecpay={};
    send_data_to_ecpay=base_param;
    send_data_to_ecpay.MerchantTradeNo=ecpayorder_id;
    var htm = create.payment_client.aio_check_out_all(parameters = send_data_to_ecpay, invoice = inv_params)
  //    var htm = create.payment_client.aio_check_out_all(parameters = base_param, invoice = inv_params)
    console.log(htm)
    //res.sendFile( htm );
      return res.send( htm );
  },
  /*
     功能: 交易後回傳
     方法: get

  */
  into_db_payment: async (req, res) => {
      console.log("into into_db_payment")
        console.log("call robot")
      axios.get('http://rcu.dq1.tw:8093/robot_auto_sale',{
        //URL参數放在params屬性裏面
        params: {
            final_target: '101'
        }
    })
    .then((response) => console.log(response.data))
    .catch((error) => console.log(error))

    try {
        const id = req.params.id
          console.log("sn_id="+id)
      // 訂單
      const order = await Order.findOne({ where: { sn: id } })


        // 建立 payment
        await Payment.create({
          OrderId: order.id,
          payment_method: "linepay",
          isSuccess: true,
          failure_message: "linepay messages",
          payTime: new Date()
        })
        await order.update({
          ...req.body,
          payment_status: '1'
        })

        req.flash('success_msg', `訂單編號:${order.id} Linepay付款成功!`)

      return res.redirect(`/order/${order.id}`)
    } catch (e) {
      console.log(e)
    }
  },
  /*
     功能: linepay result
     方法: GET
  */
  linepay_result: async (req, res) => {
    console.log('linepay_success:transactionId',req.query.transactionId);
    var linepay_confirm_url="https://sandbox-api-pay.line.me/v2/payments/"+req.query.transactionId+"/confirm";
      console.log(linepay_confirm_url);

          axios({
          method: 'post',
          //baseURL: 'https://iot.cht.com.tw',
          url: linepay_confirm_url,
          headers: {
                    'Content-Type': 'application/json',
                    'X-LINE-ChannelID': '1657416589',
                    'X-LINE-ChannelSecret': '61e3e5036842dba1a852f6feccab91de'
                   },
          data: {
              "amount":100,
              "currency":"TWD"
          },

          })
          .then((result) => {
            console.log(result.data)
            console.log(result.data.info)
              console.log(result.data.info.orderId)
            console.log(result.data.info.transactionId)
          //  return  res.send('<H2>恭喜Linepay支付成功!</H2></br>'+'linepay交易碼:'+result.data.info.transactionId)
            console.log("恭喜Linepay支付成功!")
              return res.redirect(`/order/sn/${result.data.info.orderId}`)
          })
            .catch((err) => { console.error(err) })
        },


  /*
     功能: linepay test
     方法: post
  */
  linepay_test: async (req, res) => {
    const id = req.params.id
    const order = await Order.findByPk(id)
    var linepayorder_id=order.sn
    console.log("linepayorder_id="+linepayorder_id)
    var send_body_data={
      "amount":100,
      "productImageUrl":"",
      "confirmUrl":"https://4bec-59-125-1-112.ngrok-free.app/order/linepay/result",
      "productName":"linepay測試",
      "orderId":linepayorder_id,
      "currency":"TWD"
    }
    //send_body_data.orderId="benson"+linepayorder_id;

    //linepayorder_id++
    axios({
    method: 'post',
    //baseURL: 'https://iot.cht.com.tw',
    url: 'https://sandbox-api-pay.line.me/v2/payments/request',
    headers: {
              'Content-Type': 'application/json',
              'X-LINE-ChannelID': '1657416589',
              'X-LINE-ChannelSecret': '61e3e5036842dba1a852f6feccab91de'
             },
    data: send_body_data,

    })
    .then((result) => {
      console.log(result.data)
      console.log(result.data.info.paymentUrl.web)

      console.log(result.data.info.transactionId)
      return res.redirect(301,result.data.info.paymentUrl.web)

     })
    .catch((err) => { console.error(err) })
  },
  /*
     功能: 取得所有訂單
     方法: GET
  */
  getOrders: async (req, res) => {
    try {
      const ordersHavingProducts = await Order.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.user.id },
        include: 'items'
      })
      const orders = await Order.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.user.id }
      })
      orders.forEach(order => { order.items = [] })
      ordersHavingProducts.forEach(product => {
        const index = orders.findIndex(order => order.id === product.id)
        if (index === -1) return
        orders[index].items.push(product.items)
      })
      return res.render('orders', { orders })
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 個別訂單
     方法: GET
     參數: params.id
  */
  getOrder: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id, { include: 'items' })
      if (order.toJSON().payment_status === '0') {
        const tradeData = mpgData.getData(order.amount, 'Diving Park-精選商品', req.user.email)
        await order.update({ sn: tradeData.MerchantOrderNo.toString() })
        return res.render('order', { order: order.toJSON(), tradeData })
      } else {
        const paidOrder = true
        return res.render('order', { order: order.toJSON(), paidOrder })
      }
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 訂購清單
     方法: GET
     參數: user.id
  */
  fillOrderData: async (req, res) => {
    try {
      const UserId = req.user.id
      const cart = await Cart.findOne({ where: { UserId }, include: 'items' })
      if (!cart || !cart.items.length) {
        req.flash('warning_msg', '購物車空空的唷!')
        return res.redirect('/cart')
      }

      const cartId = cart.id
      const amount = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('orderInfo', { cartId, amount })
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 建立訂單
     方法: POST
     參數: name, address, phone, amount, shipping_status, payment_status
  */
  postOrder: async (req, res) => {
        console.log("/into postOrder dskdjfs")
        //測試直接送出機器人指令
        /*
        axios.get('http://rcu.dq1.tw:8093/robot_auto_sale',{
          //URL参數放在params屬性裏面
          params: {
              final_target: '101'
          }
      })
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error))
      */
    try {
      const { cartId } = req.body
      const cart = await Cart.findByPk(cartId, { include: 'items' })
      // 建立訂單
      let order = await Order.create({
        ...req.body,
        UserId: req.user.id
      })
      order = order.toJSON()
      const items = Array.from({ length: cart.items.length })
        .map((_, i) => (
          OrderItem.create({
            OrderId: order.id,
            ProductId: cart.items[i].dataValues.id,
            price: cart.items[i].dataValues.price,
            quantity: cart.items[i].CartItem.dataValues.quantity
          })
        ))

      await Promise.all(items)



      // 清空購物車
      await cart.destroy()
      req.session.cartId = ''
      return res.redirect(`/order/${order.id}`)
    } catch (e) {
      console.log(e)
    }


  },

  /*
     功能: 取消訂單
     方法: POST
     參數: params.id
  */
  cancelOrder: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id)
      await order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1'
      })
      req.flash('success_msg', '訂單已取消')
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 交易後回傳
     方法: POST
     參數: MerchantID, TradeInfo, TradeSha, Version
  */
  newebpayCallback: async (req, res) => {
    try {
      const data = JSON.parse(mpgData.decryptData(req.body.TradeInfo))
      // 訂單
      const order = await Order.findOne({ where: { sn: data.Result.MerchantOrderNo } })

      if (data.Status === 'SUCCESS') {
        // 建立 payment
        await Payment.create({
          OrderId: order.id,
          payment_method: data.Result.PaymentMethod ? data.Result.PaymentMethod : data.Result.PaymentType,
          isSuccess: true,
          failure_message: data.Message,
          payTime: data.Result.PayTime
        })
        await order.update({
          ...req.body,
          payment_status: '1'
        })

        req.flash('success_msg', `訂單編號:${order.id} 付款成功!`)
      } else {
        req.flash('warning_msg', `訂單編號:${order.id} 付款失敗!  [說明] ${data.Message}`)
      }
      return res.redirect(`/order/${order.id}`)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = ocppController
