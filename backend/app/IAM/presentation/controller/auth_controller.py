from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])

class AuthContoller():
    @router.post("/register")
    def register():
        return {"message": "register"}
    
    @router.post("/login")
    def login():
        return {"message": "login"}