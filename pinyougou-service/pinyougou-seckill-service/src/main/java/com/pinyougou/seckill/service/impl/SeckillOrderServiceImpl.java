package com.pinyougou.seckill.service.impl;
import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.common.util.IdWorker;
import com.pinyougou.mapper.SeckillGoodsMapper;
import com.pinyougou.mapper.SeckillOrderMapper;
import com.pinyougou.pojo.SeckillGoods;
import com.pinyougou.pojo.SeckillOrder;
import com.pinyougou.service.SeckillOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 秒杀订单服务接口实现类
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-03-23<p>
 */
@Service(interfaceName = "com.pinyougou.service.SeckillOrderService")
@Transactional
public class SeckillOrderServiceImpl implements SeckillOrderService {

    @Autowired
    private SeckillOrderMapper seckillOrderMapper;
    @Autowired
    private SeckillGoodsMapper seckillGoodsMapper;
    @Autowired
    private RedisTemplate redisTemplate;
    @Autowired
    private IdWorker idWorker;

    @Override
    public void save(SeckillOrder seckillOrder) {

    }

    @Override
    public void update(SeckillOrder seckillOrder) {

    }

    @Override
    public void delete(Serializable id) {

    }

    @Override
    public void deleteAll(Serializable[] ids) {

    }

    @Override
    public SeckillOrder findOne(Serializable id) {
        return null;
    }

    @Override
    public List<SeckillOrder> findAll() {
        return null;
    }

    @Override
    public List<SeckillOrder> findByPage(SeckillOrder seckillOrder, int page, int rows) {
        return null;
    }

    /**
     * 保存秒杀订单到Redis数据库
     * 该方法必须是线程安全的 synchronized 线程锁(一条进程)
     * 多进程中的线程是安全的：分布式锁(Redis、zookeeper、mysql) 1.txt
     * key: lock true
     *
     * 数据库本来就有锁: 如果事务引擎用得是innoDB，默认采用行级锁 (表锁)
     * */
    public synchronized void submitOrderToRedis(String userId, Long id){
        try{
            // 1. 秒杀下单，需要减库存(Redis中秒杀商品的库存)
            // 1.1 从Redis获取秒杀商品
            SeckillGoods seckillGoods = (SeckillGoods)redisTemplate
                    .boundHashOps("seckillGoodsList").get(id);
            if (seckillGoods != null && seckillGoods.getStockCount() > 0){
                // 1.2 减库存
                seckillGoods.setStockCount(seckillGoods.getStockCount() - 1);
                // 1.3 判断剩余库存数量
                if (seckillGoods.getStockCount() == 0){ // 秒光了
                    // 1.4 把秒杀商品同步到数据库
                    seckillGoodsMapper.updateByPrimaryKeySelective(seckillGoods);
                    // 1.5 从Redis数据库删除该秒杀商品
                    redisTemplate.boundHashOps("seckillGoodsList").delete(id);
                }else{
                    // 把秒杀重新存入到Redis
                    redisTemplate.boundHashOps("seckillGoodsList").put(id, seckillGoods);
                }

                // 2. 创建秒杀预订单
                SeckillOrder seckillOrder = new SeckillOrder();
                // 秒杀订单id
                seckillOrder.setId(idWorker.nextId());
                // 秒杀商品id
                seckillOrder.setSeckillId(id);
                // 秒杀订单金额
                seckillOrder.setMoney(seckillGoods.getCostPrice());
                // 用户id
                seckillOrder.setUserId(userId);
                // 商家id
                seckillOrder.setSellerId(seckillGoods.getSellerId());
                // 创建时间
                seckillOrder.setCreateTime(new Date());
                // 支付状态
                seckillOrder.setStatus("0");

                // 把秒杀的预订单存储到Redis数据库
                redisTemplate.boundHashOps("seckillOrderList").put(userId, seckillOrder);
            }

        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }

    /** 根据登录用户名，从Redis数据库获取秒杀预订单 */
    public SeckillOrder findSeckillOrderFromRedis(String userId){
        try{
            return (SeckillOrder)redisTemplate.
                    boundHashOps("seckillOrderList").get(userId);
        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }

    /** 支付成功，保存秒杀订单到数据库表 */
    public void saveOrder(String userId, String transactionId){
        try{
            // 从Redis数据库中获取秒杀订单
            SeckillOrder seckillOrder = findSeckillOrderFromRedis(userId);
            // 支付成功
            seckillOrder.setStatus("1");
            // 微信的订单号
            seckillOrder.setTransactionId(transactionId);
            // 支付时间
            seckillOrder.setPayTime(new Date());

            // 往秒杀订单表插入数据
            seckillOrderMapper.insertSelective(seckillOrder);

            // 从Redis数据库中删除秒杀订单
            redisTemplate.boundHashOps("seckillOrderList").delete(userId);
        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }

    /** 查询超时5分钟未支付的秒杀订单 */
    public List<SeckillOrder> findOrderByTimeout(){
        try{
            // 定义集合封装超时未支付的秒杀订单
            List<SeckillOrder> seckillOrders = new ArrayList<>();

            // 查询全部未支付的订单
            List<SeckillOrder> seckillOrderList = redisTemplate
                    .boundHashOps("seckillOrderList").values();
            // 迭代所有未支付的订单
            for (SeckillOrder seckillOrder : seckillOrderList) {
                // 判断秒杀订单是否超出了5分钟(订单的创建时间)
                // 当前时间 - 5分钟
                long date = new Date().getTime() - 5 * 60 * 1000;

                // 如果订单的创建时间小于date，代表该订单超时未支付
                if (seckillOrder.getCreateTime().getTime() < date){
                    seckillOrders.add(seckillOrder);
                }
            }
            return seckillOrders;
        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }

    /** 从Redis数据库删除秒杀订单 */
    public void deleteOrderFromRedis(SeckillOrder seckillOrder){
        try{
            // 1. 从Redis中删除超时未支付的秒杀订单
            redisTemplate.boundHashOps("seckillOrderList").delete(seckillOrder.getUserId());

            // 2. 增加库存(Redis数据库中的秒杀商品的库存)
            // 从Redis获取该秒杀商品
            SeckillGoods seckillGoods = (SeckillGoods)redisTemplate
                    .boundHashOps("seckillGoodsList").get(seckillOrder.getSeckillId());
            if (seckillGoods == null){ // 代表秒光了
                // 从数据库表中查询秒杀商品，再存入Redis
                seckillGoods = seckillGoodsMapper
                        .selectByPrimaryKey(seckillOrder.getSeckillId());
                // 设置剩余库存数量
                seckillGoods.setStockCount(1);
            }else{
                seckillGoods.setStockCount(seckillGoods.getStockCount() + 1);
            }
            // 把秒杀商品同步到Redis数据库
            redisTemplate.boundHashOps("seckillGoodsList")
                    .put(seckillGoods.getId(), seckillGoods);
        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }
}
