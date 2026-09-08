package com.skyroute;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * SkyRoute Enterprise Flight Booking & Management Platform
 * "Fly Smarter. Travel Better."
 */
@SpringBootApplication
@EnableTransactionManagement
@ConfigurationPropertiesScan
public class SkyRouteApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkyRouteApplication.class, args);
    }
}
