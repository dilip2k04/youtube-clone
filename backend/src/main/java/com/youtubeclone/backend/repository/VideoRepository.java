package com.youtubeclone.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.youtubeclone.backend.model.Video;

public interface VideoRepository extends MongoRepository<Video, String> {
    List<Video> findByUploadedBy(String uploadedBy); // ✅ Added for user videos
}