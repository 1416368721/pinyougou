package com.pinyougou.user.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.mapper.ProvincesMapper;
import com.pinyougou.pojo.Provinces;
import com.pinyougou.service.ProvincesService;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.Serializable;
import java.util.List;

@Service(interfaceName = "com.pinyougou.service.ProvincesService")
public class ProvincesServiceImpl implements ProvincesService {
    @Autowired
    private ProvincesMapper provincesMapper;
    @Override
    public void save(Provinces provinces) {

    }

    @Override
    public void update(Provinces provinces) {

    }

    @Override
    public void delete(Serializable id) {

    }

    @Override
    public void deleteAll(Serializable[] ids) {

    }

    @Override
    public Provinces findOne(Serializable id) {
        return null;
    }

    @Override
    public List<Provinces> findAll() {
        try {
        return provincesMapper.selectAll() ;
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Provinces> findByPage(Provinces provinces, int page, int rows) {
        return null;
    }
}
