from abc import ABC, abstractmethod
from domain.user import User
from .authentication_result import AuthenticationResult


class IRegisterService(ABC):
    @abstractmethod
    def handle(self, first_name: str, last_name: str, enail: str) -> AuthenticationResult: pass


class RegisterService(IRegisterService):
    def handle(self, first_name: str, last_name: str, enail: str):
        #check if user exists

        #create user
        user = User(
            first_name=first_name, 
            last_name=last_name, 
            enail=enail
        )

        #save user

        #create token
        token = "1234"

        #return newlly created user
        return AuthenticationResult(user=user, token=token)
        
