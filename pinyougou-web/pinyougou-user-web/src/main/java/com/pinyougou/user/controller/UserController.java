package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.Areas;
import com.pinyougou.pojo.Cities;
import com.pinyougou.pojo.Provinces;
import com.pinyougou.pojo.User;
import com.pinyougou.service.AreasService;
import com.pinyougou.service.CitiesService;
import com.pinyougou.service.ProvincesService;
import com.pinyougou.service.UserService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * 用户控制器
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-03-16<p>
 */
@RestController
@RequestMapping("/user")
public class UserController {

    @Reference(timeout = 10000)
    private UserService userService;
    @Reference(timeout = 10000)
    private ProvincesService provincesService;
    @Reference(timeout = 10000)
    private CitiesService citiesService;
    @Reference(timeout = 10000)
    private AreasService areasService;
    /** 用户注册 */
    @PostMapping("/save")
    public boolean save(@RequestBody User user, String code) {
        try {
            // 检验短信验证码
            boolean flag = userService.checkSmsCode(user.getPhone(), code);
            if (flag) {
                userService.save(user);
            }
            return flag;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

    /**
     * 发送短信验证码
     */
    @GetMapping("/sendSmsCode")
    public boolean sendSmsCode(String phone) {
        try {
            return userService.sendSmsCode(phone);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

    /**
     * 修改用户密码
     */
    @PostMapping("/updatePassword")
    public boolean updatePassword(@RequestBody User user) {
        try {
            userService.update(user);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

    /**
     * 查询用户手机号码
     */
    @GetMapping("/findUserPhone")
    public Map<String, String> findUserPhone(String username) {

        Map<String, String> data = userService.findUserPhone(username);

        return data;
    }

    /**
     * 检验验证码
     */
    @GetMapping("/checkCode")
    public boolean checkCode(String verifyCode, String smsCode, String phone, HttpServletRequest request) {
        try {
            String oldCode = (String) request.getSession().getAttribute(VerifyController.VERIFY_CODE);

            boolean flag = false;
            if (verifyCode != null && verifyCode.equalsIgnoreCase(oldCode)) {
                flag = userService.checkSmsCode(phone, smsCode);
            }

            return flag;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    /** 修改用户手机号码 */
    @PostMapping("/updatePhone")
    public boolean updatePhone(@RequestBody User user) {
        try {
            userService.updatePhone(user);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
    /*查询所有省份*/
    @GetMapping("/findProvinces")
    public List<Provinces>findAllProvinces(){

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

/*保存用户信息*/
@PostMapping("/updateUserInfo")
    public boolean updateUserInfo(@RequestBody User user,HttpServletRequest request){
    try {
        String userId = request.getRemoteUser();
        user.setUsername(userId);
        user.setId(16L);
        userService.saveUserInfo(user);
        return true;
    }catch (Exception e){
        e.printStackTrace();
    }
    return false;
}
/*根据用户Id查询用户信息*/
@GetMapping("/findUser")
    public User findUserById(HttpServletRequest request){
    String userId = request.getRemoteUser();
    return userService.findUserById(userId);
}
}
