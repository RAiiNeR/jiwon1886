package kr.co.ict.back.employees;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SequenceGenerator(name = "employee_seq_gen", sequenceName = "employee_seq", allocationSize = 1)
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employee_seq_gen")
    private Long id;

    private String name;
    private String phone;
    private String email;
    private String position;

    @Column(length = 1000)
    private String bio;

    public Employee(String name, String phone, String email, String position) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.position = position;
    }
}