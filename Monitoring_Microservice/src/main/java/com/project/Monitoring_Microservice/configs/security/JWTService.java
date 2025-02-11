package com.project.Monitoring_Microservice.configs.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class JWTService {

    @Value("${jwt.algorithm.key}")
    private String secretKey;

    public String getUsername(String token) {
        try {
            DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC256(secretKey)).build().verify(token);
            return decodedJWT.getSubject();
        } catch (JWTDecodeException e) {
            throw new RuntimeException("Invalid JWT Token");
        }
    }
}
