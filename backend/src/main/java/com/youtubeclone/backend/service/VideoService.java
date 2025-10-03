package com.youtubeclone.backend.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.youtubeclone.backend.model.Video;
import com.youtubeclone.backend.repository.VideoRepository;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    // Upload video
    public Video uploadVideo(MultipartFile file, String title, String description, String tags, String userEmail) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Video file is required");
        }

        Map<String, String> uploadResult;
        try {
            uploadResult = cloudinaryService.uploadVideo(file);
        } catch (Exception e) {
            throw new RuntimeException("Cloudinary upload failed: " + e.getMessage());
        }

        Video video = new Video();
        video.setTitle(title);
        video.setDescription(description);
        video.setTags(tags != null ? Arrays.asList(tags.split(",")) : new ArrayList<>());
        video.setVideoUrl(uploadResult.get("url"));
        video.setPublicId(uploadResult.get("public_id")); // ✅ Store public_id
        video.setUploadedBy(userEmail);
        video.setLikes(new HashSet<>());
        video.setComments(new ArrayList<>());

        return videoRepository.save(video);
    }

    // Update metadata only
    public Video updateVideo(String videoId, String title, String description, String tags) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        if (title != null) video.setTitle(title);
        if (description != null) video.setDescription(description);
        if (tags != null) video.setTags(Arrays.asList(tags.split(",")));
        return videoRepository.save(video);
    }

    // Delete video from both Cloudinary and database
    public void deleteVideo(String videoId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        // Delete from Cloudinary first
        if (video.getPublicId() != null) {
            try {
                cloudinaryService.deleteVideo(video.getPublicId());
            } catch (Exception e) {
                throw new RuntimeException("Cloudinary deletion failed: " + e.getMessage());
            }
        }
        
        // Then delete from database
        videoRepository.delete(video);
    }

    // Get all videos
    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    // Get single video
    public Video getVideo(String videoId) {
        return videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));
    }

    // ✅ Get videos by user (for management)
    public List<Video> getVideosByUser(String userEmail) {
        return videoRepository.findByUploadedBy(userEmail);
    }

    // ✅ Check if user owns the video
    public boolean isVideoOwner(String videoId, String userEmail) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        return video.getUploadedBy().equals(userEmail);
    }
}