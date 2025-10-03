package com.youtubeclone.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping; // IMPORT ADDED
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.youtubeclone.backend.model.Comment;
import com.youtubeclone.backend.model.Video;
import com.youtubeclone.backend.service.VideoService;

@RestController
@RequestMapping("/api/videos")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class VideoController {

    @Autowired
    private VideoService videoService;

    // Upload new video
    @PostMapping("/upload")
    public ResponseEntity<?> uploadVideo(@RequestParam("file") MultipartFile file,
                                         @RequestParam("title") String title,
                                         @RequestParam("description") String description,
                                         @RequestParam("tags") String tags,
                                         @RequestParam("uploadedBy") String uploadedBy) {
        try {
            System.out.println("Received upload request:");
            System.out.println("Title: " + title);
            System.out.println("Description: " + description);
            System.out.println("Tags: " + tags);
            System.out.println("UploadedBy: " + uploadedBy);
            System.out.println("File: " + file.getOriginalFilename() + " (" + file.getSize() + " bytes)");

            Video video = videoService.uploadVideo(file, title, description, tags, uploadedBy);
            return ResponseEntity.ok(video);
            
        } catch (IllegalArgumentException e) {
            System.err.println("Validation error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Upload error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Update video metadata
    @PutMapping("/{videoId}")
    public ResponseEntity<?> updateVideo(@PathVariable String videoId, @RequestBody Map<String, String> payload) {
        try {
            Video updatedVideo = videoService.updateVideo(
                    videoId,
                    payload.get("title"),
                    payload.get("description"),
                    payload.get("tags")
            );
            return ResponseEntity.ok(updatedVideo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Delete video
    @DeleteMapping("/{videoId}")
    public ResponseEntity<?> deleteVideo(@PathVariable String videoId) {
        try {
            videoService.deleteVideo(videoId);
            return ResponseEntity.ok(Map.of("message", "Video deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Get single video
    @GetMapping("/{videoId}")
    public ResponseEntity<?> getVideo(@PathVariable String videoId) {
        try {
            Video video = videoService.getVideo(videoId);
            return ResponseEntity.ok(video);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    // Get all videos
    @GetMapping
    public List<Video> getAllVideos() {
        return videoService.getAllVideos();
    }

    // Get videos by user
    @GetMapping("/user/{userEmail}")
    public ResponseEntity<?> getVideosByUser(@PathVariable String userEmail) {
        try {
            List<Video> userVideos = videoService.getVideosByUser(userEmail);
            return ResponseEntity.ok(userVideos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Like a video
    @PostMapping("/{videoId}/like")
    public ResponseEntity<?> likeVideo(@PathVariable String videoId, @RequestParam String userId) {
        try {
            Video updatedVideo = videoService.likeVideo(videoId, userId);
            return ResponseEntity.ok(updatedVideo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Unlike a video
    @PostMapping("/{videoId}/unlike")
    public ResponseEntity<?> unlikeVideo(@PathVariable String videoId, @RequestParam String userId) {
        try {
            Video updatedVideo = videoService.unlikeVideo(videoId, userId);
            return ResponseEntity.ok(updatedVideo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Add comment to video
    @PostMapping("/{videoId}/comment")
    public ResponseEntity<?> addComment(@PathVariable String videoId, 
                                       @RequestParam String userId, 
                                       @RequestParam String text) {
        try {
            Video updatedVideo = videoService.addComment(videoId, userId, text);
            return ResponseEntity.ok(updatedVideo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Get comments for a video
    @GetMapping("/{videoId}/comments")
    public ResponseEntity<?> getComments(@PathVariable String videoId) {
        try {
            List<Comment> comments = videoService.getComments(videoId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Get liked videos by user
    @GetMapping("/liked/{userEmail}")
    public ResponseEntity<?> getLikedVideos(@PathVariable String userEmail) {
        try {
            List<Video> likedVideos = videoService.getLikedVideos(userEmail);
            return ResponseEntity.ok(likedVideos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // DEBUG: Test comments endpoint
    @GetMapping("/{videoId}/comments-debug")
    public ResponseEntity<?> getCommentsDebug(@PathVariable String videoId) {
        try {
            System.out.println("=== COMMENTS DEBUG ENDPOINT ===");
            System.out.println("Video ID: " + videoId);
            
            Video video = videoService.getVideo(videoId);
            System.out.println("Video found: " + video.getTitle());
            System.out.println("Comments field: " + video.getComments());
            System.out.println("Comments is null? " + (video.getComments() == null));
            
            if (video.getComments() != null) {
                System.out.println("Number of comments: " + video.getComments().size());
                video.getComments().forEach(comment -> {
                    System.out.println("Comment: " + comment.getUserId() + " - " + comment.getText());
                });
            }
            
            List<Comment> comments = videoService.getComments(videoId);
            System.out.println("Service returned: " + comments.size() + " comments");
            
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            System.err.println("DEBUG Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}