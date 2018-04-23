/**
 * users 控制器
 *
 * Created by jerry on 2017/11/2.
 */
const Accounts = require('../data/account');
let userController = {};
let _Accounts = Accounts;
/**
 * 通过书名查询，获取图书列表
 * @param req
 * @param res
 */
userController.find = function (req, res) {
  let page = parseInt(req.query.page || 1); //页码（默认第1页）
  let limit = parseInt(req.query.limit || 10); //每页显示条数（默认10条）
  let name = req.query.name || '';
  let total = 0;
  let resultUsers = [];
  if (name.length > 0) {
    let mockUsers = _Accounts.filter(user => {
      return (user.username.indexOf(name) > -1 || user.nickname.indexOf(name) > -1 || user.name.indexOf(name) > -1)
    });
    total = mockUsers.length; //总条数
    resultUsers = mockUsers.filter((u, index) => index < limit * page && index >= limit * (page - 1))
  } else {
    total = _Accounts.length; //总条数
    resultUsers = _Accounts.filter((u, index) => index < limit * page && index >= limit * (page - 1))
  }
  res.json({
    total: total,
    limit: limit,
    accounts: resultUsers
  })
};

module.exports = userController;
