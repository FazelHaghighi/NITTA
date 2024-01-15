from typing import List
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import (
    create_ta_rating, create_request, create_teacher, create_student,
    create_ta, create_lesson, create_department,
    get_students, get_tas, get_lessons, get_departments,
    get_teachers, get_requests, get_ta_ratings,
    delete_student, delete_ta, delete_lesson, delete_department,
    delete_rating, delete_request, delete_teacher,
    update_student, update_ta, update_lesson, update_department,
    update_rating, update_request, update_teacher
)
from schemas import (
    Student, TARatingCreate, TARating, Request, RequestCreate,
    Teacher, TeacherCreate, StudentCreate, Lesson, LessonCreate,
    Department, DepartmentCreate, TACreate, TA
)
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from api import authenticate
from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str


app = FastAPI()

origins = [

    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/auth")
async def authentication(user: User, db: Session = Depends(get_db)):
    return authenticate(db, user.username, user.password)

@app.post("/tas/{ta_id}/ratings/", response_model=TARating)
async def submit_ta_rating(ta_id: int, rating: TARatingCreate, db: Session = Depends(get_db)):
    return create_ta_rating(db, ta_id, rating)

@app.post("/requests/", response_model=Request)
async def submit_request(request: RequestCreate, db: Session = Depends(get_db)):
    return create_request(db, request)

@app.post("/teachers/", response_model=Teacher)
async def create_new_teacher(teacher: TeacherCreate, db: Session = Depends(get_db)):
    return create_teacher(db, teacher)

@app.post("/students/", response_model=Student)
async def create_new_student(student: StudentCreate, db: Session = Depends(get_db)):
    return create_student(db, student)

@app.post("/tas/", response_model=TA)
async def create_new_ta(ta: TACreate, db: Session = Depends(get_db)):
    return create_ta(db, ta)

@app.post("/lessons/", response_model=Lesson)
async def create_new_lesson(lesson: LessonCreate, db: Session = Depends(get_db)):
    return create_lesson(db, lesson)

@app.post("/departments/", response_model=Department)
async def create_new_department(department: DepartmentCreate, db: Session = Depends(get_db)):
    return create_department(db, department)

@app.get("/tas/", response_model=List[TA])
async def get_tas_list(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    tas = get_tas(db, skip=skip, limit=limit)
    return tas

@app.get("/lessons/", response_model=List[Lesson])
async def get_lessons_list(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    lessons = get_lessons(db, skip=skip, limit=limit)
    return lessons

@app.get("/departments/", response_model=List[Department])
async def get_departments_list(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    departments = get_departments(db, skip=skip, limit=limit)
    return departments

@app.get("/teachers/", response_model=List[Teacher])
async def get_teachers_list(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    teachers = get_teachers(db, skip=skip, limit=limit)
    return teachers

@app.get("/requests/", response_model=List[Request])
async def get_requests_list(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    requests = get_requests(db, skip=skip, limit=limit)
    return requests

@app.get("/taratings/", response_model=List[TARating])
async def get_ta_ratings_list(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    ta_ratings = get_ta_ratings(db, skip=skip, limit=limit)
    return ta_ratings

@app.get("/students/", response_model=List[Student])
async def get_students_list(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    students = get_students(db, skip=skip, limit=limit)
    return students

@app.delete("/students/{student_id}/", response_model=bool)
async def delete_student_endpoint(student_id: int, db: Session = Depends(get_db)):
    result = delete_student(db, student_id)
    if not result:
        raise HTTPException(status_code=404, detail="Student not found")
    return result

@app.delete("/tas/{ta_id}/", response_model=bool)
async def delete_ta_endpoint(ta_id: int, db: Session = Depends(get_db)):
    result = delete_ta(db, ta_id)
    if not result:
        raise HTTPException(status_code=404, detail="TA not found")
    return result

@app.delete("/lessons/{lesson_id}/", response_model=bool)
async def delete_lesson_endpoint(lesson_id: int, db: Session = Depends(get_db)):
    result = delete_lesson(db, lesson_id)
    if not result:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return result

@app.delete("/departments/{department_id}/", response_model=bool)
async def delete_department_endpoint(department_id: int, db: Session = Depends(get_db)):
    result = delete_department(db, department_id)
    if not result:
        raise HTTPException(status_code=404, detail="Department not found")
    return result

@app.delete("/ratings/{rating_id}/", response_model=bool)
async def delete_rating_endpoint(rating_id: int, db: Session = Depends(get_db)):
    result = delete_rating(db, rating_id)
    if not result:
        raise HTTPException(status_code=404, detail="Rating not found")
    return result

@app.delete("/requests/{request_id}/", response_model=bool)
async def delete_request_endpoint(request_id: int, db: Session = Depends(get_db)):
    result = delete_request(db, request_id)
    if not result:
        raise HTTPException(status_code=404, detail="Request not found")
    return result

@app.delete("/teachers/{teacher_id}/", response_model=bool)
async def delete_teacher_endpoint(teacher_id: int, db: Session = Depends(get_db)):
    result = delete_teacher(db, teacher_id)
    if not result:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return result

@app.put("/students/{student_id}/", response_model=Student)
async def update_student_endpoint(student_id: int, student: StudentCreate, db: Session = Depends(get_db)):
    return update_student(db, student_id, student)

@app.put("/tas/{ta_id}/", response_model=TA)
async def update_ta_endpoint(ta_id: int, ta: TACreate, db: Session = Depends(get_db)):
    return update_ta(db, ta_id, ta)

@app.put("/lessons/{lesson_id}/", response_model=Lesson)
async def update_lesson_endpoint(lesson_id: int, lesson: LessonCreate, db: Session = Depends(get_db)):
    return update_lesson(db, lesson_id, lesson)

@app.put("/departments/{department_id}/", response_model=Department)
async def update_department_endpoint(department_id: int, department: DepartmentCreate, db: Session = Depends(get_db)):
    return update_department(db, department_id, department)

@app.put("/ratings/{rating_id}/", response_model=TARating)
async def update_rating_endpoint(rating_id: int, rating: TARatingCreate, db: Session = Depends(get_db)):
    return update_rating(db, rating_id, rating)

@app.put("/requests/{request_id}/", response_model=Request)
async def update_request_endpoint(request_id: int, request: RequestCreate, db: Session = Depends(get_db)):
    return update_request(db, request_id, request)

@app.put("/teachers/{teacher_id}/", response_model=Teacher)
async def update_teacher_endpoint(teacher_id: int, teacher: TeacherCreate, db: Session = Depends(get_db)):
    return update_teacher(db, teacher_id, teacher)



# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
