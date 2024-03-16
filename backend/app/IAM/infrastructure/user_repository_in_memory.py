from domain.user import User
from application.common.user_repository_interface import IUserRepository

class UserRepositoryInMemory(IUserRepository):
    __users: list[User] = list()

    def add(self, user: User):
        self.__users.append(user)
    
    def get_by_email(self, email: str) -> User:
        for user in self.__users:
            if user.email == email:
                return user
        return None
