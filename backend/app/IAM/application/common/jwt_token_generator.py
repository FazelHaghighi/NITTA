from abc import ABC, abstractmethod
from domain.user import User

class IJwtTokenGenerator(ABC):
    @abstractmethod
    def generate_token(self, user: User) -> str: pass
