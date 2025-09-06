package com.youtubeclone.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "dkayzszon",
            "api_key", "363149978432912",
            "api_secret", "4pff766OTJjAFDTl6mKW9bNfmbI"
        ));
    }
}
