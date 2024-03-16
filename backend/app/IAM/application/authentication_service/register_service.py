from domain.user import User
from .authentication_result import AuthenticationResult
from .register_service_interface import IRegisterService
from ..common.user_repository_interface import IUserRepository
from ..common.jwt_token_generator_interface import IJwtTokenGenerator
class RegisterService(IRegisterService):
    def __init__(self, user_repository: IUserRepository, jwt_token_generator: IJwtTokenGenerator):
        self._user_repository = user_repository
        self._jwt_token_generator = jwt_token_generator

    def handle(self, first_name: str, last_name: str, email: str):

        #check if user exists
        if self._user_repository.get_by_email(email):
            raise Exception("User already exists")

        #create user
        user = User(
            first_name=first_name, 
            last_name=last_name, 
            email=email
        )

        #save user
        self._user_repository.add(user)

        #create token
        token = self._jwt_token_generator.generate_token(user)

        #return newlly created user
        return AuthenticationResult(user=user, token=token)
