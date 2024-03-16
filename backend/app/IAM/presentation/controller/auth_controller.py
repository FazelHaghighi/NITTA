from fastapi import APIRouter, Depends, HTTPException, status
from application.authentication_service.register_service import IRegisterService
from application.common.dependency_injection import get_register_service

router = APIRouter(prefix="/auth", tags=["auth"])

class AuthController():
    def __init__(self, register_service: IRegisterService) -> None:
        self._register_service = register_service

    @router.post("/register")
    def register(first_name: str, last_name: str, email: str, register_service: IRegisterService = Depends(get_register_service)):
        try:
            result = register_service.handle(first_name, last_name, email)
            return result
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        
    @router.post("/login")
    def login():
        return {"message": "login"}
