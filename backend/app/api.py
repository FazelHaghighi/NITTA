from sqlalchemy.orm import Session
from argon2 import PasswordHasher
import argon2
from models import Student
from database import engine
from sqlalchemy import select
import jwt
from datetime import datetime
import calendar

secret = "WooWyVewwyStwongSeeecwetUwU:3"

session = Session(engine)

def login(username: str, password: str):
    ph = PasswordHasher()
    
    stm = select(Student).where(Student.username == username).limit(1)
    try:
        student = session.scalars(stm).one()
    except:
        return {"code": "-1"}
    
    try:
        ph.verify(student.password, password)
        access = {
            "id": student.id,
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

def authorize(tokens): 
    try:
        access = jwt.decode(tokens.access_token, secret, algorithms=["HS256"])
        refresh = jwt.decode(tokens.refresh_token, secret, algorithms=["HS256"])
        now = calendar.timegm(datetime.now().timetuple())
        
        if access['exp'] < now:
            if refresh['exp'] > now:
                access = {
                "id": access['id'],
                "username": access['username'],
                "exp": calendar.timegm(datetime.now().timetuple()) + 7200
                }
                new_access_token = jwt.encode(access, secret, algorithm="HS256")
            else:
                raise Exception
            return {
                "studentId": access['id'],
                "new_access_token": new_access_token
            }
        
        return {
            "studentId": access['id'],
            "isOk": "ok"
        }
        
    except:
        return False

def getStudentById(tokens):
    auth = authorize(tokens)

    if auth == False:
        return {"code": "1"}
    
    elif auth['isOk'] == "ok":
        stm = select(Student).where(Student.id == auth['studentId']).limit(1)
        try:
            student = session.scalars(stm).one()
        except:
            return {"code": "-2"}
        
        dictStudent = {
            "id": student.id,
            "email": student.email,
            "username": student.username,
            "name": student.name
        }

        return { 
            "student": dictStudent,
        }
    else:
        stm = select(Student).where(Student.id == auth['studentId']).limit(1)
        try:
            student = session.scalars(stm).one()
        except:
            return {"code": "-2"}
        
        dictStudent = {
            "id": student.id,
            "email": student.email,
            "username": student.username,
            "name": student.name
        }

        return { 
            "student": dictStudent,
            "new_access_token": auth['new_access_token']
        }
