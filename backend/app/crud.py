from decimal import Decimal, ROUND_HALF_UP
from sqlalchemy.orm import Session
from models import TA, Request, Teacher, Student, Lesson, Department
from schemas import RequestCreate, TeacherCreate, StudentCreate, LessonCreate, DepartmentCreate, TACreate
from typing import List
from argon2 import PasswordHasher


def create_request(db: Session, request: RequestCreate):
    db_request = Request(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


def create_teacher(db: Session, teacher: TeacherCreate):
    ph = PasswordHasher()
    password = ph.hash(teacher.password)
    teacher.password = password
    db_teacher = Teacher(**teacher.dict())
    db.add(db_teacher)
    db.commit()
    db.refresh(db_teacher)
    return db_teacher


def create_student(db: Session, student: StudentCreate):
    ph = PasswordHasher()
    password = ph.hash(student.password)
    student.password = password
    db_student = Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


def create_ta(db: Session, ta: TACreate):
    db_ta = TA(**ta.dict())
    db.add(db_ta)
    db.commit()
    db.refresh(db_ta)
    return db_ta


def create_lesson(db: Session, lesson: LessonCreate):
    db_lesson = Lesson(**lesson.dict())
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    return db_lesson


def create_department(db: Session, department: DepartmentCreate):
    db_department = Department(**department.dict())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

def get_students(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Student).offset(skip).limit(limit).all()

def get_tas(db: Session, skip: int = 0, limit: int = 10):
    return db.query(TA).offset(skip).limit(limit).all()

def get_lessons(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Lesson).offset(skip).limit(limit).all()

def get_departments(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Department).offset(skip).limit(limit).all()

def get_teachers(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Teacher).offset(skip).limit(limit).all()

def get_requests(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Request).offset(skip).limit(limit).all()

def get_students(db: Session, skip: int = 0, limit: int = 10) -> List[Student]:
    return db.query(Student).offset(skip).limit(limit).all()

def delete_student(db: Session, student_id: int):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if db_student:
        db.delete(db_student)
        db.commit()
        return True
    return False

def delete_ta(db: Session, ta_id: int):
    db_ta = db.query(TA).filter(TA.id == ta_id).first()
    if db_ta:
        db.delete(db_ta)
        db.commit()
        return True
    return False

def delete_lesson(db: Session, lesson_id: int):
    db_lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if db_lesson:
        db.delete(db_lesson)
        db.commit()
        return True
    return False

def delete_department(db: Session, department_id: int):
    db_department = db.query(Department).filter(Department.id == department_id).first()
    if db_department:
        db.delete(db_department)
        db.commit()
        return True
    return False

def delete_request(db: Session, request_id: int):
    db_request = db.query(Request).filter(Request.id == request_id).first()
    if db_request:
        db.delete(db_request)
        db.commit()
        return True
    return False

def delete_teacher(db: Session, teacher_id: int):
    db_teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if db_teacher:
        db.delete(db_teacher)
        db.commit()
        return True
    return False

def update_student(db: Session, student_id: int, student: StudentCreate):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if db_student:
        for key, value in student.dict().items():
            setattr(db_student, key, value)
        db.commit()
        db.refresh(db_student)
        return db_student
    return None

def update_ta(db: Session, ta_id: int, ta: TACreate):
    db_ta = db.query(TA).filter(TA.id == ta_id).first()
    if db_ta:
        for key, value in ta.dict().items():
            setattr(db_ta, key, value)
        db.commit()
        db.refresh(db_ta)
        return db_ta
    return None

def update_lesson(db: Session, lesson_id: int, lesson: LessonCreate):
    db_lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if db_lesson:
        for key, value in lesson.dict().items():
            setattr(db_lesson, key, value)
        db.commit()
        db.refresh(db_lesson)
        return db_lesson
    return None

def update_department(db: Session, department_id: int, department: DepartmentCreate):
    db_department = db.query(Department).filter(Department.id == department_id).first
    if db_department:
        for key, value in department.dict().items():
            setattr(db_department, key, value)
        db.commit()
        db.refresh(db_department)
        return db_department
    return None

def update_request(db: Session, request_id: int, request: RequestCreate):
    db_request = db.query(Request).filter(Request.id == request_id).first()
    if db_request:
        for key, value in request.dict().items():
            setattr(db_request, key, value)
        db.commit()
        db.refresh(db_request)
        return db_request
    return None

def update_teacher(db: Session, teacher_id: int, teacher: TeacherCreate):
    db_teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if db_teacher:
        for key, value in teacher.dict().items():
            setattr(db_teacher, key, value)
        db.commit()
        db.refresh(db_teacher)
        return db_teacher
    return None
