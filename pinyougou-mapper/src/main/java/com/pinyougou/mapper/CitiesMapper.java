package com.pinyougou.mapper;

import org.apache.ibatis.annotations.Select;
import tk.mybatis.mapper.common.Mapper;

import com.pinyougou.pojo.Cities;

import java.util.List;

/**
 * CitiesMapper 数据访问接口
 * @date 2019-02-27 09:55:07
 * @version 1.0
 */
public interface CitiesMapper extends Mapper<Cities>{

@Select("select * from tb_cities where provinceid=#{id}")
    List<Cities> findCityByProvinceId(Long provinceId);
}