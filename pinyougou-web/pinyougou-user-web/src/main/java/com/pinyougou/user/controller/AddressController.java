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

import javax.servlet.http.HttpServletRequest;
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

    /**
     * 前端传来的地址相关的信息
     * 这里是调用方法么，我是代理商来的，你别想骗我呀
     * 前端传来的是map集合么？？
     * 有没有带参数过去呢？？有吧
     * 这里传过去的是 对象一个address对象
     * @return 返回的是布尔值 要么成功要么失败
     */
    @PostMapping("/save")
    public boolean save(@RequestBody Address address, HttpServletRequest request){
        System.out.println(address);
        try {
            //获得当前用户名么，这里的用户名id是itcast 就只有这一个用户 String类型
            String userId = request.getRemoteUser();
            //存入去
            address.setUserId(userId);
            address.setIsDefault("0");
            addressService.save(address);
            return true;
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return false;
    }

    /** 修改地址 */
    @PostMapping("/update")
    public boolean update(@RequestBody Address address){
        try {
            addressService.update(address);
            return true;
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return false;
    }
}
