package com.metamorphx.daffotrackai.dto;

public record AuthRequest(String email, String password, boolean guest) {
}