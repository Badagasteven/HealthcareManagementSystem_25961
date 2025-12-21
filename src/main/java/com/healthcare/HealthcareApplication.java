package com.healthcare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.Map;

@SpringBootApplication
public class HealthcareApplication {
    
    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(HealthcareApplication.class, args);
        
        // Print all registered mappings
        RequestMappingHandlerMapping mapping = context.getBean(RequestMappingHandlerMapping.class);
        Map<RequestMappingInfo, HandlerMethod> map = mapping.getHandlerMethods();
        
        System.out.println("\n========================================");
        System.out.println("REGISTERED ENDPOINTS:");
        map.forEach((key, value) -> System.out.println(key + " -> " + value));
        System.out.println("========================================\n");
        
        System.out.println("Healthcare Management System is running!");
        System.out.println("Student ID: 25961");
        System.out.println("API Documentation: http://localhost:8080/api");
        System.out.println("========================================");
    }
}