/**
 * Created by jerry on 2017/11/13.
 * users相关路由
 * 采用 restful api 风格
 */

var express = require('express');
var router = express.Router();
var indexRouter = {};
var accountController = require('../../../controllers/account');

//返回user的集合
router.get('/', accountController.find);

indexRouter.router = router;

module.exports = indexRouter;

