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

def getDepartmentsByName():
    stm = select(Department.name)
    try:
        session.close_all()
        session.begin()
        departments = session.scalars(stm).all()
    except:
        return {"code": "-1"}
    
    return { 
        "departments": departments
    }

def getTeachersByDepartment(dep_name: str):
    stm = select(Teacher).join(Department, Department.id == Teacher.dep_id).where(Department.name == dep_name)
    try:
        session.close_all()
        session.begin()
        teachers = session.scalars(stm).all()
    except exc.SQLAlchemyError:
        print(exc.SQLAlchemyError)
        return {"code": "-1"}
    
    return teachers

def getAllLessonsByTeacher(dep_name: str):
    lesson2 = aliased(Lesson)
    stm = select(Lesson.name.label('lesson_name'),
                Teacher.name.label('teacher_name'),
                Teacher.mail.label('teacher_email'),
                Lesson.credit_points,
                func.array_agg(lesson2.name).label('preqs')).\
        join(TeacherLesson, TeacherLesson.lesson_id == Lesson.id).\
        join(Teacher, Teacher.id == TeacherLesson.teacher_id).\
        join(LessonPrequisite, LessonPrequisite.lesson_id == Lesson.id).\
        join(lesson2, lesson2.id == LessonPrequisite.preq_id).\
        where(Teacher.dep_id == select(Department.id).where(Department.name == dep_name)).\
        group_by(Lesson.id, Teacher.id)
    
    stm2 = select(Lesson.name.label('lesson_name'),
              Teacher.name.label('teacher_name'),
              Teacher.mail.label('teacher_email'),
              Lesson.credit_points,
             ).join(TeacherLesson, TeacherLesson.lesson_id == Lesson.id).\
             join(Teacher, Teacher.id == TeacherLesson.teacher_id).\
             where(Teacher.dep_id == select(Department.id).where(Department.name == dep_name))

    stm3 = select(Lesson.name.label('lesson_name'),
              Teacher.name.label('teacher_name'),
              Teacher.mail.label('teacher_email'),
              Lesson.credit_points,).\
        join(LessonPrequisite, Lesson.id == LessonPrequisite.lesson_id).\
        join(TeacherLesson, TeacherLesson.lesson_id == Lesson.id).\
        join(Teacher, Teacher.id == TeacherLesson.teacher_id).\
        where(Teacher.dep_id == select(Department.id).where(Department.name == dep_name))

    final_stm = stm2.except_(stm3) 

    try:
        session.close_all()
        session.begin()
        lessons = session.execute(stm).mappings().all()
        remainingLessons = session.execute(final_stm).mappings().all()

        allLessons = []
        for lesson in lessons:
            allLessons.append(lesson)

        for lesson in remainingLessons:
            allLessons.append({ **lesson, "preqs": [] })
        
    except:
        return {"code": "-1"}
    
    return allLessons

def createRequest(req: StudentCreateRequest):
    if_existed = select(Request).\
        where(
            Request.student_id == select(Student.id).where(Student.student_number == req.student_number).limit(1),
            Request.teacher_id == select(Teacher.id).where(Teacher.mail == req.teacher_email).limit(1),
            Request.lesson_id == select(Lesson.id).where(Lesson.name == req.lesson_name).limit(1)
        )
    
    try:
        session.close_all()
        session.begin()
        result = session.execute(if_existed).mappings().all()
        if len(result) > 0:
            return {"code": "1"}
    except exc.SQLAlchemyError:
        session.commit()
        print(exc.SQLAlchemyError._message())
        return {"code": "-1"}
        


    stm = insert(Request).\
        values(
            student_id=select(Student.id).where(Student.student_number == req.student_number),
            teacher_id=select(Teacher.id).where(Teacher.mail == req.teacher_email),
            lesson_id=select(Lesson.id).where(Lesson.name == req.lesson_name),
            is_completed=req.is_completed,
            additional_note=req.additional_note
            )
    
    stm2 = []
    for preq in req.preq_grades:
        stm2.append( insert(RequestPreq).\
            values(
                request_id=select(Request.id).where(Request.student_id == select(Student.id).where(Student.student_number == req.student_number)).order_by(Request.created_at.desc()).limit(1),
                preq_id=select(Lesson.id).where(Lesson.name == preq['preqName']),
                grade=preq['grade']
            ))

    try:
        session.close_all()
        session.begin()
        session.execute(stm)
        for stm in stm2:
            session.execute(stm)
        session.commit()
    except exc.SQLAlchemyError:
        print(exc.SQLAlchemyError._message())
        return {"code": "-1"}
    
    return {"code": "0"}

def getTeachersStudentRequested(student_number):
    stm = select(Teacher).join(Request, Request.teacher_id == Teacher.id).\
        where(Request.student_id == select(Student.id).where(Student.student_number == student_number).limit(1)).\
        group_by(Teacher)
    
    try:
        session.close_all()
        session.begin()
        teachers = session.scalars(stm).all()
    except exc.SQLAlchemyError:
        print(exc.SQLAlchemyError)
        return {"code": "-1"}
    
    return teachers

def getLessonsStudentRequested(student_number: str):
    stm = select(Request.is_accepted.label('is_accepted'),
                    Request.is_completed.label('is_completed'),
                    Teacher.mail.label('teacher_email'), 
                    Teacher.name.label('teacher_name'),
                    Lesson.name.label('lesson_name')).\
            join(Teacher, Teacher.id == Request.teacher_id).\
            join(Lesson, Lesson.id == Request.lesson_id).\
            where(Request.student_id == select(Student.id).where(Student.student_number == student_number).limit(1))
    try:
        session.close_all()
        session.begin()
        lessons = session.execute(stm).mappings().all()
    except exc.SQLAlchemyError:
        print(exc.SQLAlchemyError)
        return {"code": "-1"}
    
    return lessons

