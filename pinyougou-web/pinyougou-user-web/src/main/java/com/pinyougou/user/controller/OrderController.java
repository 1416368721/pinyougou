package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.common.pojo.PageResult;
import com.pinyougou.pojo.Order;
import com.pinyougou.pojo.PayLog;
import com.pinyougou.service.OrderService;
import com.pinyougou.service.PayLogService;
import com.pinyougou.service.WeixinPayService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * date:2019/3/25;
 * author:xqq;
 */
@RestController
@RequestMapping("/order")
public class OrderController {
    @Reference(timeout = 10000)
    private OrderService orderService;
    @Reference(timeout = 10000)
    private WeixinPayService weixinPayService;
    @Reference(timeout = 10000)
    private PayLogService payLogService;

    @GetMapping("findByPage")
    public PageResult findByPage(Integer page, Integer rows, HttpServletRequest request){
        String userId = request.getRemoteUser();
        Order order = new Order();
        order.setUserId(userId);
        return orderService.findByPageByUserId(order,page,rows);
    }

    @GetMapping("/saveOrder")
    public boolean saveOrder(Long orderId,HttpServletRequest request){
        try {
            String userId = request.getRemoteUser();
            Order order = orderService.findOrderByOrderId(orderId);
            orderService.saveOrderToRedis(order,userId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @GetMapping("/genPayCode")
    public Map<String,Object> genPayCode(HttpServletRequest request){
        String userId = request.getRemoteUser();
        PayLog payLog = orderService.findPayLogFromRedis(userId);
        return weixinPayService.genPayCode(payLog.getOutTradeNo(), String.valueOf(payLog.getTotalFee()));
    }

    /** 检测支付状态 */
    @GetMapping("/queryPayStatus")
    public Map<String, Integer> queryPayStatus(String outTradeNo){
        Map<String, Integer> data = new HashMap<>();
        data.put("status", 3);
        try{
            // 调用微信支付服务接口
            Map<String, String> resMap = weixinPayService.queryPayStatus(outTradeNo);
            // 判断支付状态
            if (resMap != null && resMap.size() > 0){
                if ("SUCCESS".equals(resMap.get("trade_state"))){ // 支付成功

                    // 支付成功(业务处理)
                    // 修改支付状态、订单状态、删除支付日志
                    orderService.updateStatus(outTradeNo, resMap.get("transaction_id"));

                    data.put("status", 1);
                }
                if ("NOTPAY".equals(resMap.get("trade_state"))){ // 未支付
                    data.put("status", 2);
                }
            }
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return data;
    }
}
