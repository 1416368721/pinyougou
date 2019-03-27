package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.Address;
import com.pinyougou.pojo.Provinces;
import com.pinyougou.service.AddressService;
import com.pinyougou.service.ProvincesService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/address")
public class AddressController {
    @Reference(timeout = 10000)
    private AddressService addressService;
    @Reference(timeout = 10000)
    private ProvincesService provincesService;
    @GetMapping("/findAll")
    public List<Address> findAll(){

        return addressService.findAll();
    }
    @GetMapping("/delete")
    public boolean delete(Long[] ids){
        try {
            addressService.deleteAll(ids);
            return true;
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return false;
    }

    @GetMapping("/findProvinces")
    public List<Provinces> findAllProvicnes(){
        return provincesService.findAll();
    }
}
