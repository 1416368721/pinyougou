package com.pinyougou.user.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.mapper.AreasMapper;
import com.pinyougou.pojo.Areas;
import com.pinyougou.service.AreasService;
import org.springframework.beans.factory.annotation.Autowired;
import tk.mybatis.mapper.entity.Example;

import java.io.Serializable;
import java.util.List;
@Service(interfaceName = "com.pinyougou.service.AreasService")
public class AreasServiceImpl implements AreasService {
    @Autowired
    private AreasMapper areasMapper;
    @Override
    public void save(Areas areas) {

    }

    @Override
    public void update(Areas areas) {

    }

    @Override
    public void delete(Serializable id) {

    }

    @Override
    public void deleteAll(Serializable[] ids) {

    }

    @Override
    public Areas findOne(Serializable id) {
        return null;
    }

    @Override
    public List<Areas> findAll() {
        return null;
    }

    @Override
    public List<Areas> findByPage(Areas areas, int page, int rows) {
        return null;
    }

    @Override
    public List<Areas> findAreasByCityId(Long cityId) {
       try {

         return   areasMapper.findAreasByCityId(cityId);
       }catch (Exception e){
           throw new RuntimeException(e);
       }
    }
}
