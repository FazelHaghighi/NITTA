from .login_service_interface import ILoginService
from .authentication_result import AuthenticationResult
from ..common.user_repository_interface import IUserRepository
from ..common.jwt_token_generator_interface import IJwtTokenGenerator

class LoginService(ILoginService):
    def __init__(self, user_repository: IUserRepository, jwt_token_generator: IJwtTokenGenerator):
        self._user_repository = user_repository
        self._jwt_token_generator = jwt_token_generator

    def handle(self, email: str, code: int) -> AuthenticationResult:
        existing_user = self._user_repository.get_by_email(email)
        if existing_user is None:
            raise Exception("User not found")
        
        token = self._jwt_token_generator.generate_token(existing_user)
        
        return AuthenticationResult(user=existing_user, token=token)
