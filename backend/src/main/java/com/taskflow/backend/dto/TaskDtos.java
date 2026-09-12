package com.taskflow.backend.dto;

import com.taskflow.backend.entity.Task;
import com.taskflow.backend.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;

public class TaskDtos {

    public static class TaskRequest {
        @NotBlank
        public String title;
        public String description;
        public TaskStatus status; // optional on create, defaults to TODO
    }

    public static class TaskResponse {
        public Long id;
        public String title;
        public String description;
        public TaskStatus status;

        public static TaskResponse from(Task task) {
            TaskResponse r = new TaskResponse();
            r.id = task.getId();
            r.title = task.getTitle();
            r.description = task.getDescription();
            r.status = task.getStatus();
            return r;
        }
    }
}
