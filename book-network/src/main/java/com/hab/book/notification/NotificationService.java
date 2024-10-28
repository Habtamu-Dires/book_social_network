package com.hab.book.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    // send message to /user/{userId}/notifications.
    public void sendNotification(String userId, Notification notification){
        log.info("Sending WS notification to {} with payload {}", userId, notification);
        messagingTemplate.convertAndSendToUser(
                userId,
                "/notifications",
                notification
        );
    }
}