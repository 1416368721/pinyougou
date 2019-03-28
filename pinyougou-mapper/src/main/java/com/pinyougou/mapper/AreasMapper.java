package com.pinyougou.mapper;

import org.apache.ibatis.annotations.Select;
import tk.mybatis.mapper.common.Mapper;

import com.pinyougou.pojo.Areas;

import java.util.List;

/**
 * AreasMapper 数据访问接口
 * @date 2019-02-27 09:55:07
 * @version 1.0
 */
public interface AreasMapper extends Mapper<Areas>{

@Select("select * from tb_areas where cityid=#{id}")
    List<Areas> findAreasByCityId(Long cityId);
}