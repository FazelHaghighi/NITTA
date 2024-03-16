from .authentication_service.register_service import IRegisterService, RegisterService
from .authentication_service.login_service import ILoginService, LoginService
from infrastructure.user_repository_in_memory import UserRepositoryInMemory
from infrastructure.jwt_token_generator import JwtTokenGenerator

def get_register_service() -> IRegisterService:
    user_repository = UserRepositoryInMemory()
    jwt_token_generator = JwtTokenGenerator()  
    return RegisterService(user_repository=user_repository, jwt_token_generator=jwt_token_generator)

def get_login_service() -> ILoginService:
    user_repository = UserRepositoryInMemory()
    jwt_token_generator = JwtTokenGenerator()
    return LoginService(user_repository=user_repository, jwt_token_generator=jwt_token_generator)