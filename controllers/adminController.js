const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodeMailer = require('../utils/nodemailer')
const db = require('../models')
const axios = require('axios')
const User = db.User
const Product = db.Product
const Order = db.Order
const Cp_log = db.Cp_log
const Cp_gun_data = db.Cp_gun_data
const Gun = db.Gun

const adminController = {
  /*
     功能: get show_current_cp
     方法: get
  */
  show_current_cp: async (req, res) => {
        console.log("post_edit_cp_req.body:"+JSON.stringify(req.params))
    try {
      const id = req.params.id
      const current_gun = await Gun.findByPk(id)
  console.log("currentguncpid="+current_gun.cpid)
      return res.render('admin/show_current_cp', { current_gun : current_gun.toJSON() } )
    } catch (e) {
      console.log(e)
    }
  },
  /*
     功能: cp修改 post_edit_cp
     方法: PUT
     參數: name, description, price, image
  */
  post_edit_cp: async (req, res) => {
      console.log("post_edit_cp_req.body:"+JSON.stringify(req.body))


    try {
      const id = req.params.id
      const guns = await Gun.findByPk(id)

      await guns.update({
        cpid: req.body.cpid,
        connector: req.body.connector,
         cpsn: req.body.cpsn,
         guns_memo1: req.body.guns_memo1

      })
      return res.redirect('/admin/cp_list')
    } catch (e) {
      console.log(e)
    }
  },
  /*
     功能: 商品刪除
     方法: DELETE
  */
  post_del_cp: async (req, res) => {
    try {
      const id = req.params.id
      const guns = await Gun.findByPk(id)
      await guns.destroy()
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },
  /*
     功能: 註冊商品 post_add_cp
     方法: POST
     參數: name, description, price, image
  */
  post_add_cp: async (req, res) => {
  //  const cp_list = await Gun.findAll({ raw: true, nest: true })
      console.log("post_add_cp_req.body:"+JSON.stringify(req.body))
    try {

      await Gun.create({
      cpid: req.body.cpid,
      connector: req.body.connector,
       cpsn: req.body.cpsn,
       guns_memo1: req.body.guns_memo1

      })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },
  /*
     功能: get gun/cp list
     方法: GET
  */
  cp_list: async (req, res) => {
    try {
      const cp_list = await Gun.findAll({ raw: true, nest: true })
    //  return res.render('admin/products', { products })
    var now_time=new Date(+new Date() + 8 * 3600 * 1000).toISOString()
          //  var total_charging_time = now_time - ocpp.guns_memo3
          cp_list[0].guns_memo5=  cp_list[0].guns_memo4 - cp_list[0].guns_memo3
      return res.render('admin/cp_list', { cp_list })
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: get ocpp log list
     方法: GET
  */
  ocpp_log_list: async (req, res) => {
    try {
      const ocpp_log_list = await Cp_log.findAll({order:[["id","DESC"]],limit:20, raw: true, nest: true })
    //  return res.render('admin/products', { products })
      return res.render('admin/ocpp_log_list', { ocpp_log_list })
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 所有產品頁面
     方法: GET
  */
  add_cp: async (req, res) => {
    try {
      const all_cps = await Gun.findAll({ raw: true, nest: true })
    //  return res.render('admin/products', { products })
      return res.render('admin/add_cp', { all_cps })
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: admin start_charging
     方法: GET
  */
  start_charging: async (req, res) => {
    console.log("start_charging_cpid:"+JSON.stringify(req.params.id))
    const id = req.params.id
      const api = 'http://localhost:8089/ocpp/spacepark_cp_api';
    axios.post(api,{
      apikey:'cp_api_key16888',
      cp_id: id,
      cmd:'cmd_start_charging',

  })
  .then(function (response) {
    //这里获得整个请求响应对象
    //console.log(response);
    var aaa=response.data;
    var bbb=JSON.stringify(aaa);
    console.log('benson_csms_api_back:'+ bbb);
  return res.redirect('back')
  })
  .catch(function (error) {
  //  console.log(error);
      console.log("benson_csms_error");
  })
  .then(function () {
  });

  },
  /*
     功能: admin stop_charging
     方法: GET
  */
  stop_charging: async (req, res) => {
    console.log("stop_charging_cpid:"+JSON.stringify(req.params.id))
    const id = req.params.id
      const api = 'http://localhost:8089/ocpp/spacepark_cp_api';
    axios.post(api,{
      apikey:'cp_api_key16888',
      cp_id: id,
      cmd:'cmd_stop_charging',

  })
  .then(function (response) {
    //这里获得整个请求响应对象
    //console.log(response);
    var aaa=response.data;
    var bbb=JSON.stringify(aaa);
    console.log('benson_csms_api_back:'+ bbb);
return res.redirect('back')
  })
  .catch(function (error) {
  //  console.log(error);
      console.log("benson_csms_error");
  })
  .then(function () {
  });

  },
  /*
      功能: 管理者登入頁面
      方法: GET
  */
  signInPage: (req, res) => {
    const { email } = req.session
    return res.render('admin/signin', { email })
  },

  /*
      功能: 管理者登入
      方法: POST
      參數: email, password
  */
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body

      // 尋找管理者
      const user = await User.findOne({ where: { email } })

      // email 錯誤
      if (!user) {
        req.flash('warning_msg', '信箱錯誤')
        return res.redirect('/admin/sign-in')
      }

      // 管理者
      if (user.role !== 'admin') {
        req.flash('danger_msg', '非管理者')
        return res.redirect('/admin/sign-in')
      }

      // 解密
    //  const hashPassword = await bcrypt.compare(password, user.password)

      // 密碼錯誤
    //  if (!hashPassword) {
  //      req.flash('warning_msg', '密碼錯誤')
  //      return res.redirect('/users/sign-in')
  //    }

     if(password !== user.password){
       req.flash('warning_msg', '密碼錯誤')
        return res.redirect('/users/sign-in')
     }

      // 發放 token
      const payload = { id: user.id }
      const expiresIn = { expiresIn: '24h' }
      const token = jwt.sign(payload, process.env.JWT_SECRET, expiresIn)

      // 存入 session
      req.session.email = email
      req.session.token = token

      req.flash('success_msg', '登出成功')
      return res.redirect('/admin/cp_list')
    } catch (e) {
      console.log(e)
    }
  },

  /*
      功能: 管理者登出
      方法: GET
  */
  signOut: (req, res) => {
    req.logout()
    req.session.email = ''
    req.session.token = ''
    return res.redirect('/admin/sign-in')
  },

  /*
     功能: 所有產品頁面
     方法: GET
  */
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll({ raw: true, nest: true })
    //  return res.render('admin/products', { products })
      return res.render('admin/cp_products', { products })
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 註冊商品
     方法: POST
     參數: name, description, price, image
  */
  postProducts: async (req, res) => {
    try {
      const file = req.file
      if (!file) {
        await Product.create({ ...req.body })
        return res.redirect('back')
      }
      await Product.create({
        ...req.body,
        image: `/upload/${req.file.filename}`
      })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 商品詳細
     方法: GET
  */
  getProduct: async (req, res) => {
    try {
      const status = 1
      const id = req.params.id
      const [product, products] = await Promise.all([
        Product.findByPk(id),
        Product.findAll({ raw: true, nest: true })
      ])
      return res.render('admin/products', { product: product.toJSON(), products, status })
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 商品修改
     方法: PUT
     參數: name, description, price, image
  */
  editProduct: async (req, res) => {
    try {
      const id = req.params.id
      const product = await Product.findByPk(id)
      const file = req.file
      if (!file) {
        await product.update({ ...req.body })
        return res.redirect('/admin/products')
      }
      await product.update({
        ...req.body,
        image: req.file.originalname
      })
      return res.redirect('/admin/products')
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 商品刪除
     方法: DELETE
  */
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id
      const product = await Product.findByPk(id)
      await product.destroy()
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 所有訂單
     方法: GET
  */
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({ raw: true, nest: true })
      return res.render('admin/orders', { orders })
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 訂單詳細
     方法: GET
  */
  getOrder: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id, { include: 'items' })
      return res.render('admin/order', { order: order.toJSON() })
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 訂單運送狀態-shipping_status:1已出貨
     方法: POST
     參數: params.id
  */
  shipOrder: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id)
      await order.update({ shipping_status: 1 })

      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 訂單運送狀態-shipping_status:2已出貨
     方法: POST
     參數: params.id
  */
  shipOrder_user_received: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id)
      await order.update({ shipping_status: 2 })

      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 訂單取消
     方法: POST
     參數: params.id
  */
  cancelOrder: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id)
      await order.update({ shipping_status: -1 })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 訂單恢復
     方法: POST
     參數: params.id
  */
  recoverOrder: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id)
      await order.update({ shipping_status: 0 })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 取得所有使用者
     方法: GET
  */
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({ raw: true, nest: true })
      return res.render('admin/users', { users })
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 使用者權限修改
     方法: POST
     參數: params.id
  */
  changeAuth: async (req, res) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id)
      user.role === 'admin' ? await user.update({ role: 'user' }) : await user.update({ role: 'admin' })
      return res.redirect('/admin/authority')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController
