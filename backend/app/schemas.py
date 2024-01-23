from typing import List, Optional
from pydantic import BaseModel, EmailStr, Json


class StudentBase(BaseModel):
    username: str
    name: str
    email: EmailStr
    password: str
    student_number: str

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
    is_completed: bool
    additional_note: str
    is_accepted: bool
    created_at: str
    updated_at: str


class RequestCreate(RequestBase):
    pass


class Request(RequestBase):
    id: int

class RequestPreqBase(BaseModel):
    request_id: int
    preq_id: int
    grade: int

class RequestPreqCreate(RequestPreqBase):
    pass

class RequestPreq(RequestPreqBase):
    id: int

    class Config:
        orm_mode = True


class TeacherBase(BaseModel):
    username: str
    name: str
    mail: EmailStr
    password: str
    dep_id: int

class TeacherLessonBase(BaseModel):
    teacher_id: int
    lesson_id: int

class TeacherLessonCreate(TeacherLessonBase):
    pass

class TeacherLesson(TeacherLessonBase):
    id: int

    class Config:
        orm_mode = True

class TeacherCreate(TeacherBase):
    pass


class Teacher(TeacherBase):
    id: int

    class Config:
        orm_mode = True


class TABase(BaseModel):
    student_id: int
    lesson_id: int
    teacher_id: int
    rate: float
    num_vote: int
    comments: List[str]


class TACreate(TABase):
    pass


class TA(TABase):
    id: int

    class Config:
        orm_mode = True


class LessonBase(BaseModel):
    name: str
    credit_points: int


class LessonPrequisiteBase(BaseModel):
    lesson_id: int
    preq_id: int

class LessonPrequisiteCreate(LessonPrequisiteBase):
    pass

class LessonPrequisite(LessonPrequisiteBase):
    id: int

    class Config:
        orm_mode = True

class LessonRequisiteBase(BaseModel):
    lesson_id: int
    req_id: int

class LessonRequisiteCreate(LessonRequisiteBase):
    pass

class LessonRequisite(LessonRequisiteBase):
    id: int

    class Config:
        orm_mode = True

class TeacherLessonBase(BaseModel):
    teacher_id: int
    lesson_id: int

class TeacherLessonCreate(TeacherLessonBase):
    pass

class TeacherLesson(TeacherLessonBase):
    id: int

    class Config:
        orm_mode = True

class TACommentsBase(BaseModel):
    teacher_id: int
    lesson_id: int
    rate: float
    comment: Json

class TACommentsCreate(TACommentsBase):
    pass

class TAComments(TACommentsBase):
    id: int

    class Config:
        orm_mode = True

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
