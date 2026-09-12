package com.taskflow.backend.controller;

import com.taskflow.backend.dto.TaskDtos.*;
import com.taskflow.backend.entity.Task;
import com.taskflow.backend.entity.User;
import com.taskflow.backend.repository.TaskRepository;
import com.taskflow.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskController(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    private User currentUser(Authentication auth) {
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found: " + username));
    }

    @GetMapping
    public List<TaskResponse> listTasks(Authentication auth) {
        User user = currentUser(auth);
        return taskRepository.findByOwnerIdOrderByCreatedAtAsc(user.getId())
                .stream().map(TaskResponse::from).toList();
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest req, Authentication auth) {
        User user = currentUser(auth);

        Task task = new Task();
        task.setTitle(req.title);
        task.setDescription(req.description);
        task.setStatus(req.status != null ? req.status : com.taskflow.backend.entity.TaskStatus.TODO);
        task.setOwner(user);

        taskRepository.save(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(TaskResponse.from(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequest req, Authentication auth) {
        User user = currentUser(auth);
        return taskRepository.findByIdAndOwnerId(id, user.getId())
                .map(task -> {
                    task.setTitle(req.title);
                    task.setDescription(req.description);
                    if (req.status != null) task.setStatus(req.status);
                    taskRepository.save(task);
                    return ResponseEntity.ok(TaskResponse.from(task));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, Authentication auth) {
        User user = currentUser(auth);
        return taskRepository.findByIdAndOwnerId(id, user.getId())
                .map(task -> {
                    taskRepository.delete(task);
                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
