from sqlalchemy.orm import Session, aliased
from sqlalchemy.sql import func
from argon2 import PasswordHasher
import argon2
from models import Student, Teacher, Department, Lesson, TeacherLesson, LessonPrequisite, Request, RequestPreq, TA, TAComments
from database import engine
from sqlalchemy import select, exc, insert, case
import jwt
from datetime import datetime
import calendar
from crud import create_student
from pydantic import BaseModel
from schemas import StudentBase
from typing import List
from typing_extensions import TypedDict
from config import settings

secret = settings.jwt_secret

class StudentCreateRequest(BaseModel):
    student_number: str
    teacher_email: str
    lesson_name: str
    preq_grades: List[TypedDict('PreqGrade', {'preqName': str, 'grade': int})]
    is_completed: bool
    additional_note: str

class RequestUpdate(BaseModel):
    student_number: str
    teacher_username: str
    lessonName: str
    is_accepted: bool

session = Session(engine)

def login(username: str, password: str):
    ph = PasswordHasher()
    
    stm1 = select(Student).where(Student.username == username).limit(1)
    stm2 = select(Teacher).where(Teacher.username == username).limit(1)
    
    try:
        student = session.scalars(stm1).one()

        try:
            ph.verify(student.password, password)
            access = {
                "username": student.username,
                "exp": calendar.timegm(datetime.now().timetuple()) + 7200
            }
            access_token = jwt.encode(access, secret, algorithm="HS256")

            refresh = {
                "exp": calendar.timegm(datetime.now().timetuple()) + 7200 * 12 * 30 * 6
            }
            refresh_token = jwt.encode(refresh, secret, algorithm="HS256")

            return { 
                "access_token": access_token,
                "refresh_token": refresh_token
            }
        except argon2.exceptions.VerificationError:
            return {"code": "0"}
    except exc.NoResultFound:
        try:
            teacher = session.scalars(stm2).one()

            try:
                ph.verify(teacher.password, password)
                access = {
                    "username": teacher.username,
                    "exp": calendar.timegm(datetime.now().timetuple()) + 7200
                }
                access_token = jwt.encode(access, secret, algorithm="HS256")

                refresh = {
                    "exp": calendar.timegm(datetime.now().timetuple()) + 7200 * 12 * 30 * 6
                }
                refresh_token = jwt.encode(refresh, secret, algorithm="HS256")

                return { 
                    "access_token": access_token,
                    "refresh_token": refresh_token
                }
            except argon2.exceptions.VerificationError:
                return {"code": "0"}
        except exc.NoResultFound:
            return {"code": "-1"}
    except exc.SQLAlchemyError:
        return {"code": "-3"}

def register(student: StudentBase):
    ph = PasswordHasher()
    student.password = ph.hash(student.password)
    try:
        created_student = create_student(session, student)
    except exc.SQLAlchemyError:
        print(exc.SQLAlchemyError._message())
        return { "code": "0" }

    access = {
        "username": created_student.username,
        "exp": calendar.timegm(datetime.now().timetuple()) + 7200
    }
    access_token = jwt.encode(access, secret, algorithm="HS256")

    refresh = {
        "exp": calendar.timegm(datetime.now().timetuple()) + 7200 * 12 * 30 * 6
    }
    refresh_token = jwt.encode(refresh, secret, algorithm="HS256")

    return { 
        "access_token": access_token,
        "refresh_token": refresh_token
    }


def authorize(tokens): 
    try:
        access = jwt.decode(tokens.access_token, secret, algorithms=["HS256"])
        refresh = jwt.decode(tokens.refresh_token, secret, algorithms=["HS256"])
        now = calendar.timegm(datetime.now().timetuple())
        
        if access['exp'] < now:
            if refresh['exp'] > now:
                access = {
                "username": access['username'],
                "exp": calendar.timegm(datetime.now().timetuple()) + 7200
                }
                new_access_token = jwt.encode(access, secret, algorithm="HS256")
            else:
                raise Exception
            return {
                "username": access['username'],
                "new_access_token": new_access_token
            }
        
        return {
            "username": access['username'],
            "isOk": "ok"
        }
        
    except:
        return False

def isStudent(tokens):
    auth = authorize(tokens)

    if auth == False:
        return {"code": "-1"}
    
    elif 'isOk' in auth:
        stm = select(Student).where(Student.username == auth['username']).limit(1)
        stm1 = select(Teacher).where(Teacher.username == auth['username']).limit(1)

        try: 
            session.scalars(stm).one()
            return {"code": "0"}
        except exc.NoResultFound:
            try:
                session.scalars(stm1).one()
                return {"code": "1"}
            except exc.NoResultFound:
                return {"code": "-3"}
        except:
            return { "code": "-2" }
    else:
        stm = select(Student).where(Student.username == auth['username']).limit(1)
        stm1 = select(Teacher).where(Teacher.username == auth['username']).limit(1)

        try: 
            session.scalars(stm).one()
            return {"code": "00", "new_access_token": auth['new_access_token']}
        except exc.NoResultFound:
            try:
                session.scalars(stm1).one()
                return {"code": "11", "new_access_token": auth['new_access_token']}
            except exc.NoResultFound:
                return {"code": "-33"}
        except:
            return { "code": "-2" }

def getStudentById(tokens):
    auth = authorize(tokens)

    if auth == False:
        return {"code": "1"}
    
    elif 'isOk' in auth:
        stm = select(Student).where(Student.username == auth['username']).limit(1)
        try:
            student = session.scalars(stm).one()
        except:
            return {"code": "-2"}
        
        dictStudent = {
            "id": student.student_number,
            "email": student.email,
            "username": student.username,
            "name": student.name
        }

        return { 
            "student": dictStudent
        }
    else:
        stm = select(Student).where(Student.username == auth['username']).limit(1)
        try:
            student = session.scalars(stm).one()
        except:  
            return {"code": "-2"}
        
        dictStudent = {
            "id": student.student_number,
            "email": student.email,
            "username": student.username,
            "name": student.name
        }


        return { 
            "student": dictStudent,
            "new_access_token": auth['new_access_token']
        }


def getTeacherById(tokens):
    auth = authorize(tokens)

    if auth == False:
        return {"code": "1"}
    
    elif 'isOk' in auth:
        stm1 = select(Teacher).where(Teacher.username == auth['username']).limit(1)
        stm2 = select(Department.name).join(Teacher, Department.id == Teacher.dep_id).where(Teacher.username == auth['username']).limit(1)

        try:
            teacher = session.scalars(stm1).one()
            dep_name = session.scalars(stm2).one()
        except:
            return {"code": "-2"}
        
        dictTeacher = {
            "name": teacher.name,
            "username": teacher.username,
            "email": teacher.mail,
            "depName": dep_name,
        }

        return { 
            "teacher": dictTeacher,
        }
    else:
        stm1 = select(Teacher).where(Teacher.username == auth['username']).limit(1)
        stm2 = select(Department.name).join(Department, Department.id == Teacher.dep_id).where(Teacher.username == auth['username']).limit(1)

        try:
            teacher = session.scalars(stm1).one()
            dep_name = session.scalars(stm2).one()
        except:
            return {"code": "-2"}
        
        dictTeacher = {
            "name": teacher.name,
            "username": teacher.username,
            "email": teacher.mail,
            "depName": dep_name,
        }

        return { 
            "student": dictTeacher,
            "new_access_token": auth['new_access_token']
        }

def getUserById(tokens):
    student = getStudentById(tokens)
    if not 'code' in student:
        return student
    return getTeacherById(tokens)