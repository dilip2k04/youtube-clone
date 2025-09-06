package com.youtubeclone.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.youtubeclone.backend.model.Video;

public interface VideoRepository extends MongoRepository<Video, String> {}
