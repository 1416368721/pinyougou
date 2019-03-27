package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.Address;
import com.pinyougou.pojo.Areas;
import com.pinyougou.pojo.Cities;
import com.pinyougou.pojo.Provinces;
import com.pinyougou.service.AddressService;
import com.pinyougou.service.AreasService;
import com.pinyougou.service.CitiesService;
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
    @Reference(timeout = 10000)
    private CitiesService citiesService;
    @Reference(timeout = 10000)
    private AreasService areasService;
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
    /*查询所有省份*/
    @GetMapping("/findProvinces")
    public List<Provinces> findAllProvinces(){
        return provincesService.findAll();
    }
/*根据省份id查询区*/
@GetMapping("/findCity")
public List<Cities>findCityByProvinceId(Long provinceId){

    return citiesService.findCityByProvinceId(provinceId);
}
/*根据城市Id查询区*/
@GetMapping("/findArea")
public List<Areas>findAreasByCityId(Long cityId){
    return areasService.findAreasByCityId(cityId);
}
}
