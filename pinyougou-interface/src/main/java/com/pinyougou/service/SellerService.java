package com.pinyougou.service;

import com.pinyougou.common.pojo.PageResult;
import com.pinyougou.pojo.Seller;
import java.util.List;
import java.io.Serializable;
/**
 * SellerService 服务接口
 * @date 2019-02-27 10:03:32
 * @version 1.0
 */
public interface SellerService {

	/** 添加方法 */
	void save(Seller seller);

	/** 修改方法 */
	void update(Seller seller);

	/** 根据主键id删除 */
	void delete(Serializable id);

	/** 批量删除 */
	void deleteAll(Serializable[] ids);

	/** 根据主键id查询 */
	Seller findOne(Serializable id);

	/** 查询全部 */
	List<Seller> findAll();

	/** 多条件分页查询 */
	PageResult findByPage(Seller seller, int page, int rows);

	/** 修改商家的审核状态 */
	void updateStatus(String sellerId, String status);
}