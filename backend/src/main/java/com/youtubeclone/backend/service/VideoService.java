package com.youtubeclone.backend.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.youtubeclone.backend.model.Comment;
import com.youtubeclone.backend.model.Video;
import com.youtubeclone.backend.repository.VideoRepository;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    // Upload video with comprehensive error handling
    public Video uploadVideo(MultipartFile file, String title, String description, String tags, String userEmail) {
        System.out.println("Starting video upload process...");
        
        // Validate inputs
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Video file is required");
        }
        
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        
        if (description == null || description.trim().isEmpty()) {
            throw new IllegalArgumentException("Description is required");
        }

        // Validate file type
        if (!file.getContentType().startsWith("video/")) {
            throw new IllegalArgumentException("Only video files are allowed");
        }

        // Validate file size (max 100MB)
        if (file.getSize() > 100 * 1024 * 1024) {
            throw new IllegalArgumentException("File size must be less than 100MB");
        }

        Map<String, String> uploadResult;
        try {
            System.out.println("Uploading to Cloudinary...");
            uploadResult = cloudinaryService.uploadVideo(file);
            System.out.println("Cloudinary upload successful, URL: " + uploadResult.get("url"));
        } catch (Exception e) {
            System.err.println("Cloudinary upload failed: " + e.getMessage());
            throw new RuntimeException("Video upload failed: " + e.getMessage());
        }

        try {
            Video video = new Video();
            video.setTitle(title.trim());
            video.setDescription(description.trim());
            
            // Process tags
            List<String> tagList = new ArrayList<>();
            if (tags != null && !tags.trim().isEmpty()) {
                tagList = Arrays.stream(tags.split(","))
                    .map(String::trim)
                    .filter(tag -> !tag.isEmpty())
                    .collect(Collectors.toList());
            }
            video.setTags(tagList);
            
            video.setVideoUrl(uploadResult.get("url"));
            video.setPublicId(uploadResult.get("public_id"));
            video.setUploadedBy(userEmail);
            video.setLikes(new HashSet<>());
            video.setComments(new ArrayList<>());

            Video savedVideo = videoRepository.save(video);
            System.out.println("Video saved to database with ID: " + savedVideo.getId());
            
            return savedVideo;
            
        } catch (Exception e) {
            System.err.println("Database save failed: " + e.getMessage());
            // Try to delete from Cloudinary if database save fails
            try {
                cloudinaryService.deleteVideo(uploadResult.get("public_id"));
            } catch (Exception deleteEx) {
                System.err.println("Failed to delete from Cloudinary after database error: " + deleteEx.getMessage());
            }
            throw new RuntimeException("Failed to save video metadata: " + e.getMessage());
        }
    }

    // Update video metadata
    public Video updateVideo(String videoId, String title, String description, String tags) {
        System.out.println("Updating video: " + videoId);
        
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));
        
        if (title != null && !title.trim().isEmpty()) {
            video.setTitle(title.trim());
        }
        
        if (description != null && !description.trim().isEmpty()) {
            video.setDescription(description.trim());
        }
        
        if (tags != null && !tags.trim().isEmpty()) {
            List<String> tagList = Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .collect(Collectors.toList());
            video.setTags(tagList);
        }

        return videoRepository.save(video);
    }

    // Delete video
    public void deleteVideo(String videoId) {
        System.out.println("Deleting video: " + videoId);
        
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));

        // Delete from Cloudinary first
        if (video.getPublicId() != null) {
            try {
                cloudinaryService.deleteVideo(video.getPublicId());
            } catch (Exception e) {
                System.err.println("Cloudinary deletion failed: " + e.getMessage());
                throw new RuntimeException("Failed to delete video from storage: " + e.getMessage());
            }
        }
        
        // Then delete from database
        videoRepository.delete(video);
        System.out.println("Video deleted successfully");
    }

    // Get all videos
    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    // Get single video
    public Video getVideo(String videoId) {
        return videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));
    }

    // Get videos by user
    public List<Video> getVideosByUser(String userEmail) {
        return videoRepository.findByUploadedBy(userEmail);
    }

    // Like a video
    public Video likeVideo(String videoId, String userEmail) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));
        
        if (video.getLikes() == null) {
            video.setLikes(new HashSet<>());
        }
        
        video.getLikes().add(userEmail);
        return videoRepository.save(video);
    }

    // Unlike a video
    public Video unlikeVideo(String videoId, String userEmail) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));
        
        if (video.getLikes() != null) {
            video.getLikes().remove(userEmail);
        }
        
        return videoRepository.save(video);
    }

    // Add comment to video - SINGLE IMPLEMENTATION
    public Video addComment(String videoId, String userEmail, String text) {
        System.out.println("Adding comment to video: " + videoId);
        System.out.println("User: " + userEmail + ", Text: " + text);
        
        try {
            Video video = videoRepository.findById(videoId)
                    .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));
            
            // Ensure comments list exists
            if (video.getComments() == null) {
                System.out.println("Comments list was null, initializing new ArrayList");
                video.setComments(new ArrayList<>());
            }
            
            Comment newComment = new Comment(userEmail, text);
            video.getComments().add(newComment);
            
            Video savedVideo = videoRepository.save(video);
            System.out.println("Comment added successfully. Total comments: " + savedVideo.getComments().size());
            
            return savedVideo;
        } catch (Exception e) {
            System.err.println("Error adding comment: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to add comment: " + e.getMessage());
        }
    }

    // Get comments for a video - SINGLE IMPLEMENTATION
    public List<Comment> getComments(String videoId) {
        System.out.println("Getting comments for video: " + videoId);
        
        try {
            Video video = videoRepository.findById(videoId)
                    .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));
            
            System.out.println("Video found: " + video.getTitle());
            System.out.println("Comments field: " + video.getComments());
            System.out.println("Comments is null? " + (video.getComments() == null));
            
            // Ensure we always return a list, never null
            List<Comment> comments = video.getComments();
            if (comments == null) {
                System.out.println("Comments was null, returning empty list");
                return new ArrayList<>();
            }
            
            System.out.println("Returning " + comments.size() + " comments");
            return comments;
        } catch (Exception e) {
            System.err.println("Error getting comments: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to get comments: " + e.getMessage());
        }
    }

    // Get liked videos by user
    public List<Video> getLikedVideos(String userEmail) {
        List<Video> allVideos = videoRepository.findAll();
        return allVideos.stream()
                .filter(video -> video.getLikes() != null && video.getLikes().contains(userEmail))
                .collect(Collectors.toList());
    }
}