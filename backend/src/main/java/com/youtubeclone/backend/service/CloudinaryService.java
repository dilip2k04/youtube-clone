package com.youtubeclone.backend.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    // Upload video with better error handling
    public Map<String, String> uploadVideo(MultipartFile file) throws IOException {
        try {
            System.out.println("Starting Cloudinary upload for file: " + file.getOriginalFilename());
            System.out.println("File size: " + file.getSize() + " bytes");
            System.out.println("Content type: " + file.getContentType());

            // Upload to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "resource_type", "video",
                    "chunk_size", 6000000, // 6MB chunks for large files
                    "timeout", 120000 // 2 minute timeout
                )
            );

            System.out.println("Cloudinary upload successful: " + uploadResult);

            return Map.of(
                "url", (String) uploadResult.get("secure_url"),
                "public_id", (String) uploadResult.get("public_id")
            );

        } catch (Exception e) {
            System.err.println("Cloudinary upload failed: " + e.getMessage());
            e.printStackTrace();
            throw new IOException("Cloudinary upload failed: " + e.getMessage(), e);
        }
    }

    // Delete video by public_id
    public void deleteVideo(String publicId) throws IOException {
        try {
            Map result = cloudinary.uploader().destroy(
                publicId, 
                ObjectUtils.asMap("resource_type", "video")
            );
            System.out.println("Cloudinary deletion result: " + result);
        } catch (Exception e) {
            System.err.println("Cloudinary deletion failed: " + e.getMessage());
            throw new IOException("Cloudinary deletion failed: " + e.getMessage(), e);
        }
    }
}