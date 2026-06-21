package com.metamorphx.daffotrackai.service;

import com.metamorphx.daffotrackai.dto.ChatConversationRequest;
import com.metamorphx.daffotrackai.dto.ChatConversationResponse;
import com.metamorphx.daffotrackai.dto.ChatMessageResponse;
import com.metamorphx.daffotrackai.model.ChatConversation;
import com.metamorphx.daffotrackai.model.ChatMessage;
import com.metamorphx.daffotrackai.model.StudentProfile;
import com.metamorphx.daffotrackai.repository.ChatConversationRepository;
import com.metamorphx.daffotrackai.repository.ChatMessageRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ChatHistoryService {

    private final ChatConversationRepository chatConversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final StudentProfileService studentProfileService;

    public ChatHistoryService(
            ChatConversationRepository chatConversationRepository,
            ChatMessageRepository chatMessageRepository,
            StudentProfileService studentProfileService
    ) {
        this.chatConversationRepository = chatConversationRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.studentProfileService = studentProfileService;
    }

    @Transactional(readOnly = true)
    public List<ChatConversationResponse> listConversations(Long userId, String studentId) {
        return chatConversationRepository.findByOwnerKeyOrderByUpdatedAtDesc(ownerKey(userId, studentId))
                .stream()
                .map(conversation -> toResponse(conversation, false))
                .toList();
    }

    @Transactional(readOnly = true)
    public ChatConversationResponse getConversation(Long id, Long userId, String studentId) {
        return toResponse(getOwnedConversation(id, userId, studentId), true);
    }

    @Transactional
    public ChatConversationResponse createConversation(ChatConversationRequest request) {
        ChatConversation conversation = new ChatConversation();
        conversation.setOwnerKey(ownerKey(request.userId(), request.studentId()));
        conversation.setTitle(StringUtils.hasText(request.title()) ? request.title().trim() : "New chat");
        if (request.userId() != null) {
            conversation.setStudentProfile(studentProfileService.getRequiredProfile(request.userId()));
        }
        return toResponse(chatConversationRepository.save(conversation), true);
    }

    @Transactional
    public void deleteConversation(Long id, Long userId, String studentId) {
        chatConversationRepository.delete(getOwnedConversation(id, userId, studentId));
    }

    @Transactional
    public ChatMessageResponse addMessage(Long conversationId, Long userId, String studentId, String sender, String text, String attachmentsJson) {
        ChatConversation conversation = getOwnedConversation(conversationId, userId, studentId);
        if ("user".equals(sender) && "New chat".equals(conversation.getTitle()) && StringUtils.hasText(text)) {
            conversation.setTitle(titleFromMessage(text));
        }

        ChatMessage message = new ChatMessage();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setText(text);
        message.setAttachmentsJson(attachmentsJson);
        ChatMessage saved = chatMessageRepository.save(message);
        chatConversationRepository.save(conversation);
        return toMessageResponse(saved);
    }

    public String ownerKey(Long userId, String studentId) {
        if (userId != null) return "user:" + userId;
        if (StringUtils.hasText(studentId)) return "student:" + studentId.trim();
        return "guest";
    }

    private ChatConversation getOwnedConversation(Long id, Long userId, String studentId) {
        ChatConversation conversation = chatConversationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat conversation not found"));
        String ownerKey = ownerKey(userId, studentId);
        if (!conversation.getOwnerKey().equals(ownerKey)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Chat conversation does not belong to this user");
        }
        return conversation;
    }

    private ChatConversationResponse toResponse(ChatConversation conversation, boolean includeMessages) {
        List<ChatMessageResponse> messages = includeMessages
                ? chatMessageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId()).stream().map(this::toMessageResponse).toList()
                : List.of();
        return new ChatConversationResponse(
                conversation.getId(),
                conversation.getOwnerKey(),
                conversation.getTitle(),
                conversation.getCreatedAt(),
                conversation.getUpdatedAt(),
                messages
        );
    }

    private ChatMessageResponse toMessageResponse(ChatMessage message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getSender(),
                message.getText(),
                message.getAttachmentsJson(),
                message.getCreatedAt()
        );
    }

    private String titleFromMessage(String text) {
        String clean = text.trim().replaceAll("\\s+", " ");
        return clean.length() > 42 ? clean.substring(0, 42) : clean;
    }
}
