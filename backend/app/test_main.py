from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from main import app, get_db
from models import Department
from database import engine


def override_get_db():
    try:
        db = Session(bind=engine)
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_create_teacher():
    response = client.post(
        "/teachers/",
        json={
            "username": "mehdi",
            "name": "مهدی عمادی",
            "mail": "emadi@gmail.com",
            "password": "1234",
            "dep_id": 4,
            "lesson_id": 1,
        },
    )
    assert response.status_code == 200
    assert response.json() == {
        "username": "mehdi",
        "name": "مهدی عمادی",
        "mail": "emadi@gmail.com",
        "password": "1234",
        "dep_id": 4,
        "lesson_id": 1,
        "id": 20,
    }


def test_update_teacher():
    response = client.put(
        "/teachers/20/",
        json={
            "username": "mehdi",
            "name": "مهدی عمادی",
            "mail": "emadi@gmail.com",
            "password": "1234",
            "dep_id": 4,
            "lesson_id": 5,
        },
    )
    assert response.status_code == 200
    assert response.json() == {
        "username": "mehdi",
        "name": "مهدی عمادی",
        "mail": "emadi@gmail.com",
        "password": "1234",
        "dep_id": 4,
        "lesson_id": 5,
        "id": 20,
    }


def test_delete_teacher():
    response = client.delete("/teachers/20/")
    assert response.status_code == 200
    assert response.json() == True


def test_get_teachers():
    response = client.get("/teachers/")
    assert response.status_code == 200
    assert response.json() == [
        {
            "username": "hesam",
            "name": "حسام عمرانپور",
            "mail": "hesam.omranpour@gmail.com",
            "password": "1234",
            "dep_id": 4,
            "lesson_id": 1,
            "id": 1,
        }
    ]
