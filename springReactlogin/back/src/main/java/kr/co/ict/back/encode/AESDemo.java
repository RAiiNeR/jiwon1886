package kr.co.ict.back.encode;

import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

//대칭키 암호화.
//암호화한다 = 인코딩한다.
//암호화, 복호화할때 동일한 비밀키를 사용해서 암호화하는 방식
// :AES : 매우 널리 사용되는 대칭 암호화 알고리즘으로, 빠르고 안전하며 128비트 192비트, 256비트 키 길이를 사용한다.
public class AESDemo {
    //AES암호화 모드
    public static String encrypt(String data, SecretKey secretKey) throws Exception {
        Cipher cipher = Cipher.getInstance("AES");
        //암호화 모드로 초기화 하겠다는 설정
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        //바이트코드로 암호화
        byte[] encryptedBytes = cipher.doFinal(data.getBytes());
        //Base64로 인코딩하여 사람이 읽을 수 있는 문자열로 변환한다.
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    //AES복호화 모드
    public static String decrypt(String encrypteData, SecretKey secretKey) throws Exception {
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        byte[] decodeBytes = Base64.getDecoder().decode(encrypteData);
        byte[] decrypteBytes = cipher.doFinal(decodeBytes);
        return new String(decrypteBytes);
    }

    // public static void main(String[] args) {
    //     //Key를 생성하기 위한 KeyGen을 생성할때 같은 암호화 방식을 설정해야 함
    //     try {
    //         //getInstance 기본이 싱글톤 패턴을 사용한다.
    //         KeyGenerator keyGen = KeyGenerator.getInstance("AES");
    //         keyGen.init(128);
    //         SecretKey secretKey = keyGen.generateKey();
    //         System.out.println("secrekey => " + secretKey);
    //         //암호화 할 데이터
    //         String oridata = "Hello world!";
    //         System.out.println("원본 데이터 : "+oridata);
    //         //암호화, 복호화 할때 동일한 key를 사용한다.
    //         //AES로 암호화 되는 메서드를 호출 후 암호화 된 문자열을 반환한다.
    //         String encodingData = encrypt(oridata, secretKey);
    //         System.out.println("암호화 된 데이터 : " + encodingData);


    //         String decodingData = decrypt(encodingData, secretKey);
    //         System.out.println("복호화된 데이터 : " + decodingData);
    //     } catch (Exception e) {
    //         e.printStackTrace();
    //     }
    // }
}
