package com.project.User_Microservice.services;

import com.project.User_Microservice.dtos.LoginBody;
import com.project.User_Microservice.dtos.RegistrationBody;
import com.project.User_Microservice.dtos.UserDTO;
import com.project.User_Microservice.exceptions.UserAlreadyExistsException;
import com.project.User_Microservice.exceptions.UserNotFoundException;
import com.project.User_Microservice.exceptions.UserNotVerifiedException;
import com.project.User_Microservice.mappers.UserMapper;
import com.project.User_Microservice.models.entities.User;
import com.project.User_Microservice.models.entities.VerificationToken;
import com.project.User_Microservice.models.enums.Role;
import com.project.User_Microservice.repositories.UserRepository;
import com.project.User_Microservice.repositories.VerificationTokenRepository;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EncryptionService encryptionService;
    private final JWTService jwtService;
    private final VerificationTokenRepository verificationTokenRepository;


    public UserService(UserRepository userRepository, EncryptionService encryptionService, JWTService jwtService, VerificationTokenRepository verificationTokenRepository) {
        this.userRepository = userRepository;
        this.encryptionService = encryptionService;
        this.jwtService = jwtService;
        this.verificationTokenRepository = verificationTokenRepository;
    }

    public User registerUser(RegistrationBody registrationBody) throws UserAlreadyExistsException {
        if (userRepository.findByEmailIgnoreCase(registrationBody.getEmail()).isPresent()
                || userRepository.findByUsernameIgnoreCase(registrationBody.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException();
        }
        User user = new User();
        user.setName(registrationBody.getName());
        user.setRole(Role.USER);
        user.setEmail(registrationBody.getEmail());
        user.setUsername(registrationBody.getUsername());
        user.setPassword(encryptionService.encryptPassword(registrationBody.getPassword()));
        VerificationToken verificationToken = createVerificationToken(user);
        return userRepository.save(user);
    }

//    public String loginUser(LoginBody loginBody) {
//        Optional<User> opUser = userRepository.findByUsernameIgnoreCase(loginBody.getUsername());
//        if (opUser.isPresent()) {
//            User user = opUser.get();
//            if (encryptionService.verifyPassword(loginBody.getPassword(), user.getPassword())) {
//                return jwtService.generateJWT(user);
//            }
//        }
//        return null;
//    }
    public String loginUser(LoginBody loginBody) throws UserNotVerifiedException {
        Optional<User> opUser = userRepository.findByUsernameIgnoreCase(loginBody.getUsername());
        if (opUser.isPresent()) {
            User user = opUser.get();
            if (encryptionService.verifyPassword(loginBody.getPassword(), user.getPassword())) {
                return jwtService.generateJWT(user);
            } else {
                List<VerificationToken> verificationTokens = user.getVerificationTokens();
                boolean resend = verificationTokens.isEmpty() ||
                        verificationTokens.get(0).getCreatedTimestamp().before(new Timestamp(System.currentTimeMillis() - (60 * 60 * 1000)));
                if (resend) {
                    VerificationToken verificationToken = createVerificationToken(user);
                    verificationTokenRepository.save(verificationToken);
                }
                throw new UserNotVerifiedException(resend);
            }
        }
        return null;
    }
    private VerificationToken createVerificationToken(User user) {
        String verificationCode = String.valueOf((int)(Math.random() * 900000) + 100000);
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(verificationCode);
        verificationToken.setCreatedTimestamp(new Timestamp(System.currentTimeMillis()));
        verificationToken.setUser(user);
        user.getVerificationTokens().add(verificationToken);
        return verificationToken;
    }

    public List<UserDTO> findUsers() {
        List<User> userList = userRepository.findAll();
        return userList.stream()
                .map(UserMapper::toUserDTO)
                .collect(Collectors.toList());
    }

    public UserDTO findUserById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty()) {
            throw new UserNotFoundException("User with id " + id + " not found");
        }
        return UserMapper.toUserDTO(userOptional.get());
    }

    public Long insert(RegistrationBody registrationBody) {
        User user = UserMapper.toEntity(registrationBody);
        user.setPassword(encryptionService.encryptPassword(registrationBody.getPassword()));
        VerificationToken verificationToken = createVerificationToken(user);
        user = userRepository.save(user);
        return user.getId();
    }

    public UserDTO updateUser(long id, RegistrationBody userUpdateDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        user.setName(userUpdateDTO.getName());
        user.setUsername(userUpdateDTO.getUsername());
        user.setEmail(userUpdateDTO.getEmail());
        user.setPassword(encryptionService.encryptPassword(userUpdateDTO.getPassword()));

        User updatedUser = userRepository.save(user);
        return UserMapper.toUserDTO(updatedUser);
    }

    public void deleteUser(long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    public Role findUserRoleByUsername(String username) {
        Optional<User> user = userRepository.findByUsernameIgnoreCase(username);
        return user.map(User::getRole).orElseThrow(() -> new UserNotFoundException("User not found"));
    }
}
