package com.youtubeclone.backend.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class Video {
    private String id;
    private String title;
    private String description;
    private List<String> tags;
    private String videoUrl;
    private String publicId; // ✅ Added for Cloudinary deletion
    private String uploadedBy;
    private LocalDateTime uploadedAt;
    private Set<String> likes;
    private List<Comment> comments;

    public Video() {
        this.uploadedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getPublicId() { return publicId; } // ✅ New getter
    public void setPublicId(String publicId) { this.publicId = publicId; } // ✅ New setter

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

    public Set<String> getLikes() { return likes; }
    public void setLikes(Set<String> likes) { this.likes = likes; }

    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }
}