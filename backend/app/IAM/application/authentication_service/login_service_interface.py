from abc import ABC, abstractmethod
from .authentication_result import AuthenticationResult

class ILoginService(ABC):
    @abstractmethod
    def handle(self, email: str, code: int) -> AuthenticationResult: pass
