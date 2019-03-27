package com.pinyougou.user.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.mapper.CitiesMapper;
import com.pinyougou.pojo.Areas;
import com.pinyougou.pojo.Cities;
import com.pinyougou.service.CitiesService;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import tk.mybatis.mapper.entity.Example;

import java.io.Serializable;
import java.util.List;
@Service(interfaceName = "com.pinyougou.service.CitiesService")
public class CitiesServiceImpl implements CitiesService {

    @Autowired
    private CitiesMapper citiesMapper;
    @Override
    public void save(Cities cities) {

    }

    @Override
    public void update(Cities cities) {

    }

    @Override
    public void delete(Serializable id) {

    }

    @Override
    public void deleteAll(Serializable[] ids) {

    }

    @Override
    public Cities findOne(Serializable id) {
        return null;
    }

    @Override
    public List<Cities> findAll() {
        return null;
    }

    @Override
    public List<Cities> findByPage(Cities cities, int page, int rows) {
        return null;
    }
    /*根据省份id查询区*/
    @Override
    public List<Cities> findCityByProvinceId(Long provinceId) {
        try {
            return citiesMapper.findCityByProvinceId(provinceId);
        }catch (Exception e){
            throw new RuntimeException();
        }
    }
}
