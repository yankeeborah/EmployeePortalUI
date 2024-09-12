import { Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../Models/employee';
import { EmployeeService } from '../../Services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {

  @ViewChild('myModal') model: ElementRef | undefined;

  //it can also be undefined

  employeeList: Employee[] = [];



  employeeForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private empService: EmployeeService) { }


  ngOnInit(): void {
    this.setFormSate();
    this.getEmployees();
  }

  //opening using document.get --we can also used viewchild
  openModal() {
    const empModal = document.getElementById('myModal');
    if (empModal != null) {
      empModal.style.display = 'block';
    }
  }

  closeModal() {
    if (this.model != null) {
      this.model.nativeElement.style.display = 'none';
      this.setFormSate();
    }
  }

  getEmployees() {
    this.empService.getAllEmployees().subscribe((res) => {
      this.employeeList = res;
    })
  }



  setFormSate() {
    this.employeeForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      age: ['', [Validators.required]],
      salary: ['', [Validators.required]],
      status: [false, [Validators.required]]
    });
  }

  formValue: any;

  onSubmit() {
    console.log(this.employeeForm.value);
    if (this.employeeForm.invalid) {
      alert('Please fill all the data fiels');
      return;
    }
    if(this.employeeForm.value.id==0){
    this.formValue = this.employeeForm.value;
    this.empService.addEmployee(this.formValue).subscribe((res) => {
      alert('Employee added successfully');
      this.getEmployees();
      this.employeeForm.reset();
      this.closeModal();
    });
  }
  else{
    this.formValue = this.employeeForm.value;
    this.empService.updateEmployee(this.formValue).subscribe((res) => {
      alert('Employee updated successfully');
      this.getEmployees();
      this.employeeForm.reset();
      this.closeModal();
    });
  }
  }

  onDelete(emp:Employee) {
    const isConfirm=confirm("Are you sure you want to delete this Employee: "+emp.name);
    if(isConfirm){
    this.empService.deleteEmployee(emp.id).subscribe((res) => {
      alert("Employee Deleted Successfully");
      this.getEmployees();
    });
  }
  }

  onEdit(emp: Employee) {
    this.openModal();
    this.employeeForm.patchValue(emp);
  }



}
