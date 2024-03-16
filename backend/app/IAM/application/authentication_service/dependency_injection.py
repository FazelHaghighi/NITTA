from ..authentication_service.register_service import IRegisterService, RegisterService

def get_register_service() -> IRegisterService:
    return RegisterService()