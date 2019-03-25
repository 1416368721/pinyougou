package com.pinyougou.seckill.task;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.SeckillOrder;
import com.pinyougou.service.SeckillOrderService;
import com.pinyougou.service.WeixinPayService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 秒杀订单任务调度类
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-03-25<p>
 */
@Component
public class SeckillOrderTask {

    @Reference(timeout = 10000)
    private SeckillOrderService seckillOrderService;
    @Reference(timeout = 10000)
    private WeixinPayService weixinPayService;

    /**
     * 关闭超时未支付的订单
     * 任务调度方法(间隔3秒调度一次)
     * cron: 时间表达式 【秒 分 小时 日 月 周】
     */
    @Scheduled(cron = "0/3 * * * * ?")
    public void closeOrderTask(){

        System.out.println("当前时间：" + new Date());

        // 1. 查询超时5分钟未支付的秒杀订单
        List<SeckillOrder> seckillOrderList = seckillOrderService.findOrderByTimeout();

        System.out.println("超时未支付的订单数量：" + seckillOrderList.size());

        // 2. 调用微信支付系统的"关闭订单接口"
        for (SeckillOrder seckillOrder : seckillOrderList) {
            // 调用微信支付服务接口(关闭订单)
            Map<String,String> resMap = weixinPayService
                    .closePayTimeout(String.valueOf(seckillOrder.getId()));
            if (resMap != null && resMap.size() > 0){
                // 判断关单是否成功
                if ("SUCCESS".equals(resMap.get("result_code"))){
                    // 3. 关闭订单成功后，还需要从Redis中删除秒杀订单，增加存存
                    seckillOrderService.deleteOrderFromRedis(seckillOrder);
                }
            }

        }


    }
}
