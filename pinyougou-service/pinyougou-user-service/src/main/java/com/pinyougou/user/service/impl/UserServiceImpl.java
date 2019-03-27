package com.pinyougou.user.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.alibaba.fastjson.JSON;
import com.pinyougou.common.util.HttpClientUtils;
import com.pinyougou.mapper.UserMapper;
import com.pinyougou.pojo.User;
import com.pinyougou.service.UserService;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.transaction.annotation.Transactional;
import tk.mybatis.mapper.entity.Example;

import java.io.Serializable;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * 用户服务接口实现类
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-03-16<p>
 */
@Service(interfaceName = "com.pinyougou.service.UserService")
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private RedisTemplate redisTemplate;

    @Value("${sms.url}")
    private String smsUrl;
    @Value("${sms.signName}")
    private String signName;
    @Value("${sms.templateCode}")
    private String templateCode;

    @Override
    public void save(User user) {
        try {
            // 密码需要MD5加密 commons-codec-xxx.jar
            user.setPassword(DigestUtils.md5Hex(user.getPassword()));
            // 创建时间
            user.setCreated(new Date());
            // 修改时间
            user.setUpdated(user.getCreated());
            userMapper.insertSelective(user);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    @Override
    public void update(User user) {
        try {

            user.setPassword(DigestUtils.md5Hex(user.getPassword()));

            user.setUpdated(new Date());

            userMapper.updateByUsername(user.getUsername(), user.getPassword(), user.getUpdated());

        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    @Override
    public void delete(Serializable id) {

    }

    @Override
    public void deleteAll(Serializable[] ids) {

    }

    @Override
    public User findOne(Serializable id) {
        return null;
    }

    @Override
    public List<User> findAll() {
        return null;
    }

    @Override
    public List<User> findByPage(User user, int page, int rows) {
        return null;
    }

    /**
     * 发送短信验证码
     */
    public boolean sendSmsCode(String phone) {
        try {
            // 1. 生成6位随机数字的验证码
            String code = UUID.randomUUID().toString().replaceAll("-", "")
                    .replaceAll("[a-zA-Z]", "").substring(0, 6);
            System.out.println("code: " + code);

            // 2. 调用短信发送接口
            // 创建 HttpClientUtils对象
            HttpClientUtils httpClientUtils = new HttpClientUtils(false);
            // 定义Map集合封装请求参数
            Map<String, String> params = new HashMap<>();
            params.put("phone", phone);
            params.put("signName", signName);
            params.put("templateCode", templateCode);
            params.put("templateParam", "{'code':'" + code + "'}");
            System.out.println(params);
            // 调用短信接口
            String content = httpClientUtils.sendPost(smsUrl, params);
            System.out.println(content);

            // 3. 如果发送成功，把验证码存储到Redis数据库
            Map map = JSON.parseObject(content, Map.class);
            boolean success = (boolean) map.get("success");
            if (success) {
                // 把验证码存储到Redis数据库，有效期90秒
                redisTemplate.boundValueOps(phone).set(code, 90, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    /**
     * 检验短信验证码
     */
    public boolean checkSmsCode(String phone, String code) {
        try {
            // 从Redis数据库获取短信验证码
            String oldCode = (String) redisTemplate.boundValueOps(phone).get();
            return oldCode != null && oldCode.equals(code);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    /**
     * 查询用户手机号码
     *
     * @param username
     */
    @Override
    public  Map<String, String> findUserPhone(String username) {

        try {
            Map<String, String> data = new HashMap<>();

            User user = userMapper.findUserByUsername(username);

            String phone = user.getPhone();

            data.put("phone", phone);

            String str = "****";

            if (StringUtils.isNoneBlank(phone)) {
                StringBuilder sb = new StringBuilder(phone);
                sb.replace(3, 7, str);

                data.put("hidePhone", sb.toString());
            }


            return data;
        } catch (Exception e) {
            throw new RuntimeException();
        }

    }

    /**
     * 修改用户手机号码
     *
     * @param user
     */
    @Override
    public void updatePhone(User user) {

        try {
            userMapper.updatePhone(user.getUsername(), user.getPhone());
        } catch (Exception e) {
            throw new RuntimeException();
        }

    }

    /**
     * 修改user
     * @param user
     */
    @Override
    public void saveUserInfo(User user) {
        try {

            userMapper.saveUserInfo(user);
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }
}
