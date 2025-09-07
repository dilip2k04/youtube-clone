package com.youtubeclone.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

    @PostMapping("/upload")
    public Video uploadVideo(@RequestParam("file") MultipartFile file,
                             @RequestParam("title") String title,
                             @RequestParam("description") String description,
                             @RequestParam("tags") String tags,
                             @RequestParam("uploadedBy") String uploadedBy) throws Exception {
        return videoService.uploadVideo(file, title, description, tags, uploadedBy);
    }

    @GetMapping
    public List<Video> getAllVideos() {
        return videoService.getAllVideos();
    }

    @PostMapping("/{videoId}/like")
    public Video likeVideo(@PathVariable String videoId, @RequestParam String userId) {
        return videoService.likeVideo(videoId, userId);
    }

    @PostMapping("/{videoId}/unlike")
    public Video unlikeVideo(@PathVariable String videoId, @RequestParam String userId) {
        return videoService.unlikeVideo(videoId, userId);
    }

    @PostMapping("/{videoId}/comment")
    public Video addComment(@PathVariable String videoId, @RequestParam String userId, @RequestParam String text) {
        return videoService.addComment(videoId, new Comment(userId, text));
    }

    @GetMapping("/{videoId}/comments")
    public List<Comment> getComments(@PathVariable String videoId) {
        return videoService.getComments(videoId);
    }
}