def getLessonsByTeacher(teacher_username):
    stm = select(Lesson.name, Lesson.credit_points).\
        join(TeacherLesson, TeacherLesson.lesson_id == Lesson.id).\
        join(Teacher, Teacher.id == TeacherLesson.teacher_id).\
        where(Teacher.username == teacher_username)
    
    try:
        session.close_all()
        session.begin()
        lessons = session.execute(stm).mappings().all()
    except exc.SQLAlchemyError:
        print(exc.SQLAlchemyError)
        return {"code": "-1"}
    
    return lessons

def getStudentsRequestingFor(teacher_username):
    PreqLesson = aliased(Lesson)

    stm = select(Lesson.name.label('lessonName'),Student.name.label('studentName'),Student.email.label('studentEmail'),
                 Student.student_number.label('studentId'),
                 Lesson.credit_points.label('lessonUnit'),
                 Request.additional_note.label('additionalNote'),
                 Request.is_completed.label('isCompleted'),
                 Request.is_accepted.label('isAccepted'),
                func.array_agg(func.json_build_object(
                'lessonName', PreqLesson.name,
                'grade', RequestPreq.grade
            )).label('studentPreqsGrades')).\
            join(Request, Request.lesson_id == Lesson.id).\
            join(Student, Student.id == Request.student_id).\
            join(RequestPreq, Request.id == RequestPreq.request_id).\
            join(PreqLesson, PreqLesson.id == RequestPreq.preq_id).\
            where(Request.teacher_id == select(Teacher.id).where(Teacher.username == teacher_username).limit(1)).\
            group_by(Lesson.name,Student.name,Student.email,Lesson.credit_points,
                     Student.student_number, Request.additional_note, Request.is_completed, Request.is_accepted)
    
    stm2 = select(Lesson.name.label('lessonName'),Student.name.label('studentName'),Student.email.label('studentEmail'),
                    Student.student_number.label('studentId'),
                    Request.additional_note.label('additionalNote'),
                    Request.is_completed.label('isCompleted'),
                    Request.is_accepted.label('isAccepted'),
                    Lesson.credit_points.label('lessonUnit')).\
                join(Request, Request.lesson_id == Lesson.id).\
                join(Student, Student.id == Request.student_id)
    
    stm3 = select(Lesson.name.label('lessonName'),Student.name.label('studentName'),Student.email.label('studentEmail'),
                    Student.student_number.label('studentId'),
                    Request.additional_note.label('additionalNote'),
                    Request.is_completed.label('isCompleted'),
                    Request.is_accepted.label('isAccepted'),
                    Lesson.credit_points.label('lessonUnit')).\
                join(Request, Request.lesson_id == Lesson.id).\
                join(Student, Student.id == Request.student_id).\
                join(RequestPreq, Request.id == RequestPreq.request_id)
    
    final_stm = stm2.except_(stm3)
    

    try:
        session.close_all()
        session.begin()
        requests = session.execute(stm).mappings().all()
        remainingRequests = session.execute(final_stm).mappings().all()

        allRequests = []
        for request in requests:
            allRequests.append(request)

        for request in remainingRequests:
            allRequests.append({ **request, "studentPreqsGrades": []})
        
    except exc.SQLAlchemyError as e:
        print(e)
        return {"code": "-1"}
    
    return allRequests

def updateRequest(request: RequestUpdate):
    student_id = select(Student.id).filter(Student.student_number == request.student_number).limit(1).scalar_subquery()
    teacher_id =  select(Teacher.id).where(Teacher.username == request.teacher_username).limit(1).scalar_subquery()
    lesson_id = select(Lesson.id).where(Lesson.name == request.lessonName).limit(1).scalar_subquery()

    stm = select(Request).\
            where(Request.student_id == student_id).\
            where(Request.teacher_id == teacher_id).\
            where(Request.lesson_id == lesson_id)

    try:
        res = session.scalars(stm).one()

        if request.is_accepted:
            session.execute(
                insert(TA).\
                    values(
                        student_id=res.student_id,
                        teacher_id=res.teacher_id,
                        lesson_id=res.lesson_id,
                        rate=None,
                        comment=None,
                        num_vote=None
                        )
            )

        res.is_accepted = request.is_accepted
        res.is_completed = True
        session.commit()
    except exc.SQLAlchemyError as e:
        print(e)
        return {"code": "-1"}
    
    return {"code": "1"}

def getAllTas():
    stm = select(Student.name.label('taName'), Teacher.name.label('teacherName'), Lesson.name.label('lessonName'),
                    func.array_agg(case()).label('comments'),
                    TA.num_vote.label('voteNumbers'), func.avg(TAComments.rate),  Department.name.label('teacherDep')).\
                    join(Student, Student.id == TA.student_id).\
                    join(Teacher, Teacher.id == TA.teacher_id).join(Lesson, Lesson.id == TA.lesson_id).\
                    join(Department, Department.id == Teacher.dep_id).\
                    join(TAComments, TAComments.ta_id == TA.student_id).\
                    group_by(TA.num_vote, Student.name, Teacher.name, Lesson.name, Department.name)

    try:
        tas = session.execute(stm).mappings().all()
        print(tas)
    except exc.SQLAlchemyError as e:
        print(e)
        return {"code": "-1"}
    
    return tas
