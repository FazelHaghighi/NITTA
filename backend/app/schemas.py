from typing import List, Optional
from pydantic import BaseModel, EmailStr


class StudentBase(BaseModel):
    username: str
    name: str
    email: EmailStr
    password: str


class StudentCreate(StudentBase):
    pass


class Student(StudentBase):
    id: int

    class Config:
        orm_mode = True


class TARatingCreate(BaseModel):
    rate: float
    comment: Optional[str]


class TARating(TARatingCreate):
    id: int
    ta_id: int

    class Config:
        orm_mode = True


class RequestBase(BaseModel):
    student_id: int
    teacher_id: int
    lesson_id: int


class RequestCreate(RequestBase):
    pass


class Request(RequestBase):
    id: int

    class Config:
        orm_mode = True


class TeacherBase(BaseModel):
    username: str
    name: str
    mail: EmailStr
    password: str
    dep_id: int
    lesson_id: int


class TeacherCreate(TeacherBase):
    pass


class Teacher(TeacherBase):
    id: int

    class Config:
        orm_mode = True


class TABase(BaseModel):
    name: str
    rate: float
    num_vote: int
    comment: str


class TACreate(TABase):
    pass


class TA(TABase):
    id: int

    class Config:
        orm_mode = True


class LessonBase(BaseModel):
    name: str


class LessonCreate(LessonBase):
    pass


class Lesson(LessonBase):
    id: int

    class Config:
        orm_mode = True


class DepartmentBase(BaseModel):
    name: str


class DepartmentCreate(DepartmentBase):
    pass


class Department(DepartmentBase):
    id: int

    class Config:
        orm_mode = True
