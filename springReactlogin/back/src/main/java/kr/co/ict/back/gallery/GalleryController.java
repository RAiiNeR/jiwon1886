package kr.co.ict.back.gallery;

import java.io.IOException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {
    @Autowired
    private GalleryService galleryService;
    //private final Path uploadDir = Paths.get("uploads").toAbsolutePath().normalize();
   
    private final Path uploadDir = Paths.get("uploads").toAbsolutePath().normalize(); // 실습용 로컬
    //private final Path uploadDir = Paths.get("webapps/back/uploads").toAbsolutePath().normalize(); // 배포용
    public GalleryController() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory.", e);
        }

    }

    // @GetMapping
    // public List<Gallery> getAllGalleries() {
    // return galleryService.getAllGalleries();
    // }

    // @GetMapping
    // public List<Gallery> getAllGalleries(@RequestParam(defaultValue = "1") int
    // page,
    // @RequestParam(defaultValue = "10") int size,
    // @RequestParam(defaultValue = "") String title) {
    // return galleryService.getAllGalleries(title, page, size);
    // }
    @GetMapping
    public Page<Gallery> getAllGalleries(@RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "9") int size,
            @RequestParam(name = "title", defaultValue = "") String title) {
        return galleryService.getAllGalleries(title, page, size);
    }
    private String getExtension(MultipartFile multipartFile) {
        String fileName = multipartFile.getOriginalFilename();
        // int index = fileName.indexOf(".");
        // if (index > -1) { // .이 존재 할 경우
        // return fileName.substring(index);
        // }
        return fileName;
    }
    @PostMapping
    public Gallery createGallery(@ModelAttribute GalleryVO galleryVO) throws IOException {
        List<String> imageNames = new ArrayList<>();
        System.out.println("Logs===============>"+uploadDir);
        for (MultipartFile multipartFile : galleryVO.getImages()) {
            
            if (!multipartFile.isEmpty()) {
                String originalFileName = multipartFile.getOriginalFilename();
                System.out.println(originalFileName);
                String extension = getExtension(multipartFile);
                // String newFileName = UUID.randomUUID().toString() + extension;
                String newFileName = extension;
                Path destinationFile = uploadDir.resolve(newFileName).normalize();
                Files.copy(multipartFile.getInputStream(), destinationFile);
                imageNames.add(newFileName);
            }
        }
        galleryVO.setImgNames(imageNames);
        return galleryService.createGallery(galleryVO);
    }

    @GetMapping("/{id}")
    public Gallery getGalleryById(@PathVariable Long id) {
        Optional<Gallery> gallery = galleryService.getGalleryById(id);
        if (gallery.isPresent()) {
            return gallery.get();
        } else {
            throw new RuntimeException("Gallery not found with id: " + id);
        }
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content 반환
    public void deleteGalleryById(@PathVariable Long id) {
        Optional<Gallery> gallery = galleryService.getGalleryById(id);
        if (gallery.isPresent()) {
            galleryService.deleteGalleryById(id);
            System.out.println("Gallery with ID " + id + " has been deleted.");
        } else {
            throw new RuntimeException("Gallery not found with id: " + id);
        }
    }
}
