package com.metamorphx.daffotrackai.service;

import com.metamorphx.daffotrackai.dto.FileExtractionResponse;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FileExtractionService {

    private static final long MAX_EXTRACT_SIZE = 8L * 1024L * 1024L;

    public FileExtractionResponse extract(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required");
        }
        if (file.getSize() > MAX_EXTRACT_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is too large for text extraction");
        }

        String fileName = file.getOriginalFilename() == null ? "uploaded-file" : file.getOriginalFilename();
        String contentType = file.getContentType() == null ? "" : file.getContentType();
        String text;

        try {
            if (isDocx(fileName, contentType)) {
                text = extractDocx(file);
            } else if (isPlainText(fileName, contentType)) {
                text = new String(file.getBytes(), StandardCharsets.UTF_8);
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only DOCX and text files are supported for extraction right now");
            }
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to extract text from uploaded file");
        }

        return new FileExtractionResponse("success", fileName, contentType, file.getSize(), text.trim());
    }

    private String extractDocx(MultipartFile file) throws Exception {
        try (InputStream inputStream = file.getInputStream(); XWPFDocument document = new XWPFDocument(inputStream)) {
            StringBuilder builder = new StringBuilder();
            for (XWPFParagraph paragraph : document.getParagraphs()) {
                String text = paragraph.getText();
                if (StringUtils.hasText(text)) {
                    builder.append(text.trim()).append("\n");
                }
            }
            return builder.toString();
        }
    }

    private boolean isDocx(String fileName, String contentType) {
        return fileName.toLowerCase().endsWith(".docx")
                || "application/vnd.openxmlformats-officedocument.wordprocessingml.document".equalsIgnoreCase(contentType);
    }

    private boolean isPlainText(String fileName, String contentType) {
        String lowerName = fileName.toLowerCase();
        return contentType.startsWith("text/")
                || lowerName.endsWith(".txt")
                || lowerName.endsWith(".csv")
                || lowerName.endsWith(".md")
                || lowerName.endsWith(".json");
    }
}
