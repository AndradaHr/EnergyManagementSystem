package com.project.User_Microservice.repositories;

import com.project.User_Microservice.models.entities.User;
import com.project.User_Microservice.models.entities.VerificationToken;
import org.springframework.data.repository.ListCrudRepository;

import java.util.List;
import java.util.Optional;

public interface VerificationTokenRepository extends ListCrudRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByToken(String token);

    void deleteByUser(User user);

    List<VerificationToken> findByUser_IdOrderByIdDesc(Long id);

}