package com.youtubeclone.backend.service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
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
        video.setUploadedBy(userEmail); // ✅ match the field in Video model

        return videoRepository.save(video);
    }

    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }
}
