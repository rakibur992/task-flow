package com.taskflow.backend.repository;

import com.taskflow.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByOwnerIdOrderByCreatedAtAsc(Long ownerId);
    java.util.Optional<Task> findByIdAndOwnerId(Long id, Long ownerId);
}
