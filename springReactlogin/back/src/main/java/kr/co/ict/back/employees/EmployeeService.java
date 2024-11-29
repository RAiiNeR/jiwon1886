package kr.co.ict.back.employees;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() { //전체 리스트
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(Long id) { //상세보기
        return employeeRepository.findById(id);
    }

    public Employee addEmployee(Employee employee) {//입력
        return employeeRepository.save(employee);
    }

    public Optional<Employee> updateEmployee(Long id, Employee employee) { //수정

        Optional<Employee> existingEmployee = employeeRepository.findById(id);
        if (existingEmployee.isPresent()) {

            Employee updatedEmployee = existingEmployee.get();
            updatedEmployee.setName(employee.getName());
            updatedEmployee.setPhone(employee.getPhone());
            updatedEmployee.setEmail(employee.getEmail());
            updatedEmployee.setPosition(employee.getPosition());
            updatedEmployee.setBio(employee.getBio());
            employeeRepository.save(updatedEmployee);
        }
        return existingEmployee;
    }

    public void deleteEmployee(Long id) { //삭제
        employeeRepository.deleteById(id);
    }

}