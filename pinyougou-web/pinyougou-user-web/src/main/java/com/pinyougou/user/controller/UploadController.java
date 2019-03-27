package com.pinyougou.user.controller;

import org.apache.commons.io.FilenameUtils;
import org.csource.fastdfs.ClientGlobal;
import org.csource.fastdfs.StorageClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * 文件上传的控制器
 *

 */
@RestController
public class UploadController {

    /** 注入属性值 */
    @Value("${fileServerUrl}")
    private String fileServerUrl;

    /** 文件上传 */
    @PostMapping("/upload")
    public Map<String, Object> upload(@RequestParam("file")MultipartFile multipartFile){

        // {status : 200|500, url : ''}
        Map<String, Object> data = new HashMap<>();
        data.put("status", 500);
        try{
            // 1. 获取原文件名
            String filename = multipartFile.getOriginalFilename();

            // 2. 获取上传文件的字节数组
            byte[] bytes = multipartFile.getBytes();


            /** ######### FastDFS文件服务器(客户端编程部分) ########## */
            // 1. 加载fastdfs-client.conf配置文件
            String path = this.getClass().getResource("/fastdfs-client.conf").getPath();

            // 2. 初始化客户端全局对象
            ClientGlobal.init(path);

            // 3. 创建存储客户端对象
            StorageClient storageClient = new StorageClient();

            // 4. 把文件上传到FastDFS
            String[] arr = storageClient.upload_file(bytes,
                    FilenameUtils.getExtension(filename), null);

            // 5. 拼接图片访问的URL: http://192.168.12.131 / group1 / M00/00/00/xxx.jpg
            StringBuilder url = new StringBuilder(fileServerUrl);
            for (String str : arr){
                url.append("/" + str);
            }

            data.put("status", 200);
            data.put("url", url.toString());
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return data;
    }
}
