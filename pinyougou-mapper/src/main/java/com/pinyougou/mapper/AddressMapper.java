package com.pinyougou.mapper;

import org.apache.ibatis.annotations.Param;
import tk.mybatis.mapper.common.Mapper;

import com.pinyougou.pojo.Address;

import java.io.Serializable;
import java.util.List;

/**
 * AddressMapper 数据访问接口
 * @date 2019-02-27 09:55:07
 * @version 1.0
 */
public interface AddressMapper extends Mapper<Address>{

    List<Address> findAll(Address address);

    void deleteAll(@Param("ids")Serializable[] ids);


}