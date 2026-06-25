package de.sergio.TravelPlanner.service;

import de.sergio.TravelPlanner.entity.User;
import de.sergio.TravelPlanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // TODO 1: достань User по email через findByEmail (вернёт Optional).
        //   Нет такого — брось UsernameNotFoundException (это контракт интерфейса).
        //   Сообщение нейтральное, но тут enumeration не так критичен —
        //   этот метод внутренний, наружу 401 всё равно отдаст фильтр.
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        // TODO 2: заверни User в Spring-овский UserDetails.
        //   Spring даёт готовый билдер org.springframework.security.core.userdetails.User:
        //
           return org.springframework.security.core.userdetails.User.builder()
                  .username(user.getEmail())
                  .password(user.getPassword())
                  .authorities("ROLE_" + user.getRole().name())
                  .build();

    }
}
