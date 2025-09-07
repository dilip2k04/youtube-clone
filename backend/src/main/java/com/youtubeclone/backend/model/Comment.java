package com.youtubeclone.backend.model;

import java.time.LocalDateTime;

public class Comment {
    private String userId;
    private String text;
    private LocalDateTime createdAt;  // ✅ LocalDateTime

    public Comment() {}

    public Comment(String userId, String text) {
        this.userId = userId;
        this.text = text;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
