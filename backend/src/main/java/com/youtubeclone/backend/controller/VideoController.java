package com.youtubeclone.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
            Video video = videoService.uploadVideo(file, title, description, tags, uploadedBy);
            return ResponseEntity.ok(video);
        } catch (Exception e) {
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
    public Video getVideo(@PathVariable String videoId) {
        return videoService.getVideo(videoId);
    }

    // Get all videos
    @GetMapping
    public List<Video> getAllVideos() {
        return videoService.getAllVideos();
    }

    // ✅ Get videos by user (for management page)
    @GetMapping("/user/{userEmail}")
    public ResponseEntity<?> getVideosByUser(@PathVariable String userEmail) {
        try {
            List<Video> userVideos = videoService.getVideosByUser(userEmail);
            return ResponseEntity.ok(userVideos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Check if user owns video (for authorization)
    @GetMapping("/{videoId}/owner/{userEmail}")
    public ResponseEntity<?> isVideoOwner(@PathVariable String videoId, @PathVariable String userEmail) {
        try {
            boolean isOwner = videoService.isVideoOwner(videoId, userEmail);
            return ResponseEntity.ok(Map.of("isOwner", isOwner));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}