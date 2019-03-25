package com.pinyougou.service;

import com.pinyougou.pojo.SeckillOrder;
import java.util.List;
import java.io.Serializable;
/**
 * SeckillOrderService 服务接口
 * @date 2019-02-27 10:03:32
 * @version 1.0
 */
public interface SeckillOrderService {

	/** 添加方法 */
	void save(SeckillOrder seckillOrder);

	/** 修改方法 */
	void update(SeckillOrder seckillOrder);

	/** 根据主键id删除 */
	void delete(Serializable id);

	/** 批量删除 */
	void deleteAll(Serializable[] ids);

	/** 根据主键id查询 */
	SeckillOrder findOne(Serializable id);

	/** 查询全部 */
	List<SeckillOrder> findAll();

	/** 多条件分页查询 */
	List<SeckillOrder> findByPage(SeckillOrder seckillOrder, int page, int rows);

	/** 保存秒杀订单到Redis数据库 */
    void submitOrderToRedis(String userId, Long id);

    /** 根据登录用户名，从Redis数据库获取秒杀预订单 */
	SeckillOrder findSeckillOrderFromRedis(String userId);

	/** 支付成功，保存秒杀订单到数据库表 */
	void saveOrder(String userId, String transactionId);

	/** 查询超时5分钟未支付的秒杀订单 */
    List<SeckillOrder> findOrderByTimeout();

    /** 从Redis数据库删除秒杀订单 */
	void deleteOrderFromRedis(SeckillOrder seckillOrder);
}