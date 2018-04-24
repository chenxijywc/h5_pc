/**
 * Created by jerry on 2017/11/13.
 * 用户相关api
 */
import * as API from './'

export default {
	
  //查询获取user列表(通过page分页)
  findList: params => {
    return API.GET('/api/v1/accounts', params)
  },
}
