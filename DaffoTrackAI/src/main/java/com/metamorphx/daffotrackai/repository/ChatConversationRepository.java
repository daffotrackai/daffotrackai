package com.metamorphx.daffotrackai.repository;

import com.metamorphx.daffotrackai.model.ChatConversation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatConversationRepository extends JpaRepository<ChatConversation, Long> {

    List<ChatConversation> findByOwnerKeyOrderByUpdatedAtDesc(String ownerKey);
}
