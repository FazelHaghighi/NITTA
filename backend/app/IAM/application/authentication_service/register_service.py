from domain.user import User
from .authentication_result import AuthenticationResult
from .register_service_interface import IRegisterService
from ..common.user_repository_interface import IUserRepository
from ..common.jwt_token_generator_interface import IJwtTokenGenerator
class RegisterService(IRegisterService):
    def __init__(self, user_repository: IUserRepository, jwt_token_generator: IJwtTokenGenerator):
        self.__user_repository = user_repository
        self.__jwt_token_generator = jwt_token_generator

    def handle(self, first_name: str, last_name: str, email: str):

        #check if user exists
        if self.__user_repository.get_by_phone(email):
            raise Exception("User already exists")

        #create user
        user = User(
            first_name=first_name, 
            last_name=last_name, 
            email=email
        )

        #save user
        self.__user_repository.add(user)

        #create token
        token = self.__jwt_token_generator.generate_token(user)

        #return newlly created user
        return AuthenticationResult(user=user, token=token)
