from abc import ABC, abstractmethod
from .authentication_result import AuthenticationResult

class IRegisterService(ABC):
    @abstractmethod
    def handle(self, first_name: str, last_name: str, email: str) -> AuthenticationResult: pass