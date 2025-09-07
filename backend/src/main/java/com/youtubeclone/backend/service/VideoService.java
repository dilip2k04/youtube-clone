package com.youtubeclone.backend.service;

import java.time.LocalDateTime;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.youtubeclone.backend.model.Comment;
import com.youtubeclone.backend.model.Video;
import com.youtubeclone.backend.repository.VideoRepository;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private Cloudinary cloudinary;

    public Video uploadVideo(MultipartFile file, String title, String description, String tags, String userEmail) throws Exception {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("resource_type", "video"));

        Video video = new Video();
        video.setTitle(title);
        video.setDescription(description);
        video.setTags(Arrays.asList(tags.split(",")));
        video.setVideoUrl((String) uploadResult.get("secure_url"));
        video.setUploadedBy(userEmail);
        video.setLikes(new HashSet<>());
        video.setComments(new ArrayList<>());

        return videoRepository.save(video);
    }

    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    public Video likeVideo(String videoId, String userId) {
        Video video = videoRepository.findById(videoId).orElseThrow();
        video.getLikes().add(userId);
        return videoRepository.save(video);
    }

    public Video unlikeVideo(String videoId, String userId) {
        Video video = videoRepository.findById(videoId).orElseThrow();
        video.getLikes().remove(userId);
        return videoRepository.save(video);
    }

    public Video addComment(String videoId, Comment comment) {
        Video video = videoRepository.findById(videoId).orElseThrow();
        comment.setCreatedAt(LocalDateTime.now());
        video.getComments().add(comment);
        return videoRepository.save(video);
    }

    public List<Comment> getComments(String videoId) {
        Video video = videoRepository.findById(videoId).orElseThrow();
        return video.getComments();
    }
}
