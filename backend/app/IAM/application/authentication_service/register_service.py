from domain.user import User
from .authentication_result import AuthenticationResult
from .register_service_interface import IRegisterService


class RegisterService(IRegisterService):
    def handle(self, first_name: str, last_name: str, email: str):
        #check if user exists

        #create user
        user = User(
            first_name=first_name, 
            last_name=last_name, 
            email=email
        )

        #save user

        #create token
        token = "1234"

        #return newlly created user
        return AuthenticationResult(user=user, token=token)
