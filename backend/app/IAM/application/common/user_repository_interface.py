from abc import ABC, abstractmethod
from domain.user import User

class IUserRepository(ABC):
    @abstractmethod
    def add(self, user: User): pass

    @abstractmethod
    def get_by_phone(self, email: str) -> User: pass
