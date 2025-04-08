package kr.co.admin.chat;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.nio.file.*;

@Component
public class FolderWatcher extends TextWebSocketHandler {
    private WebSocketSession session;
    // private static final String FOLDER_PATH = "C:/path/to/watch"; // 감시할 폴더 경로
    private static Path uploadPath = Paths.get("./files/logs").toAbsolutePath().normalize();
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        this.session = session;
        watchFolderChanges(); // 폴더 감시 시작
    }

    private void watchFolderChanges() {
        Thread watcherThread = new Thread(() -> {
            try (WatchService watchService = FileSystems.getDefault().newWatchService()) {
                Path folderPath = uploadPath;
                folderPath.register(watchService, 
                    StandardWatchEventKinds.ENTRY_CREATE, 
                    StandardWatchEventKinds.ENTRY_MODIFY, 
                    StandardWatchEventKinds.ENTRY_DELETE);

                while (true) {
                    WatchKey key = watchService.take();
                    for (WatchEvent<?> event : key.pollEvents()) {
                        WatchEvent.Kind<?> kind = event.kind();
                        Path changedFile = (Path) event.context();
                        boolean message = String.valueOf(changedFile).split("_")[1].toLowerCase().equals("bot");
                        sendMessage(String.valueOf(message));
                    }
                    key.reset();
                }
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        });

        watcherThread.setDaemon(true);
        watcherThread.start();
    }

    private void sendMessage(String message) {
        try {
            if (session != null && session.isOpen()) {
                session.sendMessage(new TextMessage(message));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
